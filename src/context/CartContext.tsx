"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { CartItem, Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  addToCart as addToCartServer,
  updateCartItemQuantity,
  removeFromCart as removeFromCartServer,
  clearCart as clearCartServer,
  mergeGuestCart,
  getCart,
  type CartItemData,
} from "@/app/actions/cart";
import { products, getProductById } from "@/data/products";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  isSyncing: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SYNCING"; payload: boolean };

interface CartContextType extends CartState {
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "peptidesource-cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.id !== action.payload.productId
          ),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "LOAD_CART":
      return { ...state, items: action.payload, isLoading: false };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_SYNCING":
      return { ...state, isSyncing: action.payload };

    default:
      return state;
  }
}

function getLocalStorageCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to parse cart from localStorage", e);
  }
  return [];
}

function setLocalStorageCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function clearLocalStorageCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function CartProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isLoading: true,
    isSyncing: false,
  });

  const syncWithServer = useCallback(async (): Promise<void> => {
    if (!user) return;

    dispatch({ type: "SET_SYNCING", payload: true });

    try {
      const { items: serverItems } = await getCart();

      if (serverItems.length > 0) {
        const cartItems: CartItem[] = serverItems
          .map((item: CartItemData) => {
            const product = getProductById(item.productId);
            if (product) {
              return { product, quantity: item.quantity };
            }
            return null;
          })
          .filter((item): item is CartItem => item !== null);

        dispatch({ type: "LOAD_CART", payload: cartItems });
      }
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
    } finally {
      dispatch({ type: "SET_SYNCING", payload: false });
    }
  }, [user]);

  useEffect(() => {
    const initCart = async (): Promise<void> => {
      if (user) {
        const guestCart = getLocalStorageCart();

        if (guestCart.length > 0) {
          const guestCartData: CartItemData[] = guestCart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          }));
          await mergeGuestCart(guestCartData);
          clearLocalStorageCart();
        }

        await syncWithServer();
      } else {
        const localCart = getLocalStorageCart();
        dispatch({ type: "LOAD_CART", payload: localCart });
      }
    };

    initCart();
  }, [user, syncWithServer]);

  useEffect(() => {
    if (!user && !state.isLoading) {
      setLocalStorageCart(state.items);
    }
  }, [state.items, user, state.isLoading]);

  const addItem = useCallback(
    async (product: Product): Promise<void> => {
      dispatch({ type: "ADD_ITEM", payload: product });

      if (user) {
        const result = await addToCartServer(product.id);
        if (!result.success) {
          console.error("Failed to add item to server cart:", result.error);
        }
      }
    },
    [user]
  );

  const removeItem = useCallback(
    async (productId: string): Promise<void> => {
      dispatch({ type: "REMOVE_ITEM", payload: productId });

      if (user) {
        const result = await removeFromCartServer(productId);
        if (!result.success) {
          console.error("Failed to remove item from server cart:", result.error);
        }
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number): Promise<void> => {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });

      if (user) {
        const result = await updateCartItemQuantity(productId, quantity);
        if (!result.success) {
          console.error("Failed to update cart item on server:", result.error);
        }
      }
    },
    [user]
  );

  const clearCart = useCallback(async (): Promise<void> => {
    dispatch({ type: "CLEAR_CART" });

    if (user) {
      const result = await clearCartServer();
      if (!result.success) {
        console.error("Failed to clear server cart:", result.error);
      }
    }
  }, [user]);

  const toggleCart = useCallback((): void => {
    dispatch({ type: "TOGGLE_CART" });
  }, []);

  const openCart = useCallback((): void => {
    dispatch({ type: "OPEN_CART" });
  }, []);

  const closeCart = useCallback((): void => {
    dispatch({ type: "CLOSE_CART" });
  }, []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
