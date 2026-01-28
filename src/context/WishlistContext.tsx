"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { Product, WishlistItem } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  addToWishlist as addToWishlistServer,
  removeFromWishlist as removeFromWishlistServer,
  clearWishlist as clearWishlistServer,
  mergeGuestWishlist,
  getWishlist,
} from "@/app/actions/wishlist";
import { getProductById } from "@/data/products";

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  isSyncing: boolean;
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_WISHLIST" }
  | { type: "LOAD_WISHLIST"; payload: WishlistItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SYNCING"; payload: boolean };

interface WishlistContextType extends WishlistState {
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "peptidesource-wishlist";

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.some(
        (item) => item.product.id === action.payload.id
      );

      if (exists) {
        return state;
      }

      return {
        ...state,
        items: [
          ...state.items,
          { product: action.payload, addedAt: new Date().toISOString() },
        ],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
      };

    case "CLEAR_WISHLIST":
      return { ...state, items: [] };

    case "LOAD_WISHLIST":
      return { ...state, items: action.payload, isLoading: false };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_SYNCING":
      return { ...state, isSyncing: action.payload };

    default:
      return state;
  }
}

function getLocalStorageWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to parse wishlist from localStorage", e);
  }
  return [];
}

function setLocalStorageWishlist(items: WishlistItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function clearLocalStorageWishlist(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function WishlistProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    isLoading: true,
    isSyncing: false,
  });

  const syncWithServer = useCallback(async (): Promise<void> => {
    if (!user) return;

    dispatch({ type: "SET_SYNCING", payload: true });

    try {
      const { items: serverItems } = await getWishlist();

      if (serverItems.length > 0) {
        const wishlistItems: WishlistItem[] = serverItems
          .map((productId: string) => {
            const product = getProductById(productId);
            if (product) {
              return { product, addedAt: new Date().toISOString() };
            }
            return null;
          })
          .filter((item): item is WishlistItem => item !== null);

        dispatch({ type: "LOAD_WISHLIST", payload: wishlistItems });
      }
    } catch (error) {
      console.error("Failed to sync wishlist with server:", error);
    } finally {
      dispatch({ type: "SET_SYNCING", payload: false });
    }
  }, [user]);

  useEffect(() => {
    const initWishlist = async (): Promise<void> => {
      if (user) {
        const guestWishlist = getLocalStorageWishlist();

        if (guestWishlist.length > 0) {
          const guestIds = guestWishlist.map((item) => item.product.id);
          await mergeGuestWishlist(guestIds);
          clearLocalStorageWishlist();
        }

        await syncWithServer();
      } else {
        const localWishlist = getLocalStorageWishlist();
        dispatch({ type: "LOAD_WISHLIST", payload: localWishlist });
      }
    };

    initWishlist();
  }, [user, syncWithServer]);

  useEffect(() => {
    if (!user && !state.isLoading) {
      setLocalStorageWishlist(state.items);
    }
  }, [state.items, user, state.isLoading]);

  const addItem = useCallback(
    async (product: Product): Promise<void> => {
      dispatch({ type: "ADD_ITEM", payload: product });

      if (user) {
        const result = await addToWishlistServer(product.id);
        if (!result.success) {
          console.error("Failed to add item to server wishlist:", result.error);
        }
      }
    },
    [user]
  );

  const removeItem = useCallback(
    async (productId: string): Promise<void> => {
      dispatch({ type: "REMOVE_ITEM", payload: productId });

      if (user) {
        const result = await removeFromWishlistServer(productId);
        if (!result.success) {
          console.error("Failed to remove item from server wishlist:", result.error);
        }
      }
    },
    [user]
  );

  const clearWishlist = useCallback(async (): Promise<void> => {
    dispatch({ type: "CLEAR_WISHLIST" });

    if (user) {
      const result = await clearWishlistServer();
      if (!result.success) {
        console.error("Failed to clear server wishlist:", result.error);
      }
    }
  }, [user]);

  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return state.items.some((item) => item.product.id === productId);
    },
    [state.items]
  );

  const toggleItem = useCallback(
    (product: Product): void => {
      if (isInWishlist(product.id)) {
        removeItem(product.id);
      } else {
        addItem(product);
      }
    },
    [isInWishlist, addItem, removeItem]
  );

  const totalItems = state.items.length;

  return (
    <WishlistContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
        toggleItem,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
