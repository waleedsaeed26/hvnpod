import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronLeft,
  Users,
  Package,
  Tag,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!product) return {};
  return {
    title: `${product.name} — HVNPOD`,
    description: product.description,
  };
}

type ParsedSpecs = Record<string, string | number | boolean>;
type ParsedFeatures = string[];

function parseJSON<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
  });

  if (!product) notFound();

  const specs = parseJSON<ParsedSpecs>(product.specs, {});
  const features = parseJSON<ParsedFeatures>(product.features, []);
  const isComingSoon = product.comingSoon;
  const primaryImage = product.images[0];

  return (
    <div className="min-h-screen bg-hvn-white">
      {/* Top bar */}
      <div className="border-b border-hvn-mist/40 bg-hvn-cream/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-hvn-steel">
            <Link href="/products" className="hover:text-hvn-black transition-colors">
              Products
            </Link>
            <span>/</span>
            {product.category && (
              <>
                <Link
                  href={`/products/${product.category.slug}`}
                  className="hover:text-hvn-black transition-colors"
                >
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-hvn-silver">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Back link */}
        <Link
          href={product.category ? `/products/${product.category.slug}` : "/products"}
          className="inline-flex items-center gap-2 text-sm text-hvn-steel hover:text-hvn-black transition-colors mb-10"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to {product.category?.name ?? "Products"}
        </Link>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl border border-hvn-mist/50 bg-gradient-to-br from-hvn-pearl to-hvn-cream overflow-hidden flex items-center justify-center relative">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={primaryImage.alt ?? product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-3">
                  <Package className="h-16 w-16 text-hvn-mist mx-auto" />
                  <p className="text-sm text-hvn-steel">{product.name}</p>
                </div>
              )}

              {isComingSoon && (
                <div className="absolute inset-0 bg-hvn-white/80 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Clock className="h-10 w-10 text-hvn-silver mx-auto" />
                    <p className="font-[family-name:var(--font-heading)] text-lg font-semibold text-hvn-black">
                      Coming Soon
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="flex-shrink-0 h-20 w-20 rounded-lg border border-hvn-mist/50 bg-hvn-cream overflow-hidden"
                  >
                    <img
                      src={img.url}
                      alt={img.alt ?? product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: details */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                {product.model && (
                  <span className="text-xs font-medium text-hvn-forest-light uppercase tracking-widest">
                    {product.model}
                  </span>
                )}
                {product.tier && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-hvn-mist px-3 py-1 text-xs text-hvn-silver">
                    <Tag className="h-3 w-3" />
                    {product.tier}
                  </span>
                )}
                {isComingSoon && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-hvn-pearl/50 border border-hvn-mist/50 px-3 py-1 text-xs font-medium text-hvn-steel">
                    <Clock className="h-3 w-3" />
                    Coming Soon
                  </span>
                )}
              </div>

              <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-hvn-black tracking-tight">
                {product.name}
              </h1>

              {product.capacity && (
                <div className="flex items-center gap-2 text-sm text-hvn-steel">
                  <Users className="h-4 w-4" />
                  {product.capacity}
                </div>
              )}

              <p className="text-hvn-steel leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            {!isComingSoon && (
              <div className="rounded-xl border border-hvn-mist/50 bg-hvn-cream p-5 space-y-1">
                <p className="text-xs text-hvn-steel">Price</p>
                <div className="flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-mono)] text-3xl font-bold text-hvn-black">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="font-[family-name:var(--font-mono)] text-lg text-hvn-steel line-through">
                      {formatPrice(product.comparePrice, product.currency)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-hvn-steel">
                  SKU: {product.sku}
                </p>
              </div>
            )}

            {/* CTA */}
            {isComingSoon ? (
              <WaitlistSection productName={product.name} />
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/configure"
                  className="group flex items-center justify-center gap-2 rounded-lg bg-hvn-neon px-6 py-3.5 text-sm font-semibold text-hvn-white transition-all hover:bg-hvn-neon-bright"
                >
                  Configure This Pod
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 rounded-lg border border-hvn-mist px-6 py-3.5 text-sm font-medium text-hvn-steel transition-all hover:border-hvn-steel hover:text-hvn-black hover:bg-hvn-mist/30"
                >
                  Request Quote
                </Link>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-hvn-silver uppercase tracking-widest">
                  Features
                </h3>
                <ul className="space-y-2.5">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-hvn-steel">
                      <CheckCircle2 className="h-4 w-4 text-hvn-forest-light flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Specs section */}
        {Object.keys(specs).length > 0 && (
          <div className="mt-16 lg:mt-24">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-hvn-black tracking-tight mb-8">
              Specifications
            </h2>
            <div className="rounded-2xl border border-hvn-mist/50 overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(specs).map(([key, value], i) => (
                    <tr
                      key={key}
                      className={`border-b border-hvn-mist/40 last:border-0 ${
                        i % 2 === 0 ? "bg-hvn-cream/60" : "bg-hvn-cream/40"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-hvn-silver w-1/3 capitalize">
                        {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                      </td>
                      <td className="px-6 py-4 text-sm text-hvn-steel">
                        {String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quote request section */}
        {!isComingSoon && (
          <div className="mt-16 lg:mt-24 rounded-2xl border border-hvn-mist/50 bg-hvn-cream p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-heading)] text-2xl lg:text-3xl font-bold text-hvn-black tracking-tight">
                  Ready to get a quote?
                </h2>
                <p className="text-hvn-steel leading-relaxed">
                  Tell us about your space and requirements. Our team will put together a tailored quote within 24 hours.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-hvn-steel pt-2">
                  {["24-hour response", "No obligation", "Volume pricing available"].map(
                    (item) => (
                      <span key={item} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-hvn-forest-light" />
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              <QuoteForm productName={product.name} productSlug={product.slug} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WaitlistSection({ productName }: { productName: string }) {
  return (
    <div className="rounded-xl border border-hvn-mist/50 bg-hvn-cream p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-hvn-silver">
        <Clock className="h-4 w-4" />
        <span>This product is coming soon</span>
      </div>
      <p className="text-sm text-hvn-steel">
        Join the waitlist and be the first to know when {productName} launches.
      </p>
      <WaitlistForm productName={productName} />
    </div>
  );
}

function WaitlistForm({ productName }: { productName: string }) {
  return (
    <form
      action="/api/waitlist"
      method="POST"
      className="flex flex-col sm:flex-row gap-3"
    >
      <input type="hidden" name="product" value={productName} />
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        required
        className="flex-1 rounded-lg border border-hvn-mist bg-hvn-mist/30 px-4 py-2.5 text-sm text-hvn-black placeholder:text-hvn-silver focus:outline-none focus:border-hvn-steel transition-colors"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-lg bg-hvn-cream border border-hvn-mist px-5 py-2.5 text-sm font-medium text-hvn-steel hover:border-hvn-steel hover:text-hvn-black transition-all"
      >
        Join Waitlist
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function QuoteForm({
  productName,
  productSlug,
}: {
  productName: string;
  productSlug: string;
}) {
  return (
    <form action="/api/quote" method="POST" className="space-y-4">
      <input type="hidden" name="product" value={productSlug} />
      <input type="hidden" name="productName" value={productName} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-hvn-steel mb-1.5 block">Name</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-lg border border-hvn-mist bg-hvn-mist/30 px-4 py-2.5 text-sm text-hvn-black placeholder:text-hvn-silver focus:outline-none focus:border-hvn-steel transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-hvn-steel mb-1.5 block">Company</label>
          <input
            type="text"
            name="company"
            placeholder="Company name"
            className="w-full rounded-lg border border-hvn-mist bg-hvn-mist/30 px-4 py-2.5 text-sm text-hvn-black placeholder:text-hvn-silver focus:outline-none focus:border-hvn-steel transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-hvn-steel mb-1.5 block">Email</label>
        <input
          type="email"
          name="email"
          required
          placeholder="your@company.com"
          className="w-full rounded-lg border border-hvn-mist bg-hvn-mist/30 px-4 py-2.5 text-sm text-hvn-black placeholder:text-hvn-silver focus:outline-none focus:border-hvn-steel transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-hvn-steel mb-1.5 block">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="+20 xxx xxx xxxx"
            className="w-full rounded-lg border border-hvn-mist bg-hvn-mist/30 px-4 py-2.5 text-sm text-hvn-black placeholder:text-hvn-silver focus:outline-none focus:border-hvn-steel transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-hvn-steel mb-1.5 block">Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            defaultValue="1"
            className="w-full rounded-lg border border-hvn-mist bg-hvn-mist/30 px-4 py-2.5 text-sm text-hvn-black placeholder:text-hvn-silver focus:outline-none focus:border-hvn-steel transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-hvn-steel mb-1.5 block">
          Message (optional)
        </label>
        <textarea
          name="message"
          rows={3}
          placeholder="Tell us about your space and any specific requirements..."
          className="w-full rounded-lg border border-hvn-mist bg-hvn-mist/30 px-4 py-2.5 text-sm text-hvn-black placeholder:text-hvn-silver focus:outline-none focus:border-hvn-steel transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="group w-full flex items-center justify-center gap-2 rounded-lg bg-hvn-neon px-6 py-3 text-sm font-semibold text-hvn-white transition-all hover:bg-hvn-neon-bright"
      >
        Send Quote Request
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
