"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CONTACT_EMAIL } from "@/lib/constants";
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ArrowUp, Check, Mail } from "lucide-react";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: EASE },
  }),
};

const lineDrawVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: EASE },
  },
};

/* ------------------------------------------------------------------ */
/*  Animated footer link                                               */
/* ------------------------------------------------------------------ */

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const inner = (
    <motion.span
      className="group relative inline-flex items-center gap-1 text-sm text-hvn-steel transition-colors hover:text-hvn-black"
      whileHover="hover"
    >
      {/* Sliding underline */}
      <span className="relative">
        {children}
        <motion.span
          className="absolute -bottom-0.5 left-0 h-px bg-hvn-forest-light"
          initial={{ width: 0 }}
          variants={{ hover: { width: "100%" } }}
          transition={{ duration: 0.3 }}
        />
      </span>
      {/* Arrow */}
      <motion.span
        className="inline-block overflow-hidden"
        initial={{ width: 0, opacity: 0 }}
        variants={{ hover: { width: "auto", opacity: 1 } }}
        transition={{ duration: 0.25 }}
      >
        <ArrowRight className="h-3 w-3" />
      </motion.span>
    </motion.span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}

/* ------------------------------------------------------------------ */
/*  Social icon button                                                 */
/* ------------------------------------------------------------------ */

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-hvn-mist text-hvn-steel transition-colors hover:border-hvn-forest-light hover:text-hvn-black"
      whileHover={{
        scale: 1.12,
        boxShadow: "0 0 16px var(--color-hvn-neon-glow)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/*  Newsletter form                                                    */
/* ------------------------------------------------------------------ */

function NewsletterForm({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [focused, setFocused] = useState(false);

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
    <form onSubmit={handleSubmit} className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 rounded-xl border border-hvn-forest/40 bg-hvn-forest/10 px-4 py-3"
            aria-live="polite"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
            >
              <Check className="h-5 w-5 text-hvn-forest-light" />
            </motion.span>
            <span className="text-sm text-hvn-black">You&apos;re on the list!</span>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="relative">
              <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl"
                animate={{
                  boxShadow: focused
                    ? "0 0 20px rgba(44,110,73,0.3), inset 0 0 0 1px rgba(44,110,73,0.6)"
                    : "0 0 0px rgba(44,110,73,0), inset 0 0 0 1px rgba(44,110,73,0)",
                }}
                transition={{ duration: 0.3 }}
              />
              <div className="flex items-center gap-2 rounded-xl border border-hvn-mist bg-hvn-white px-3 py-2.5 transition-colors focus-within:border-hvn-forest">
                <Mail className="h-4 w-4 text-hvn-steel shrink-0" />
                <label htmlFor="newsletter-email-footer" className="sr-only">
                  Email for newsletter
                </label>
                <input
                  id="newsletter-email-footer"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={t("newsletter.placeholder")}
                  className="flex-1 bg-transparent text-sm text-hvn-black placeholder:text-hvn-steel focus:outline-none"
                  required
                  disabled={status === "loading"}
                />
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={status === "loading"}
              className="rounded-xl bg-hvn-neon px-5 py-2.5 text-sm font-medium text-hvn-white transition-colors hover:bg-hvn-neon-bright disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === "loading" && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {t("newsletter.subscribe")}
            </motion.button>
            <div aria-live="polite" className="min-h-[1.25rem]">
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-hvn-error"
                >
                  {errorMessage}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Back to top button                                                 */
/* ------------------------------------------------------------------ */

function BackToTop() {
  const [visible, setVisible] = useState(false);

  const checkScroll = useCallback(() => {
    setVisible(window.scrollY > 400);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1, rotate: -360 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-hvn-mist bg-hvn-cream text-hvn-steel shadow-lg transition-colors hover:border-hvn-forest-light hover:text-hvn-black"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

export function Footer() {
  const t = useTranslations();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.1 });

  return (
    <>
      <footer
        ref={footerRef}
        className="relative bg-hvn-pearl text-hvn-steel overflow-hidden"
      >
        {/* ---- Brand tagline ---- */}
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-12 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            style={{
              background: "linear-gradient(135deg, var(--color-hvn-black) 30%, var(--color-hvn-steel) 70%, var(--color-hvn-forest-light) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Silence, on demand.
          </motion.p>
        </div>

        {/* ---- Animated divider ---- */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-hvn-mist to-transparent origin-left"
            variants={lineDrawVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          />
        </div>

        {/* ---- Main grid ---- */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 md:grid-cols-5">
            {/* Products */}
            <motion.div
              custom={0}
              variants={sectionVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-hvn-black font-[family-name:var(--font-heading)]">
                {t("footer.products")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <FooterLink href="/products/acoustic-pods">HVNPOD One</FooterLink>
                </li>
                <li>
                  <FooterLink href="/products/acoustic-pods">HVNPOD Duo</FooterLink>
                </li>
                <li>
                  <FooterLink href="/products/acoustic-pods">HVNPOD Meet</FooterLink>
                </li>
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              custom={1}
              variants={sectionVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-hvn-black font-[family-name:var(--font-heading)]">
                {t("footer.company")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <FooterLink href="/about">{t("nav.about")}</FooterLink>
                </li>
                <li>
                  <FooterLink href="/journal">{t("nav.journal")}</FooterLink>
                </li>
                <li>
                  <FooterLink href="/faq">FAQ</FooterLink>
                </li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-hvn-black font-[family-name:var(--font-heading)]">
                {t("footer.support")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <FooterLink href="/contact">{t("nav.contact")}</FooterLink>
                </li>
                <li>
                  <FooterLink href="/contact">{t("footer.siteAssessment")}</FooterLink>
                </li>
                <li>
                  <FooterLink href={`mailto:${CONTACT_EMAIL}`} external>
                    {CONTACT_EMAIL}
                  </FooterLink>
                </li>
              </ul>
            </motion.div>

            {/* Connect (social) */}
            <motion.div
              custom={3}
              variants={sectionVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-hvn-black font-[family-name:var(--font-heading)]">
                Connect
              </h3>
              <div className="flex flex-wrap gap-3">
                {/* Instagram */}
                <SocialIcon href="https://instagram.com/hvnpod" label="Instagram">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </SocialIcon>

                {/* LinkedIn */}
                <SocialIcon href="https://linkedin.com/company/hvnpod" label="LinkedIn">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </SocialIcon>

                {/* X / Twitter */}
                <SocialIcon href="https://x.com/hvnpod" label="X (Twitter)">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </SocialIcon>

                {/* Facebook */}
                <SocialIcon href="https://facebook.com/hvnpod" label="Facebook">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </SocialIcon>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              custom={4}
              variants={sectionVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="col-span-2 md:col-span-1"
            >
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-hvn-black font-[family-name:var(--font-heading)]">
                {t("newsletter.title")}
              </h3>
              <p className="mb-4 text-sm text-hvn-steel leading-relaxed">
                {t("newsletter.description")}
              </p>
              <NewsletterForm t={t} />
            </motion.div>
          </div>
        </div>

        {/* ---- Bottom divider ---- */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-hvn-mist to-transparent origin-left"
            variants={lineDrawVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
          />
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold text-hvn-black tracking-[0.15em] group/brand cursor-default"
                whileHover="hover"
              >
                <motion.span
                  className="inline-block"
                  variants={{
                    hover: { rotate: 90 },
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Image
                    src="/images/logo/hvnpod-symbol-dark.png"
                    alt="HVNPOD"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                </motion.span>
                HVNPOD
              </motion.span>
              <span className="h-4 w-px bg-hvn-mist" />
              <span className="text-xs text-hvn-steel">
                {t("footer.tagline")}
              </span>
            </div>
            <p className="text-xs text-hvn-steel">
              &copy; {new Date().getFullYear()} HVNPOD. {t("footer.rights")}
            </p>
          </motion.div>
        </div>
      </footer>

      {/* Back to top (rendered outside footer for fixed positioning) */}
      <BackToTop />
    </>
  );
}
