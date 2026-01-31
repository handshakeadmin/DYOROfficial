"use client";

import dynamic from "next/dynamic";

// Dynamic imports for chat components to avoid SSR issues
const ChatWidget = dynamic(
  () => import("@/components/chat/ChatWidget").then((mod) => mod.ChatWidget),
  { ssr: false }
);

const AINotification = dynamic(
  () => import("@/components/chat/AINotification").then((mod) => mod.AINotification),
  { ssr: false }
);

export function ChatWidgetLoader(): React.JSX.Element {
  return (
    <>
      <ChatWidget />
      <AINotification />
    </>
  );
}
