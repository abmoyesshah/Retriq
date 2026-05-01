"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {AppLayout} from "@/components/AppLayout";
import {FileUploadCard} from "@/components/FileUploadCard";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto bg-gradient-subtle">
        <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <SettingsIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Settings</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage the documents that power your AI assistant.
              </p>
            </div>
          </div>
          <FileUploadCard />
        </main>
      </div>
    </AppLayout>
  );
}