import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { FAQAccordion } from "@/components/faq/faq-accordion";
import { ArrowRight, Minus } from "lucide-react";

export async function generateMetadata() {
  return {
    title: "FAQ — HVNPOD",
    description:
      "Answers to common questions about HVNPOD acoustic pods — products, ordering, delivery, installation, maintenance, and warranty.",
  };
}

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen bg-hvn-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 border-b border-hvn-mist/40 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-hvn-silver) 1px, transparent 1px), linear-gradient(90deg, var(--color-hvn-silver) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Minus className="h-4 w-4 text-hvn-forest-light" />
              <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
                FAQ
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-hvn-black tracking-tight leading-tight mb-6">
              Questions answered.
            </h1>

            <p className="text-hvn-silver text-lg leading-relaxed max-w-2xl">
              Everything you need to know about acoustic pods, ordering, delivery,
              and what happens after installation. Can&apos;t find what you need?
              We&apos;re a message away.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-sm font-medium text-hvn-forest-light hover:text-hvn-black transition-colors"
              >
                Ask a question directly
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Content ──────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 border-t border-hvn-mist/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-hvn-mist/50 bg-hvn-cream p-10 lg:p-14 text-center max-w-2xl mx-auto">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-hvn-black tracking-tight mb-4">
              Still have questions?
            </h2>
            <p className="text-hvn-silver mb-8 leading-relaxed">
              Our team responds within 24 hours. We&apos;re also happy to book a
              site assessment so you can see a pod in person.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-hvn-cream px-7 py-3 text-sm font-semibold text-hvn-black transition-all hover:bg-hvn-white hover:shadow-elevated"
              >
                Get in touch
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact#assessment"
                className="group inline-flex items-center gap-2 rounded-full border border-hvn-mist px-7 py-3 text-sm font-medium text-hvn-black transition-all hover:border-hvn-steel hover:bg-hvn-cream"
              >
                Book a site visit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
