"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { ChatContainer }from "@/components/ChatContainer";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return null; // ya loading spinner
  }

  return (
    <AppLayout>
      <h1 className="sr-only">Cortex — AI knowledge assistant</h1>
      <ChatContainer />
    </AppLayout>
  );
}