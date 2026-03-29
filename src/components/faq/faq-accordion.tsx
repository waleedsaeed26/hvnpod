"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = {
  id: string;
  question: string;
  questionAr?: string | null;
  answer: string;
  answerAr?: string | null;
  category: string;
  order: number;
  published: boolean;
};

type FAQAccordionProps = {
  faqs: FAQ[];
};

const CATEGORY_ORDER = [
  "Products",
  "Ordering",
  "Delivery & Installation",
  "Maintenance",
  "Warranty",
];

function getCategoryLabel(category: string): string {
  return category;
}

function groupByCategory(faqs: FAQ[]): Map<string, FAQ[]> {
  const map = new Map<string, FAQ[]>();

  // Insert known categories first (in order)
  for (const cat of CATEGORY_ORDER) {
    map.set(cat, []);
  }

  for (const faq of faqs) {
    const key = faq.category ?? "General";
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(faq);
  }

  // Remove empty categories
  for (const [key, val] of map.entries()) {
    if (val.length === 0) map.delete(key);
  }

  return map;
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-hvn-mist/50 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-hvn-steel"
      >
        <span className="text-sm font-medium text-hvn-steel group-hover:text-hvn-steel transition-colors leading-relaxed">
          {faq.question}
        </span>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 flex-shrink-0 text-hvn-steel transition-transform duration-300 ${
            open ? "rotate-180 text-hvn-forest-light" : ""
          }`}
        />
      </button>

      {/* Animated answer */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-6 pr-10">
          <p className="text-sm text-hvn-silver leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

function CategorySection({
  category,
  faqs,
}: {
  category: string;
  faqs: FAQ[];
}) {
  return (
    <div className="rounded-2xl border border-hvn-mist/50 bg-hvn-cream overflow-hidden">
      {/* Category header */}
      <div className="px-7 py-5 border-b border-hvn-mist/50 bg-hvn-mist/20 flex items-center justify-between" role="heading" aria-level={2}>
        <span className="font-[family-name:var(--font-heading)] text-base font-semibold text-hvn-black tracking-tight">
          {getCategoryLabel(category)}
        </span>
        <span className="text-xs text-hvn-steel bg-hvn-mist/50 border border-hvn-mist/50 rounded-full px-2.5 py-0.5">
          {faqs.length}
        </span>
      </div>

      {/* FAQ items */}
      <div className="px-7">
        {faqs.map((faq) => (
          <FAQItem key={faq.id} faq={faq} />
        ))}
      </div>
    </div>
  );
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const grouped = groupByCategory(faqs);

  if (faqs.length === 0) {
    return (
      <div className="rounded-2xl border border-hvn-mist/50 bg-hvn-cream px-8 py-16 text-center">
        <p className="text-hvn-steel text-sm">No FAQs published yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([category, items]) => (
        <CategorySection key={category} category={category} faqs={items} />
      ))}
    </div>
  );
}
