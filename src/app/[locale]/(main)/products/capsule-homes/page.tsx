import { Link } from "@/i18n/routing";
import { ArrowLeft, Clock } from "lucide-react";
import { WaitlistForm } from "@/components/products/waitlist-form";

export const metadata = {
  title: "Capsule Homes — HVNPOD",
  description:
    "HVNCAPSULE: Compact, self-contained living units for modern minimalists. Off-grid capable with integrated smart home. Coming 2026.",
};

const FEATURES = [
  "Climate-controlled interior",
  "Integrated smart home system",
  "Off-grid solar option",
  "Modular expansion capability",
  "Acoustic isolation",
];

export default function CapsuleHomesPage() {
  return (
    <div className="min-h-screen bg-hvn-white">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-hvn-cream/30 to-hvn-white" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-hvn-silver) 1px, transparent 1px), linear-gradient(90deg, var(--color-hvn-silver) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-hvn-steel mb-10">
            <Link href="/products" className="hover:text-hvn-steel transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-hvn-silver">Capsule Homes</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-hvn-mist px-4 py-1.5 text-xs text-hvn-silver mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-hvn-neon animate-pulse" />
              Coming 2026
            </div>

            <p className="text-xs font-medium text-hvn-forest-light uppercase tracking-widest mb-4">
              HVNCAPSULE
            </p>

            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-hvn-black leading-[0.95] mb-6">
              Capsule
              <br />
              <span className="text-hvn-silver">Homes</span>
            </h1>

            <p className="text-lg text-hvn-steel leading-relaxed max-w-2xl">
              Compact, self-contained living units for modern minimalists who
              believe less space means more freedom.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Vision */}
            <div className="space-y-8">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-hvn-black tracking-tight mb-6">
                  The Vision
                </h2>
                <div className="space-y-4 text-hvn-steel leading-relaxed">
                  <p>
                    The way we think about housing is broken. Oversized, overpriced,
                    over-complicated. HVNCAPSULE starts from a different premise: what
                    is the minimum viable space in which a person can live exceptionally
                    well?
                  </p>
                  <p>
                    We are developing factory-built, fully self-contained living units
                    that arrive ready to inhabit. Climate control, plumbing, electrical,
                    and a full smart home system — all engineered into a footprint smaller
                    than a studio apartment. An optional off-grid solar package means you
                    can place one almost anywhere.
                  </p>
                  <p>
                    Modular by design, capsules can be linked together as your needs grow.
                    Start with one. Add a studio module. Connect a guest unit. The
                    architecture scales with your life without ever requiring a
                    construction crew.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-hvn-black mb-4">
                  Concept Features
                </h3>
                <ul className="space-y-3">
                  {FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-hvn-steel">
                      <span className="h-1.5 w-1.5 rounded-full bg-hvn-forest-light flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Teaser visual + form */}
            <div className="space-y-8">
              <div className="aspect-[4/3] rounded-2xl border border-hvn-mist/50 bg-gradient-to-br from-hvn-pearl to-hvn-cream flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-hvn-forest/5 to-transparent" />
                <div className="relative z-10 text-center space-y-4">
                  <div className="mx-auto h-32 w-48 rounded-xl border-2 border-dashed border-hvn-mist flex items-center justify-center bg-hvn-mist/30">
                    <div className="text-center space-y-2">
                      <Clock className="h-8 w-8 text-hvn-steel mx-auto" />
                      <span className="font-[family-name:var(--font-heading)] text-xs text-hvn-steel block">
                        HVNCAPSULE
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-hvn-steel">Renders coming soon</p>
                </div>
              </div>

              <div className="rounded-2xl border border-hvn-mist/50 bg-hvn-cream p-8 space-y-6">
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-hvn-black mb-2">
                    Join the Waitlist
                  </h3>
                  <p className="text-sm text-hvn-steel">
                    Be the first to know when HVNCAPSULE launches. Early subscribers
                    get priority access and exclusive pricing.
                  </p>
                </div>
                <WaitlistForm categoryTag="capsule-homes" />
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-hvn-mist/40">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-hvn-silver hover:text-hvn-black transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
