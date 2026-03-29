"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X, Globe } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useParams } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  NavLink with animated underline                                    */
/* ------------------------------------------------------------------ */
function NavLink({
  href,
  active,
  transparent,
  children,
}: {
  href: string;
  active: boolean;
  transparent: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="relative group py-1">
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          active
            ? "text-hvn-forest-light"
            : transparent
            ? "text-hvn-steel group-hover:text-hvn-black"
            : "text-text-secondary group-hover:text-accent"
        )}
      >
        {children}
      </span>

      {/* Hover underline - slides in from left */}
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 h-[2px] bg-hvn-forest-light transition-all duration-300 ease-out",
          active ? "w-full" : "w-0 group-hover:w-full"
        )}
      />

      {/* Active dot indicator */}
      {active && (
        <motion.span
          layoutId="nav-active-dot"
          className="absolute -bottom-2.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-hvn-forest-light"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Shimmer CTA button                                                 */
/* ------------------------------------------------------------------ */
function ShimmerButton({
  href,
  onClick,
  className,
  children,
}: {
  href: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center overflow-hidden rounded-full btn-glow bg-hvn-neon px-5 py-2 text-sm font-medium text-hvn-white transition-all hover:bg-hvn-neon-bright hover:shadow-[0_0_20px_var(--color-hvn-neon-glow)]",
        className
      )}
    >
      {/* Shimmer overlay */}
      <span className="pointer-events-none absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.18)_50%,transparent_75%)] bg-[length:250%_100%]" />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */
export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const isHome = pathname === "/";

  /* -- framer-motion scroll-linked values -- */
  const { scrollY } = useScroll();

  // Smooth backdrop interpolation: transparent -> frosted glass over 0-80px scroll
  const headerBg = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.85)"]);
  const headerBlur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(20px)"]);
  const headerBorder = useTransform(
    scrollY,
    [0, 80],
    ["1px solid rgba(0,0,0,0)", "1px solid rgba(0,0,0,0.06)"]
  );

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 30);

    // Hide on scroll down, show on scroll up
    const diff = latest - lastScrollY.current;
    if (latest < 80) {
      setVisible(true);
    } else if (diff > 4) {
      setVisible(false);
      setIsOpen(false);
    } else if (diff < -4) {
      setVisible(true);
    }
    lastScrollY.current = latest;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Whether to use transparent (hero) styling
  const transparent = isHome && !scrolled;

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Backdrop layer */}
      {isHome ? (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: headerBg,
            backdropFilter: headerBlur,
            WebkitBackdropFilter: headerBlur,
            borderBottom: headerBorder,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border pointer-events-none" />
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo with spring-in symbol + sliding wordmark */}
          <div>
            <Link href="/" className="flex items-center gap-[12.4px] group">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{
                  scale: [1, 1.05, 1],
                  transition: { duration: 2, repeat: 2, ease: "easeInOut" },
                }}
              >
                <Image
                  src="/images/logo/hvnpod-symbol-dark-transparent.png"
                  alt=""
                  width={33}
                  height={33}
                  className="h-[32.4px] w-[32.4px] "
                  priority
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                <Image
                  src="/images/logo/hvnpod-wordmark-dark.png"
                  alt="HVNPOD"
                  width={100}
                  height={20}
                  className="hidden sm:block h-5 w-auto "
                  priority
                />
              </motion.div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              >
                <NavLink
                  href={link.href}
                  active={pathname === link.href || pathname.startsWith(link.href + "/")}
                  transparent={transparent}
                >
                  {t(link.labelKey)}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <Link
              href={pathname}
              locale={locale === "en" ? "ar" : "en"}
              className={cn(
                "flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200",
                transparent
                  ? "text-hvn-steel hover:text-hvn-black"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              {locale === "en" ? "AR" : "EN"}
            </Link>

            {/* CTA Button with shimmer */}
            <ShimmerButton href="/contact" className="hidden sm:inline-flex">
              {t("nav.requestQuote")}
            </ShimmerButton>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "lg:hidden rounded-md p-2 transition-colors duration-200",
                transparent ? "text-hvn-black" : "text-text-primary"
              )}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with slide-down + staggered reveals */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="lg:hidden overflow-hidden bg-background/98 backdrop-blur-xl border-t border-border"
            style={{ display: "grid" }}
          >
          <motion.div
            initial={{ gridTemplateRows: "0fr" }}
            animate={{ gridTemplateRows: "1fr" }}
            exit={{ gridTemplateRows: "0fr" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            style={{ display: "grid" }}
          >
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 py-6 space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "relative block py-2.5 text-base font-medium transition-colors duration-200",
                      pathname === link.href || pathname.startsWith(link.href + "/")
                        ? "text-hvn-forest-light"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {(pathname === link.href || pathname.startsWith(link.href + "/")) && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 h-4 w-[2px] rounded-full bg-hvn-forest-light" />
                    )}
                    {t(link.labelKey)}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{
                  duration: 0.25,
                  delay: NAV_LINKS.length * 0.06,
                }}
              >
                <ShimmerButton
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block w-full text-center py-3"
                >
                  {t("nav.requestQuote")}
                </ShimmerButton>
              </motion.div>
            </div>
          </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
