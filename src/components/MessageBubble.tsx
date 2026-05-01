import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/contexts/ChatContext";

export type { ChatMessage };

export const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary shadow-soft">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-soft",
          isUser
            ? "bg-bubble-user text-bubble-user-foreground rounded-br-md"
            : "bg-bubble-bot text-bubble-bot-foreground rounded-bl-md"
        )}
      >
        <div className="prose-chat">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-soft">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
};

export const TypingBubble = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex w-full gap-3 justify-start"
  >
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary shadow-soft">
      <Sparkles className="h-4 w-4 text-primary-foreground" />
    </div>
    <div className="rounded-2xl rounded-bl-md bg-bubble-bot px-4 py-3 shadow-soft">
      <div className="flex items-center gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  </motion.div>
);
