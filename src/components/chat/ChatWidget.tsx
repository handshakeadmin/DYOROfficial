"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent, type KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import { X, Send, Bot } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { AddToCartChatButton } from "./AddToCartChatButton";
import { getProductBySlug } from "@/data/products";
import styles from "./ChatWidget.module.css";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
  isAuthenticated?: boolean;
  userName?: string;
}

const STORAGE_KEY = "dyorwellness-chat-history";
const MAX_HISTORY_MESSAGES = 20;

const QUICK_ACTIONS = [
  "What peptides do you recommend for research?",
  "Tell me about BPC-157",
  "What are your shipping policies?",
  "Show me your best sellers",
];

const QUICK_ACTIONS_AUTH = [
  "What's the status of my recent order?",
  "Show me my order history",
  "Recommend products based on my orders",
  "Help me with my account",
];

export function ChatWidget(): React.JSX.Element {
  const { user, profile } = useAuth();
  const { isOpen, closeChat } = useChat();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; right: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInitializedRef = useRef(false);

  // Load chat history from session storage
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Array<Omit<ChatMessage, "timestamp"> & { timestamp: string }>;
        setMessages(
          parsed.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
  }, []);

  // Save chat history to session storage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const toSave = messages.slice(-MAX_HISTORY_MESSAGES);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (e) {
        console.error("Failed to save chat history:", e);
      }
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus textarea when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Track AI button position to anchor the chat popup (desktop only)
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = (): void => {
      // Only apply anchor positioning on desktop (> 640px)
      if (window.innerWidth <= 640) {
        setAnchorPosition(null);
        return;
      }

      const button = document.getElementById("ai-assistant-button");
      if (button) {
        const rect = button.getBoundingClientRect();
        setAnchorPosition({
          top: rect.bottom + 8, // 8px gap below button
          right: window.innerWidth - rect.right,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isOpen]);

  // Auto-resize textarea
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const textarea = e.target;
    setInputValue(textarea.value);

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";
    // Set height to scrollHeight, but cap at max-height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
  }, []);

  const generateMessageId = (): string => {
    return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const sendMessage = async (messageText: string): Promise<void> => {
    if (!messageText.trim() || isLoading) return;

    setError(null);
    setRateLimited(false);

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: "user",
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      // Build history for API (last 10 messages, excluding the new one)
      const historyForApi = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText.trim(),
          history: historyForApi,
        }),
      });

      const data: ChatResponse = await response.json();

      if (response.status === 429) {
        setRateLimited(true);
        setError("Too many messages. Please wait a moment before sending another.");
        return;
      }

      if (!data.success || !data.response) {
        setError(data.error || "Failed to get a response. Please try again.");
        return;
      }

      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError("Failed to send message. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleQuickAction = (action: string): void => {
    sendMessage(action);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  // Helper to extract text content from React children
  const getTextContent = (children: React.ReactNode): string => {
    if (typeof children === "string") return children;
    if (Array.isArray(children)) return children.map(getTextContent).join("");
    if (children && typeof children === "object" && "props" in children) {
      const element = children as React.ReactElement<{ children?: React.ReactNode }>;
      return getTextContent(element.props.children);
    }
    return "";
  };

  // Custom renderer for product links in markdown
  const renderMessage = (content: string): React.JSX.Element => {
    return (
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            // Check if this is a product link
            const productMatch = href?.match(/\/products\/([a-z0-9-]+)/);
            if (productMatch) {
              const slug = productMatch[1];
              const product = getProductBySlug(slug);

              if (product) {
                return (
                  <span className={styles.productCard}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[0] || "/images/placeholder.jpg"}
                      alt={product.name}
                    />
                    <span className={styles.productCardInfo}>
                      <span className={styles.productCardName}>{product.name}</span>
                      <span className={styles.productCardPrice}>${product.price.toFixed(2)} · {product.dosage}</span>
                    </span>
                    <AddToCartChatButton productSlug={slug} productName={product.name} />
                  </span>
                );
              }
            }

            // Regular link
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          strong: ({ children }) => {
            const text = getTextContent(children).trim();
            // Detect price patterns like $49, $149.99 and dosage patterns like 5mg, 10mg, 50mcg
            const isPrice = text.includes("$") || /\d+\s*(mg|mcg)\b/i.test(text);

            return (
              <strong className={isPrice ? styles.chatPrice : undefined}>
                {children}
              </strong>
            );
          },
          ul: ({ children }) => <ul className={styles.chatList}>{children}</ul>,
          li: ({ children }) => <li>{children}</li>,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  const quickActions = user ? QUICK_ACTIONS_AUTH : QUICK_ACTIONS;

  if (!isOpen) return <></>;

  return (
    <>
      {/* Mobile Overlay */}
      <div className={styles.overlay} onClick={closeChat} />

          <div
            className={styles.chatContainer}
            style={anchorPosition ? {
              top: `${anchorPosition.top}px`,
              right: `${anchorPosition.right}px`,
              bottom: "auto",
            } : undefined}
          >
            {/* Header */}
            <header className={styles.chatHeader}>
              <div className={styles.headerInfo}>
                <div className={styles.headerIcon}>
                  <Bot />
                </div>
                <div className={styles.headerText}>
                  <h3>DYOR Assistant</h3>
                  <p>Research Support</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeChat}
                className={styles.closeButton}
                aria-label="Close chat"
              >
                <X />
              </button>
            </header>

            {/* Auth Status */}
            <div className={`${styles.authStatus} ${user ? styles.authenticated : ""}`}>
              <span className={styles.authStatusIcon} />
              {user ? (
                <span>Signed in as {profile?.first_name || user.email}</span>
              ) : (
                <span>Guest mode - Sign in for order help</span>
              )}
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              {messages.length === 0 ? (
                <div className={styles.welcomeMessage}>
                  <h4>Welcome{user && profile?.first_name ? `, ${profile.first_name}` : ""}!</h4>
                  <p>
                    I can help with product information, research questions, and{" "}
                    {user ? "your orders" : "more"}. How can I assist you today?
                  </p>
                  <div className={styles.quickActions}>
                    {quickActions.map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => handleQuickAction(action)}
                        className={styles.quickAction}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${
                      message.role === "user" ? styles.userMessage : styles.assistantMessage
                    }`}
                  >
                    <div className={styles.messageBubble}>
                      {message.role === "assistant"
                        ? renderMessage(message.content)
                        : message.content}
                    </div>
                    <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                  </div>
                ))
              )}

              {/* Typing Indicator */}
              {isLoading && (
                <div className={`${styles.message} ${styles.assistantMessage}`}>
                  <div className={styles.typingIndicator}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && <div className={styles.errorMessage}>{error}</div>}

              <div ref={messagesEndRef} />
            </div>

            {/* Rate Limit Warning */}
            {rateLimited && (
              <div className={styles.rateLimitWarning}>
                Please wait a moment before sending another message.
              </div>
            )}

            {/* Input */}
            <div className={styles.inputContainer}>
              <form onSubmit={handleSubmit} className={styles.inputWrapper}>
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className={styles.sendButton}
                  aria-label="Send message"
                >
                  <Send />
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className={styles.poweredBy}>
              Powered by <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer">Claude AI</a>
            </div>
          </div>
    </>
  );
}
