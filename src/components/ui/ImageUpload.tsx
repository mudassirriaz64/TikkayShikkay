"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { uploadService, UploadResult } from "@/lib/api/upload.service";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  accept = "image/*",
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const result: UploadResult = await uploadService.uploadFile(file);
      onChange(result.url);
    } catch (err: any) {
      setError(err?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[var(--text-faint)]">
        {label}
      </label>

      {value && (
        <div className="mb-2 overflow-hidden rounded-lg border border-[var(--border-subtle)]">
          <img
            src={value}
            alt={label}
            className="h-32 w-full object-cover"
          />
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition
          ${dragOver
            ? "border-[var(--accent-orange)] bg-[var(--accent-orange)]/5"
            : "border-[var(--border-subtle)] hover:border-[var(--accent-orange)]/50"
          }
          ${uploading ? "pointer-events-none opacity-50" : ""}
        `}
      >
        {uploading ? (
          <span className="text-xs text-[var(--text-faint)]">Uploading…</span>
        ) : (
          <span className="text-xs text-[var(--text-faint)]">
            Click or drag a file here
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onSelect}
        className="hidden"
      />

      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-1 text-xs text-[var(--text-faint)] underline hover:text-red-400"
        >
          Remove
        </button>
      )}
    </div>
  );
}
