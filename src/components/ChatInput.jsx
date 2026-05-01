"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Paperclip,
  Sparkles,
  Globe,
  Image as ImageIcon,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-6">
        <div
          className={cn(
            "rounded-2xl border border-border bg-surface-elevated p-3 shadow-elevated transition-all",
            "focus-within:border-primary/40 focus-within:shadow-glow"
          )}
        >
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={disabled ? "Thinking..." : "Ask me anything..."}
            rows={1}
            disabled={disabled}
            className="w-full resize-none bg-transparent px-1 py-1 text-[15px] outline-none placeholder:text-muted-foreground disabled:opacity-60"
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Pill icon={Sparkles} label="Deeper Research" highlight />
              <IconBtn icon={ImageIcon} title="Attach image" />
              <IconBtn icon={Lightbulb} title="Suggestions" />
            </div>
            <div className="flex items-center gap-1.5">
              <IconBtn icon={Globe} title="Web" />
              <IconBtn icon={Paperclip} title="Attach file" />
              <button
                type="button"
                onClick={submit}
                disabled={disabled || !value.trim()}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all",
                  "bg-gradient-primary text-primary-foreground shadow-glow",
                  "hover:scale-105 active:scale-95",
                  "disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none"
                )}
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Answers are grounded in your uploaded documents.
        </p>
      </div>
    </div>
  );
};

const Pill = ({ icon: Icon, label, highlight }) => (
  <button
    type="button"
    className={cn(
      "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
      highlight
        ? "border-primary/30 bg-primary-soft text-primary hover:bg-primary/15"
        : "border-border text-muted-foreground hover:bg-secondary"
    )}
  >
    <Icon className="h-3.5 w-3.5" />
    {label}
  </button>
);

const IconBtn = ({ icon: Icon, title }) => (
  <button
    type="button"
    title={title}
    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
  >
    <Icon className="h-4 w-4" />
  </button>
);