import { Link } from "@/i18n/routing";
import { ArrowLeft, Clock } from "lucide-react";
import { WaitlistForm } from "@/components/products/waitlist-form";

export const metadata = {
  title: "Ergonomic Chairs — HVNPOD",
  description:
    "HVNCHAIR: Ergonomic seating engineered for 12+ hour sessions. Adaptive lumbar, breathable mesh, 4D armrests. Coming 2025.",
};

const FEATURES = [
  "Adaptive lumbar support",
  "Breathable mesh + memory foam",
  "4D armrests",
  "Lockable recline positions",
  "Weight-responsive tilt",
];

export default function ErgonomicChairsPage() {
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
            <span className="text-hvn-silver">Ergonomic Chairs</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-hvn-mist px-4 py-1.5 text-xs text-hvn-silver mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-hvn-neon animate-pulse" />
              Coming 2025
            </div>

            <p className="text-xs font-medium text-hvn-forest-light uppercase tracking-widest mb-4">
              HVNCHAIR
            </p>

            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-hvn-black leading-[0.95] mb-6">
              Ergonomic
              <br />
              <span className="text-hvn-silver">Chairs</span>
            </h1>

            <p className="text-lg text-hvn-steel leading-relaxed max-w-2xl">
              Seating engineered for 12+ hour sessions. Because your body should
              never be the bottleneck to your best work.
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
                    Most ergonomic chairs are designed for the average office worker doing
                    an average eight-hour day. HVNCHAIR is not that. We are building for
                    the developers, designers, and gamers who push well past the 12-hour
                    mark and need a chair that keeps up.
                  </p>
                  <p>
                    Adaptive lumbar support that responds to your posture in real time.
                    A hybrid seat combining breathable engineered mesh with strategic
                    memory foam zones. 4D armrests that position exactly where your arms
                    naturally fall. Every adjustment point exists because the data says
                    it matters.
                  </p>
                  <p>
                    The result is a chair that disappears beneath you — no pressure
                    points, no heat buildup, no fidgeting. Just uninterrupted focus from
                    the first hour to the fourteenth.
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
                        HVNCHAIR
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
                    Be the first to know when HVNCHAIR launches. Early subscribers
                    get priority access and exclusive pricing.
                  </p>
                </div>
                <WaitlistForm categoryTag="ergonomic-chairs" />
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
