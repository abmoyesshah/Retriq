"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle2, Loader2, Trash2, X } from "lucide-react";
import { uploadDocument } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ai-assistant:uploaded-files";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};
const save = (files) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

export const FileUploadCard = () => {
  const [files, setFiles] = useState(load);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    setUploading(true);
    setProgress(10);
    const tick = setInterval(() => {
      setProgress((p) => (p < 85 ? p + Math.random() * 10 : p));
    }, 250);

    try {
      await uploadDocument(file);
      clearInterval(tick);
      setProgress(100);
      const next = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
      const updated = [next, ...files];
      setFiles(updated);
      save(updated);
      toast.success(`${file.name} uploaded successfully`);
    } catch {
      clearInterval(tick);
      toast.error("Upload failed. Please try again.");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 400);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeOne = (id) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    save(updated);
    toast.success("File removed from list");
  };

  const resetAll = () => {
    setFiles([]);
    save([]);
    toast.success("Document list cleared");
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative rounded-2xl border-2 border-dashed bg-surface-elevated p-8 text-center transition-all",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
          uploading && "pointer-events-none opacity-90"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md,.docx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary-foreground" />
          ) : (
            <Upload className="h-6 w-6 text-primary-foreground" />
          )}
        </div>

        <h3 className="text-lg font-semibold">
          {uploading ? "Uploading document..." : "Upload a document"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag & drop or click to browse · PDF, TXT, MD, DOCX
        </p>

        {uploading ? (
          <div className="mx-auto mt-5 h-2 max-w-sm overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full bg-gradient-primary"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-soft transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Upload className="h-4 w-4" />
            Choose file
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface-elevated shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold">Uploaded documents</h3>
            <p className="text-xs text-muted-foreground">
              {files.length} {files.length === 1 ? "file" : "files"} in your
              knowledge base
            </p>
          </div>
          {files.length > 0 && (
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Reset all
            </button>
          )}
        </div>

        {files.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <p className="mt-3 text-sm text-muted-foreground">
              No documents yet. Upload one to begin.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {files.map((f) => (
              <motion.li
                key={f.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-5 py-3.5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(f.size)} ·{" "}
                    {new Date(f.uploadedAt).toLocaleString()}
                  </p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <button
                  onClick={() => removeOne(f.id)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};