import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

type ChatContextType = {
  conversations: Conversation[];
  activeId: string | null;
  active: Conversation | null;
  newChat: () => string;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  appendMessage: (msg: ChatMessage) => void;
  renameChat: (id: string, title: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

const keyFor = (userId: string) => `ai-assistant:chats:${userId}`;

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Load on user change
  useEffect(() => {
    if (!user) {
      setConversations([]);
      setActiveId(null);
      return;
    }
    try {
      const raw = localStorage.getItem(keyFor(user.id));
      const parsed: Conversation[] = raw ? JSON.parse(raw) : [];
      setConversations(parsed);
      setActiveId(parsed[0]?.id ?? null);
    } catch {
      setConversations([]);
    }
  }, [user]);

  // Persist
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(keyFor(user.id), JSON.stringify(conversations));
  }, [conversations, user]);

  const newChat = useCallback(() => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const conv: Conversation = {
      id,
      title: "New chat",
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    setConversations((c) => [conv, ...c]);
    setActiveId(id);
    return id;
  }, []);

  const selectChat = useCallback((id: string) => setActiveId(id), []);

  const deleteChat = useCallback((id: string) => {
    setConversations((c) => c.filter((x) => x.id !== id));
    setActiveId((a) => (a === id ? null : a));
  }, []);

  const appendMessage = useCallback((msg: ChatMessage) => {
    setConversations((convs) => {
      let id = activeId;
      let list = convs;
      if (!id) {
        id = crypto.randomUUID();
        const now = new Date().toISOString();
        list = [{ id, title: "New chat", messages: [], createdAt: now, updatedAt: now }, ...convs];
        setActiveId(id);
      }
      return list.map((c) => {
        if (c.id !== id) return c;
        const messages = [...c.messages, msg];
        const title =
          c.title === "New chat" && msg.role === "user"
            ? msg.content.slice(0, 40) + (msg.content.length > 40 ? "…" : "")
            : c.title;
        return { ...c, messages, title, updatedAt: new Date().toISOString() };
      });
    });
  }, [activeId]);

  const renameChat = useCallback((id: string, title: string) => {
    setConversations((c) => c.map((x) => (x.id === id ? { ...x, title } : x)));
  }, []);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  return (
    <ChatContext.Provider
      value={{ conversations, activeId, active, newChat, selectChat, deleteChat, appendMessage, renameChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChats = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChats must be used inside ChatProvider");
  return ctx;
};
