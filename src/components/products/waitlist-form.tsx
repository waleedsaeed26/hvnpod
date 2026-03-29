"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

interface WaitlistFormProps {
  categoryTag: string;
}

export function WaitlistForm({ categoryTag }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, categoryTag }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-3 rounded-xl border border-hvn-forest/40 bg-hvn-forest/10 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-hvn-forest/20">
          <Check className="h-4 w-4 text-hvn-forest-light" />
        </div>
        <p className="text-sm font-medium text-hvn-black">
          You&apos;re on the list! We&apos;ll notify you when this launches.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-lg border border-hvn-mist bg-hvn-mist/50 px-4 py-3 text-sm text-hvn-black placeholder:text-hvn-silver focus:border-hvn-forest focus:outline-none focus:ring-1 focus:ring-hvn-forest transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group flex items-center justify-center gap-2 rounded-lg bg-hvn-neon px-6 py-3 text-sm font-semibold text-hvn-white transition-all hover:bg-hvn-neon-bright disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              Join Waitlist
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-hvn-error">{errorMessage}</p>
      )}
    </form>
  );
}
