import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChats, ChatMessage } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { ChatInput } from "./ChatInput";
import { MessageBubble, TypingBubble } from "./MessageBubble";
import { sendChat } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { Lightbulb, FileSearch, ListChecks, Sparkles as SparklesIcon } from "lucide-react";

export const ChatContainer = () => {
  const { user } = useAuth();
  const { active, appendMessage, newChat } = useChats();
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages: ChatMessage[] = active?.messages ?? [];
  const isEmpty = messages.length === 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, loading]);

  const handleSend = async (text: string) => {
    if (!active) newChat();
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    appendMessage(userMsg);
    setLoading(true);
    try {
      const answer = await sendChat(text);
      appendMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer || "_No answer returned._",
      });
    } catch {
      toast.error("Failed to reach the assistant. Please try again.");
      appendMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "⚠️ Sorry, I couldn't reach the server. Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-gradient-subtle">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
          {isEmpty ? (
            <Hero name={user?.name?.split(" ")[0] ?? "there"} onPick={handleSend} />
          ) : (
            <div className="flex flex-col gap-5 pb-4">
              <AnimatePresence initial={false}>
                {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
                {loading && <TypingBubble key="typing" />}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
};

const SUGGESTIONS = [
  { icon: FileSearch, title: "Synthesize Data", text: "Turn my meeting notes into 5 key bullet points for the team." },
  { icon: Lightbulb, title: "Creative Brainstorm", text: "Generate 3 taglines for a new sustainable fashion brand." },
  { icon: ListChecks, title: "Check Facts", text: "Compare key differences between GDPR and CCPA." },
  { icon: SparklesIcon, title: "Summarize Docs", text: "Summarize the key points of my uploaded documents." },
];

const Hero = ({ name, onPick }: { name: string; onPick: (t: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center pt-10 text-center"
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="orb mb-6 h-24 w-24"
    />

    <h2 className="text-xl font-medium text-primary">Hello, {name}</h2>
    <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
      How can I assist you today?
    </h1>

    <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {SUGGESTIONS.map((s, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          onClick={() => onPick(s.text)}
          className="group flex flex-col items-start gap-2 rounded-2xl border border-border bg-surface-elevated p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <s.icon className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold">{s.title}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{s.text}</p>
        </motion.button>
      ))}
    </div>
  </motion.div>
);
