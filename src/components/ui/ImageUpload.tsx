"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { uploadService, UploadResult } from "@/lib/api/upload.service";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string, publicId?: string) => void;
  folder?: string;
  label?: string;
  accept?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  label,
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
      const result: UploadResult = await uploadService.uploadFile(file, folder);
      onChange(result.url, result.publicId);
    } catch (err: any) {
      setError(err?.message || "Upload failed. Please try again.");
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
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group overflow-hidden rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)]">
          <img
            src={value}
            alt={label || "Uploaded preview"}
            className="h-40 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--accent-orange)] hover:text-white transition shadow-sm"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={() => onChange("", undefined)}
              className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition shadow-sm"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? "border-[var(--accent-orange)] bg-[var(--accent-orange)]/10 scale-[0.99]"
              : "border-[var(--border-warm)] bg-[var(--bg-surface-alt)] hover:border-[var(--accent-orange)]/60 hover:bg-[var(--bg-surface)]"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-[var(--accent-orange)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-orange)]">
                Uploading to Cloudinary…
              </span>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">
                  Click to upload or drag &amp; drop
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">
                  PNG, JPG, WEBP or GIF up to 25MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onSelect}
        className="hidden"
      />

      {error && (
        <p className="text-xs font-semibold text-red-400">{error}</p>
      )}
    </div>
  );
}
