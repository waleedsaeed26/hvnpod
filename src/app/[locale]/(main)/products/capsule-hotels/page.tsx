import { Link } from "@/i18n/routing";
import { ArrowLeft, Clock } from "lucide-react";
import { WaitlistForm } from "@/components/products/waitlist-form";

export const metadata = {
  title: "Capsule Hotel Rooms — HVNPOD",
  description:
    "HVNSTAY: Premium capsule hotel rooms for hospitality operators. Privacy-grade soundproofing, smart lighting, commercial durability. Coming 2026.",
};

const FEATURES = [
  "Individual climate control",
  "Privacy-grade soundproofing",
  "Integrated entertainment system",
  "Smart lighting & alarm",
  "Commercial-grade durability",
];

export default function CapsuleHotelsPage() {
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
            <span className="text-hvn-silver">Capsule Hotel Rooms</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-hvn-mist px-4 py-1.5 text-xs text-hvn-silver mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-hvn-neon animate-pulse" />
              Coming 2026
            </div>

            <p className="text-xs font-medium text-hvn-forest-light uppercase tracking-widest mb-4">
              HVNSTAY
            </p>

            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-hvn-black leading-[0.95] mb-6">
              Capsule
              <br />
              <span className="text-hvn-silver">Hotel Rooms</span>
            </h1>

            <p className="text-lg text-hvn-steel leading-relaxed max-w-2xl">
              Premium capsule hotel rooms for hospitality operators who want to
              maximize capacity without compromising guest experience.
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
                    The hospitality industry is evolving. Travelers want privacy and
                    comfort without paying for space they do not use. Operators want to
                    maximize revenue per square meter without cutting corners on
                    experience. HVNSTAY sits at that intersection.
                  </p>
                  <p>
                    We are designing modular capsule hotel rooms that deliver a private,
                    premium sleeping experience in a fraction of the footprint of a
                    traditional hotel room. Each unit features individual climate control,
                    privacy-grade acoustic insulation, an integrated entertainment system,
                    and smart lighting with a built-in alarm — all finished to
                    commercial-grade durability standards.
                  </p>
                  <p>
                    For operators, HVNSTAY means higher density, lower build-out cost,
                    and a guest experience that earns repeat bookings. For guests, it
                    means a cocoon of comfort that feels personal, quiet, and
                    surprisingly spacious.
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
                        HVNSTAY
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
                    Be the first to know when HVNSTAY launches. Hospitality operators
                    get early access to pilot programs and volume pricing.
                  </p>
                </div>
                <WaitlistForm categoryTag="capsule-hotels" />
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
