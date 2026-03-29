import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AcousticPodsShowcase from "@/components/products/acoustic-pods-showcase";

export const metadata = {
  title: "Acoustic Privacy Pods — HVNPOD",
  description:
    "Premium acoustic pods for focused work, private calls, and compact meetings. Three models: One, Duo, and Meet.",
};

type ProductWithImages = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  model: string | null;
  tier: string | null;
  price: number;
  capacity: string | null;
  specs: string | null;
  features: string | null;
  images: { id: string; url: string; alt: string | null; order: number }[];
};

type ModelGroup = {
  model: string;
  products: ProductWithImages[];
  corePrice: number;
  capacity: string;
  tagline: string;
  idealFor: string;
  keySpecs: string[];
};

const MODEL_META: Record<
  string,
  { tagline: string; idealFor: string; keySpecs: string[] }
> = {
  One: {
    tagline: "Solo focus. Maximum privacy.",
    idealFor: "Calls \u00B7 Deep work \u00B7 Video meetings",
    keySpecs: [
      "1-person capacity",
      "30 dB acoustic isolation",
      "Built-in ventilation system",
      "Power & USB-C pass-through",
      "2-week lead time",
    ],
  },
  Duo: {
    tagline: "Private collaboration for two.",
    idealFor: "1:1 meetings \u00B7 Interviews \u00B7 Mentoring",
    keySpecs: [
      "2-person capacity",
      "30 dB acoustic isolation",
      "Dual ventilation system",
      "Power outlets & data ports",
      "2\u20133 week lead time",
    ],
  },
  Meet: {
    tagline: "Compact meeting room. No construction.",
    idealFor: "Team huddles \u00B7 Client calls \u00B7 Presentations",
    keySpecs: [
      "Up to 4-person capacity",
      "30 dB acoustic isolation",
      "Multi-zone ventilation",
      "Display-ready data ports",
      "3-week lead time",
    ],
  },
};

const TIER_ORDER = ["Core", "Plus", "Signature"];

function groupByModel(products: ProductWithImages[]): ModelGroup[] {
  const map = new Map<string, ProductWithImages[]>();

  for (const product of products) {
    const model = product.model ?? "Unknown";
    if (!map.has(model)) map.set(model, []);
    map.get(model)!.push(product);
  }

  const result: ModelGroup[] = [];

  for (const [model, prods] of map.entries()) {
    const coreProd = prods.find((p) => p.tier === "Core") ?? prods[0];
    const meta = MODEL_META[model] ?? {
      tagline: "",
      idealFor: "",
      keySpecs: [],
    };

    result.push({
      model,
      products: prods.sort(
        (a, b) =>
          TIER_ORDER.indexOf(a.tier ?? "") - TIER_ORDER.indexOf(b.tier ?? "")
      ),
      corePrice: coreProd.price,
      capacity: coreProd.capacity ?? "",
      tagline: meta.tagline,
      idealFor: meta.idealFor,
      keySpecs: meta.keySpecs,
    });
  }

  const modelOrder = ["One", "Duo", "Meet"];
  return result.sort(
    (a, b) => modelOrder.indexOf(a.model) - modelOrder.indexOf(b.model)
  );
}

export default async function AcousticPodsPage() {
  const category = await prisma.category.findUnique({
    where: { slug: "acoustic-pods" },
  });

  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: {
      published: true,
      category: { slug: "acoustic-pods" },
    },
    include: {
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { price: "asc" },
  });

  const modelGroups = groupByModel(products as ProductWithImages[]);

  return <AcousticPodsShowcase modelGroups={modelGroups} />;
}
