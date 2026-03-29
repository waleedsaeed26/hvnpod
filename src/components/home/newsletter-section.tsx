"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, Check, AlertCircle, Loader2 } from "lucide-react";

export function NewsletterSection() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-surface">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-hvn-forest/10">
            <Mail className="h-6 w-6 text-hvn-forest" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-text-primary">
            {t("title")}
          </h2>
          <p className="text-text-secondary">{t("description")}</p>
          <form
            className="mx-auto flex flex-col sm:flex-row max-w-md gap-3"
            onSubmit={handleSubmit}
          >
            <div className="flex-1">
              <label htmlFor="newsletter-email-hero" className="sr-only">
                {t("placeholder")}
              </label>
              <input
                id="newsletter-email-hero"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                disabled={status === "loading"}
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-hvn-neon px-6 py-3 text-sm font-medium text-hvn-white transition-colors hover:bg-hvn-neon-bright disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("subscribe")}
            </button>
          </form>
          <div aria-live="polite" className="min-h-[1.5rem]">
            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 text-sm text-hvn-forest"
              >
                <Check className="h-4 w-4" />
                You&apos;re on the list!
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 text-sm text-hvn-error"
              >
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
