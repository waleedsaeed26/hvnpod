import { prisma } from "@/lib/prisma";
import { CategoryFilter } from "@/components/journal/category-filter";
import { Minus } from "lucide-react";

export async function generateMetadata() {
  return {
    title: "Journal — HVNPOD",
    description:
      "Insights on acoustic privacy, workspace design, and the future of focus — from the HVNPOD team.",
  };
}

export default async function JournalPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
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

        {/* Vertical accent */}
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-hvn-forest/30 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Minus className="h-4 w-4 text-hvn-forest-light" />
              <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
                Journal
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl font-bold text-hvn-black tracking-tight leading-[0.95] mb-6">
              Journal
            </h1>

            <p className="text-hvn-silver text-lg leading-relaxed">
              Insights on acoustic privacy, workspace design, and the future of
              focus — written for the people who take their work seriously.
            </p>
          </div>
        </div>
      </section>

      {/* ── Posts ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryFilter posts={posts} />
        </div>
      </section>
    </div>
  );
}
