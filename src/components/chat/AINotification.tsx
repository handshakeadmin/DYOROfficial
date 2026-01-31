"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Sparkles } from "lucide-react";
import { useChat } from "@/context/ChatContext";

const NOTIFICATION_DISMISSED_KEY = "dyorwellness-ai-notification-dismissed";
const NOTIFICATION_DELAY_MS = 15000; // 15 seconds

export function AINotification(): React.JSX.Element | null {
  const { isOpen: isChatOpen, openChat } = useChat();
  const [showNotification, setShowNotification] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem(NOTIFICATION_DISMISSED_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => {
      if (!isChatOpen) {
        setShowNotification(true);
      }
    }, NOTIFICATION_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isChatOpen]);

  // Hide notification when chat opens
  useEffect(() => {
    if (isChatOpen && showNotification) {
      setShowNotification(false);
      sessionStorage.setItem(NOTIFICATION_DISMISSED_KEY, "true");
    }
  }, [isChatOpen, showNotification]);

  const dismissNotification = useCallback((): void => {
    setIsHiding(true);
    setTimeout(() => {
      setShowNotification(false);
      setIsHiding(false);
      sessionStorage.setItem(NOTIFICATION_DISMISSED_KEY, "true");
    }, 200);
  }, []);

  const handleClick = useCallback((): void => {
    setShowNotification(false);
    sessionStorage.setItem(NOTIFICATION_DISMISSED_KEY, "true");
    openChat();
  }, [openChat]);

  if (!showNotification) return null;

  return (
    <>
      {/* Desktop Notification - positioned to point at AI button in header */}
      <div
        className={`
          hidden sm:block fixed top-[120px] right-[140px] z-[60] w-72
          transition-all duration-200
          ${isHiding ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0 animate-in slide-in-from-top-2"}
        `}
      >
        {/* Arrow pointing up to the icon */}
        <div className="absolute -top-2 right-6 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 border-l border-t border-border rotate-45 z-10" />

        {/* Card container */}
        <div className="bg-white rounded-xl shadow-xl border border-border overflow-hidden">
        <div className="relative bg-gradient-to-r from-primary to-primary/80 p-3 flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="text-sm font-semibold text-white">AI Research Assistant</span>
          <button
            type="button"
            onClick={dismissNotification}
            className="ml-auto p-1 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted leading-relaxed mb-3">
            Questions about peptides, purity, or protocols? Our AI assistant can help with your research.
          </p>
          <button
            type="button"
            onClick={handleClick}
            className="w-full py-2 px-4 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Ask a Question
          </button>
        </div>
        </div>
      </div>

      {/* Mobile Notification - bottom of screen */}
      <div
        className={`
          sm:hidden fixed bottom-4 left-4 right-4 z-[60]
          bg-white rounded-xl shadow-xl border border-border overflow-hidden
          transition-all duration-200
          ${isHiding ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0 animate-in slide-in-from-bottom-4"}
        `}
      >
        <div className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground mb-1">AI Research Assistant</p>
            <p className="text-xs text-muted leading-relaxed">
              Need help? Our AI can answer questions about peptides and research.
            </p>
          </div>
          <button
            type="button"
            onClick={dismissNotification}
            className="p-1 text-muted hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={handleClick}
            className="w-full py-2.5 px-4 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Ask a Question
          </button>
        </div>
      </div>
    </>
  );
}
