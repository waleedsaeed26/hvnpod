"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuoteConfig {
  model: string;
  tier: string;
  color: string;
  quantity: number;
  price: number;
  message?: string;
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: QuoteConfig;
}

interface QuoteFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium uppercase tracking-wider text-hvn-steel">
        {label}
        {optional && (
          <span className="ml-1.5 normal-case font-normal text-hvn-silver">
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-hvn-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-hvn-mist bg-hvn-pearl/40 px-4 py-3 text-sm text-hvn-steel placeholder:text-hvn-silver focus:outline-none focus:border-hvn-steel transition-colors";

const inputErrorClass =
  "w-full rounded-xl border border-hvn-error/50 bg-hvn-pearl/40 px-4 py-3 text-sm text-hvn-steel placeholder:text-hvn-silver focus:outline-none focus:border-hvn-error transition-colors";

// ─── Component ────────────────────────────────────────────────────────────────

export function QuoteModal({ isOpen, onClose, config }: QuoteModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    clearErrors,
  } = useForm<QuoteFormData>({
    defaultValues: {
      message: config.message ?? "",
    },
  });

  // Sync message from config
  useEffect(() => {
    if (isOpen) {
      clearErrors();
    }
  }, [isOpen, clearErrors]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const onSubmit = async (data: QuoteFormData) => {
    try {
      const payload = {
        ...data,
        config: {
          model: config.model,
          tier: config.tier,
          color: config.color,
          quantity: config.quantity,
          totalPrice: config.price,
        },
      };

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Request failed");
      }

      reset();
    } catch (err) {
      setError("root", {
        type: "manual",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      });
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-hvn-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
              className="relative w-full sm:max-w-lg max-h-[95dvh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-hvn-mist/70 bg-hvn-cream shadow-elevated"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-hvn-mist text-hvn-steel transition-all hover:border-hvn-steel hover:text-hvn-steel disabled:opacity-40 cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Success state */}
              <AnimatePresence mode="wait">
                {isSubmitSuccessful ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center px-8 py-16 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="h-16 w-16 text-hvn-forest-light mb-6" />
                    </motion.div>
                    <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-hvn-black mb-3">
                      Quote Requested
                    </h3>
                    <p className="text-hvn-steel text-sm leading-relaxed max-w-xs">
                      Thank you! Our team will review your configuration and get back to you within 24 hours.
                    </p>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 rounded-xl border border-hvn-mist bg-hvn-pearl/40 px-5 py-4 text-left w-full"
                    >
                      <p className="text-xs text-hvn-steel uppercase tracking-wider mb-3 font-medium">
                        Your configuration
                      </p>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-hvn-steel">Model</span>
                          <span className="text-hvn-steel">{config.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-hvn-steel">Tier</span>
                          <span className="text-hvn-steel">{config.tier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-hvn-steel">Color</span>
                          <span className="text-hvn-steel">{config.color}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-hvn-steel">Quantity</span>
                          <span className="text-hvn-steel">{config.quantity}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-hvn-mist/60">
                          <span className="text-hvn-silver font-medium">Total</span>
                          <span className="text-hvn-black font-semibold">
                            {formatPrice(config.price)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    <button
                      onClick={handleClose}
                      className="mt-6 rounded-xl bg-hvn-mist px-8 py-3 text-sm font-medium text-hvn-steel transition-all hover:bg-hvn-steel hover:text-hvn-steel cursor-pointer"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="px-6 pt-7 pb-5 border-b border-hvn-mist/50">
                      <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-hvn-black">
                        Request a Quote
                      </h2>
                      <p className="text-sm text-hvn-steel mt-1.5 leading-relaxed">
                        Fill in your details and we&apos;ll send a formal quote within 24 hours.
                      </p>

                      {/* Config summary */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {[
                          config.model,
                          config.tier,
                          config.color,
                          `×${config.quantity}`,
                        ]
                          .filter(Boolean)
                          .map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-hvn-mist bg-hvn-black/20 px-3 py-1 text-xs text-hvn-silver"
                            >
                              {item}
                            </span>
                          ))}
                        <span className="rounded-full border border-hvn-forest/40 bg-hvn-forest/10 px-3 py-1 text-xs text-hvn-forest-light font-medium">
                          {formatPrice(config.price)}
                        </span>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-4">
                      {/* Root error */}
                      <AnimatePresence>
                        {errors.root && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-start gap-3 rounded-xl border border-hvn-error/30 bg-hvn-error/10 px-4 py-3"
                          >
                            <AlertCircle className="h-4 w-4 text-hvn-error shrink-0 mt-0.5" />
                            <p className="text-sm text-hvn-error">
                              {errors.root.message}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Name */}
                      <Field label="Full Name" error={errors.name?.message}>
                        <input
                          type="text"
                          placeholder="Ahmed Hassan"
                          className={errors.name ? inputErrorClass : inputClass}
                          {...register("name", {
                            required: "Name is required",
                            minLength: { value: 2, message: "Name is too short" },
                          })}
                        />
                      </Field>

                      {/* Email */}
                      <Field label="Email Address" error={errors.email?.message}>
                        <input
                          type="email"
                          placeholder="ahmed@company.com"
                          className={errors.email ? inputErrorClass : inputClass}
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Please enter a valid email",
                            },
                          })}
                        />
                      </Field>

                      {/* Phone + Company row */}
                      <div className="grid grid-cols-2 gap-3">
                        <Field
                          label="Phone"
                          optional
                          error={errors.phone?.message}
                        >
                          <input
                            type="tel"
                            placeholder="+20 1xx xxx xxxx"
                            className={errors.phone ? inputErrorClass : inputClass}
                            {...register("phone", {
                              pattern: {
                                value: /^[\d\s+\-().]{7,20}$/,
                                message: "Invalid phone number",
                              },
                            })}
                          />
                        </Field>

                        <Field
                          label="Company"
                          optional
                          error={errors.company?.message}
                        >
                          <input
                            type="text"
                            placeholder="Your company"
                            className={errors.company ? inputErrorClass : inputClass}
                            {...register("company")}
                          />
                        </Field>
                      </div>

                      {/* Message */}
                      <Field label="Additional Notes" optional>
                        <textarea
                          rows={3}
                          placeholder="Installation requirements, timeline, or any questions..."
                          className={`${inputClass} resize-none`}
                          defaultValue={config.message ?? ""}
                          {...register("message")}
                        />
                      </Field>

                      {/* Submit */}
                      <div className="pt-2">
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                          whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                          className="group w-full flex items-center justify-center gap-2 rounded-xl bg-hvn-cream py-3.5 text-sm font-semibold text-hvn-black transition-all hover:bg-hvn-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Quote Request
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </>
                          )}
                        </motion.button>

                        <p className="mt-3 text-center text-xs text-hvn-steel">
                          No payment required. We&apos;ll contact you within 24 hours.
                        </p>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
