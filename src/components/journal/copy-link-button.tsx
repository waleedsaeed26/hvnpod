"use client";

import { useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail if clipboard API is unavailable
    }
  };

  return (
    <button
      type="button"
      aria-label={copied ? "Link copied" : "Copy link"}
      onClick={handleCopy}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-hvn-graphite text-hvn-silver transition-all hover:border-hvn-silver hover:text-hvn-cream"
    >
      {copied ? (
        <Check className="h-4 w-4 text-hvn-forest-light" />
      ) : (
        <LinkIcon className="h-4 w-4" />
      )}
    </button>
  );
}
