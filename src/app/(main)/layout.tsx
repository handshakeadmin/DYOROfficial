import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidgetLoader } from "@/components/chat/ChatWidgetLoader";
import { ChatProvider } from "@/context/ChatContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <ChatProvider>
      <Header />

      <main className="flex-1">{children}</main>

      <Footer />
      <ChatWidgetLoader />
    </ChatProvider>
  );
}
