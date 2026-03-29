"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Minus,
  MapPin,
  Calendar,
} from "lucide-react";

// Social media SVG icons (not available in lucide-react v1)
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

/* ── Types ─────────────────────────────────────────────────────── */

type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
};

type AssessmentFormData = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  preferredDate: string;
  notes?: string;
};

/* ── Shared field class ─────────────────────────────────────────── */
const fieldClass =
  "w-full rounded-lg border border-hvn-mist bg-hvn-mist/30 px-4 py-3 text-sm text-hvn-black placeholder:text-hvn-silver focus:outline-none focus:border-hvn-steel transition-colors";

const labelClass = "text-xs text-hvn-steel mb-1.5 block uppercase tracking-wider";

/* ── Contact Form ───────────────────────────────────────────────── */

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-80 rounded-2xl border border-hvn-forest/30 bg-hvn-forest/5 text-center px-8 space-y-4">
        <div className="h-12 w-12 rounded-full bg-hvn-forest/20 border border-hvn-forest/40 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-hvn-forest-light" />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-hvn-black mb-2">
            Message received
          </h3>
          <p className="text-sm text-hvn-silver">
            We&apos;ll get back to you within 24 hours.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-hvn-steel hover:text-hvn-steel transition-colors underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label className={labelClass}>
          Name <span className="text-hvn-forest-light">*</span>
        </label>
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Your full name"
          className={fieldClass}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-hvn-error flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>
          Email <span className="text-hvn-forest-light">*</span>
        </label>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
          })}
          type="email"
          placeholder="your@email.com"
          className={fieldClass}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-hvn-error flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone / Company */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Phone (optional)</label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="+20 xxx xxx xxxx"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Company (optional)</label>
          <input
            {...register("company")}
            placeholder="Company name"
            className={fieldClass}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className={labelClass}>
          Subject <span className="text-hvn-forest-light">*</span>
        </label>
        <select
          {...register("subject", { required: "Please select a subject" })}
          className={fieldClass}
          defaultValue=""
        >
          <option value="" disabled>
            Select a subject
          </option>
          <option value="general">General Inquiry</option>
          <option value="quote">Product Quote</option>
          <option value="partnership">Partnership</option>
          <option value="press">Press</option>
          <option value="assessment">Site Assessment</option>
        </select>
        {errors.subject && (
          <p className="mt-1.5 text-xs text-hvn-error flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className={labelClass}>
          Message <span className="text-hvn-forest-light">*</span>
        </label>
        <textarea
          {...register("message", {
            required: "Message is required",
            minLength: { value: 10, message: "Message is too short" },
          })}
          rows={5}
          placeholder="Tell us what you're looking for…"
          className={`${fieldClass} resize-none`}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-hvn-error flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Error state */}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-hvn-error/30 bg-hvn-error/5 px-4 py-3 text-sm text-hvn-error">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          Something went wrong. Please try again or email us directly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="group w-full flex items-center justify-center gap-2 rounded-lg bg-hvn-neon px-6 py-3.5 text-sm font-semibold text-hvn-white transition-all hover:bg-hvn-neon-bright disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-hvn-cream/30 border-t-hvn-cream animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

/* ── Site Assessment Form ────────────────────────────────────────── */

function AssessmentForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssessmentFormData>();

  const onSubmit = async (data: AssessmentFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/site-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-56 rounded-2xl border border-hvn-forest/30 bg-hvn-forest/5 text-center px-8 space-y-4">
        <div className="h-12 w-12 rounded-full bg-hvn-forest/20 border border-hvn-forest/40 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-hvn-forest-light" />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-hvn-black mb-2">
            Assessment booked
          </h3>
          <p className="text-sm text-hvn-silver">
            Our team will confirm your visit within 24 hours.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-hvn-steel hover:text-hvn-steel transition-colors underline underline-offset-4"
        >
          Book another visit
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name / Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Name <span className="text-hvn-forest-light">*</span>
          </label>
          <input
            {...register("name", { required: "Required" })}
            placeholder="Your name"
            className={fieldClass}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-hvn-error">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Email <span className="text-hvn-forest-light">*</span>
          </label>
          <input
            {...register("email", {
              required: "Required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            type="email"
            placeholder="your@email.com"
            className={fieldClass}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-hvn-error">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Phone / Company */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Phone <span className="text-hvn-forest-light">*</span>
          </label>
          <input
            {...register("phone", { required: "Required" })}
            type="tel"
            placeholder="+20 xxx xxx xxxx"
            className={fieldClass}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-hvn-error">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Company (optional)</label>
          <input
            {...register("company")}
            placeholder="Company name"
            className={fieldClass}
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className={labelClass}>
          Site Address <span className="text-hvn-forest-light">*</span>
        </label>
        <input
          {...register("address", { required: "Address is required" })}
          placeholder="Full address of the site to be assessed"
          className={fieldClass}
        />
        {errors.address && (
          <p className="mt-1 text-xs text-hvn-error">{errors.address.message}</p>
        )}
      </div>

      {/* Preferred Date */}
      <div>
        <label className={labelClass}>
          Preferred Date <span className="text-hvn-forest-light">*</span>
        </label>
        <input
          {...register("preferredDate", { required: "Please select a date" })}
          type="date"
          className={`${fieldClass} [color-scheme:light]`}
        />
        {errors.preferredDate && (
          <p className="mt-1 text-xs text-hvn-error">
            {errors.preferredDate.message}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes (optional)</label>
        <textarea
          {...register("notes")}
          rows={4}
          placeholder="Number of pods needed, specific areas, access requirements…"
          className={`${fieldClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-hvn-error/30 bg-hvn-error/5 px-4 py-3 text-sm text-hvn-error">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          Something went wrong. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="group w-full flex items-center justify-center gap-2 rounded-lg bg-hvn-neon px-6 py-3.5 text-sm font-semibold text-hvn-white transition-all hover:bg-hvn-neon-bright disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-hvn-cream/30 border-t-hvn-cream animate-spin" />
            Booking…
          </>
        ) : (
          <>
            Book Assessment
            <Calendar className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-hvn-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 border-b border-hvn-mist/40">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-hvn-silver) 1px, transparent 1px), linear-gradient(90deg, var(--color-hvn-silver) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Minus className="h-4 w-4 text-hvn-forest-light" />
            <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
              Contact
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-hvn-black tracking-tight leading-tight mb-4">
            Let&apos;s talk.
          </h1>
          <p className="text-hvn-silver text-lg max-w-xl leading-relaxed">
            Whether you&apos;re ready to order, exploring options, or just curious —
            we&apos;re here.
          </p>
        </div>
      </section>

      {/* ── Main Two-Column ──────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_360px] gap-16 lg:gap-24">
            {/* Left — Form */}
            <div>
              <div className="mb-10">
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-hvn-black tracking-tight mb-2">
                  Send a message
                </h2>
                <p className="text-sm text-hvn-silver">
                  We read every message and respond personally.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* Right — Info */}
            <div className="space-y-10">
              {/* Contact details */}
              <div className="rounded-2xl border border-hvn-mist/50 bg-hvn-cream p-7 space-y-6">
                <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold text-hvn-black">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-hvn-mist bg-hvn-mist/50">
                      <Mail className="h-4 w-4 text-hvn-silver" />
                    </div>
                    <div>
                      <p className="text-xs text-hvn-steel mb-0.5">Email</p>
                      <a
                        href="mailto:info@hvnpod.com"
                        className="text-sm text-hvn-black hover:text-hvn-black transition-colors"
                      >
                        info@hvnpod.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-hvn-mist bg-hvn-mist/50">
                      <Clock className="h-4 w-4 text-hvn-silver" />
                    </div>
                    <div>
                      <p className="text-xs text-hvn-steel mb-0.5">Response time</p>
                      <p className="text-sm text-hvn-black">Within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-hvn-mist bg-hvn-mist/50">
                      <MapPin className="h-4 w-4 text-hvn-silver" />
                    </div>
                    <div>
                      <p className="text-xs text-hvn-steel mb-0.5">Based in</p>
                      <p className="text-sm text-hvn-black">Cairo, Egypt</p>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="pt-2 border-t border-hvn-mist/50">
                  <p className="text-xs text-hvn-steel mb-4">Follow along</p>
                  <div className="flex items-center gap-3">
                    {[
                      { Icon: InstagramIcon, href: "https://instagram.com/hvnpod", label: "Instagram" },
                      { Icon: LinkedinIcon, href: "https://linkedin.com/company/hvnpod", label: "LinkedIn" },
                      { Icon: TwitterXIcon, href: "https://x.com/hvnpod", label: "X (Twitter)" },
                      {
                        Icon: ({ className }: { className?: string }) => (
                          <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.83a8.27 8.27 0 0 0 4.83 1.54V6.93a4.85 4.85 0 0 1-1.06-.24z" />
                          </svg>
                        ),
                        href: "https://tiktok.com/@hvnpod",
                        label: "TikTok",
                      },
                    ].map(({ Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-hvn-mist bg-hvn-mist/30 text-hvn-silver transition-all hover:border-hvn-steel hover:text-hvn-black hover:bg-hvn-mist"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Book Site Assessment CTA */}
              <div className="rounded-2xl border border-hvn-forest/30 bg-hvn-forest/5 p-7 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-hvn-forest/60 to-transparent" />
                <div className="h-10 w-10 rounded-lg border border-hvn-forest/30 bg-hvn-forest/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-hvn-forest-light" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold text-hvn-black mb-2">
                    Book a Site Assessment
                  </h3>
                  <p className="text-sm text-hvn-silver leading-relaxed">
                    Let our team visit your space and recommend the right pod
                    configuration for your acoustic and layout needs.
                  </p>
                </div>
                <a
                  href="#assessment"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-hvn-forest-light hover:text-hvn-black transition-colors"
                >
                  Book a visit
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Site Assessment Form ─────────────────────────────── */}
      <section
        id="assessment"
        className="py-20 lg:py-28 border-t border-hvn-mist/40 scroll-mt-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left — Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Minus className="h-4 w-4 text-hvn-forest-light" />
                <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
                  Site Assessment
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-hvn-black tracking-tight leading-tight">
                We&apos;ll come to you.
              </h2>
              <p className="text-hvn-silver leading-relaxed">
                A site assessment lets our team understand your space firsthand —
                its acoustics, traffic patterns, power access, and aesthetic context.
                We then recommend the right pod models, quantities, and placements
                with precision.
              </p>

              <ul className="space-y-3">
                {[
                  "Free of charge",
                  "Within Cairo and Greater Cairo",
                  "Takes approximately 45 minutes",
                  "Followed by a detailed layout proposal",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-hvn-steel">
                    <CheckCircle2 className="h-4 w-4 text-hvn-forest-light flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link
                  href="/contact"
                  className="text-sm text-hvn-steel hover:text-hvn-steel transition-colors underline underline-offset-4"
                >
                  Or send a general message instead
                </Link>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <AssessmentForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
