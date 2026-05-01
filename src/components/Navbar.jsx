"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Settings as SettingsIcon, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight">
              AI Assistant
            </span>
            <span className="text-[11px] text-muted-foreground">
              Knowledge-grounded
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <NavTab
            href="/"
            active={pathname === "/"}
            icon={<MessageSquare className="h-4 w-4" />}
            label="Chat"
          />
          <NavTab
            href="/settings"
            active={pathname === "/settings"}
            icon={<SettingsIcon className="h-4 w-4" />}
            label="Settings"
          />
          <div className="mx-1 h-6 w-px bg-border" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

const NavTab = ({ href, active, icon, label }) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-secondary text-foreground"
        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
    )}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </Link>
);