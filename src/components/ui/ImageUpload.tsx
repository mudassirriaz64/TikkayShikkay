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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-deep)]/80 p-3.5 backdrop-blur-sm">
          {/* Square/Landscape Thumbnail Card */}
          <div className="relative group/thumb shrink-0 w-36 h-28 sm:w-44 sm:h-32 overflow-hidden rounded-xl border border-[var(--border-warm)] bg-black/40 shadow-inner">
            <img
              src={value}
              alt={label || "Dish preview"}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover/thumb:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-1.5 left-2 text-[9px] font-bold uppercase tracking-wider text-white/90 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-xs">
              Live Preview
            </span>
          </div>

          {/* Details & Actions */}
          <div className="flex flex-1 flex-col justify-between self-stretch py-0.5 min-w-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Image Ready
                </p>
              </div>
              <p className="mt-1.5 text-xs text-[var(--text-faint)] truncate max-w-md font-mono">
                {value}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface)] text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] hover:bg-[var(--bg-surface-alt)] transition-all duration-200"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange("", undefined)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
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
