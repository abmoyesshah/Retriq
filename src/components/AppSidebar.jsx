// src/components/AppSidebar.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Plus, Search, Compass, Library, Files, History, LogOut,
  Settings as SettingsIcon, MessageSquare, Trash2, Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useChats } from "@/contexts/ChatContext";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: Compass, label: "Explore", href: "/" },
  { icon: Library, label: "Library", href: "/" },
  { icon: Files, label: "Files", href: "/settings" },
  { icon: History, label: "History", href: "/" },
];

const groupByDate = (convs) => {
  const today = [];
  const yesterday = [];
  const week = [];
  const older = [];
  const now = Date.now();
  const day = 86400000;
  for (const c of convs) {
    const age = now - new Date(c.updatedAt).getTime();
    if (age < day) today.push(c);
    else if (age < day * 2) yesterday.push(c);
    else if (age < day * 7) week.push(c);
    else older.push(c);
  }
  return { today, yesterday, week, older };
};

export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const { conversations, activeId, newChat, selectChat, deleteChat } = useChats();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const filtered = useMemo(
    () => conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase())),
    [conversations, search]
  );
  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const handleNew = () => {
    newChat();
    if (pathname !== "/") router.push("/");
  };

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-sidebar-accent-foreground">Cortex</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* New chat */}
      <div className="px-3">
        <button
          onClick={handleNew}
          className="flex w-full items-center gap-2 rounded-xl bg-foreground px-3 py-2.5 text-sm font-medium text-background shadow-soft transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" />
          New chat
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-8 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-sidebar-border bg-sidebar px-1.5 py-0.5 text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2 pt-3">
        {NAV.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        ))}
      </nav>

      {/* History */}
      <div className="mt-2 flex-1 overflow-y-auto scrollbar-thin px-2 pb-2">
        <Group title="Today" items={groups.today} activeId={activeId} onSelect={selectChat} onDelete={deleteChat} />
        <Group title="Yesterday" items={groups.yesterday} activeId={activeId} onSelect={selectChat} onDelete={deleteChat} />
        <Group title="Last 7 days" items={groups.week} activeId={activeId} onSelect={selectChat} onDelete={deleteChat} />
        <Group title="Older" items={groups.older} activeId={activeId} onSelect={selectChat} onDelete={deleteChat} />
        {conversations.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            No chats yet. Start a new conversation.
          </p>
        )}
      </div>

      {/* User footer */}
      {user && (
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2.5 rounded-lg p-1.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white shadow-soft"
              style={{ backgroundColor: `hsl(${user.avatarColor})` }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-accent-foreground">{user.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
            </div>
            <button
              onClick={() => router.push("/settings")}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label="Settings"
            >
              <SettingsIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

const Group = ({ title, items, activeId, onSelect, onDelete }) => {
  if (items.length === 0) return null;
  return (
    <div className="mt-3">
      <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">{title}</p>
      <ul>
        {items.map((c) => (
          <li key={c.id} className="group/item">
            <button
              onClick={() => onSelect(c.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
                activeId === c.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
              <span className="min-w-0 flex-1 truncate">{c.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                className="opacity-0 transition-opacity group-hover/item:opacity-100 hover:text-destructive"
                aria-label="Delete chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};