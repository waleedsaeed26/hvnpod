"use client";

import { useState } from "react";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  authorName: string | null;
  category: string | null;
  tags: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type CategoryFilterProps = {
  posts: BlogPost[];
};

const CATEGORIES = ["ALL", "JOURNAL", "CASE_STUDY", "NEWS"] as const;
type CategoryKey = (typeof CATEGORIES)[number];

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  ALL: "All",
  JOURNAL: "Journal",
  CASE_STUDY: "Case Study",
  NEWS: "News",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function CategoryBadge({ category }: { category: string | null }) {
  const map: Record<string, string> = {
    JOURNAL: "Journal",
    CASE_STUDY: "Case Study",
    NEWS: "News",
  };
  const label = category ? (map[category] ?? category) : "Article";
  return (
    <span className="inline-flex items-center rounded-full border border-hvn-forest/30 bg-hvn-forest/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-hvn-forest-light">
      {label}
    </span>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <a
      href={`/journal/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-hvn-mist/50 bg-hvn-cream overflow-hidden transition-all duration-300 hover:border-hvn-mist hover:shadow-card"
    >
      {/* Cover image */}
      <div className="aspect-[16/9] bg-gradient-to-br from-hvn-pearl to-hvn-cream/60 overflow-hidden relative border-b border-hvn-mist/40">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-3 text-center">
              <div className="mx-auto w-12 h-12 border border-hvn-mist rounded-lg flex items-center justify-center">
                <div className="w-4 h-px bg-hvn-mist" />
              </div>
            </div>
          </div>
        )}

        {/* Category badge overlay */}
        <div className="absolute top-4 left-4">
          <CategoryBadge category={post.category} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 space-y-3">
        <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold text-hvn-black tracking-tight leading-snug group-hover:text-hvn-black transition-colors line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-hvn-silver leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-hvn-mist/40">
          <div className="space-y-0.5">
            {post.authorName && (
              <p className="text-xs text-hvn-steel">{post.authorName}</p>
            )}
            <p className="text-xs text-hvn-steel/70">
              {formatDate(post.createdAt)}
            </p>
          </div>
          <span className="text-xs font-medium text-hvn-forest-light group-hover:text-hvn-black transition-colors flex items-center gap-1">
            Read
            <svg
              className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

export function CategoryFilter({ posts }: CategoryFilterProps) {
  const [active, setActive] = useState<CategoryKey>("ALL");

  const filtered =
    active === "ALL" ? posts : posts.filter((p) => p.category === active);

  return (
    <div className="space-y-10">
      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => {
          const count =
            cat === "ALL"
              ? posts.length
              : posts.filter((p) => p.category === cat).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? "bg-hvn-cream text-hvn-black"
                  : "border border-hvn-mist text-hvn-silver hover:border-hvn-steel hover:text-hvn-black bg-transparent"
              }`}
            >
              {CATEGORY_LABELS[cat]}
              <span
                className={`text-[10px] rounded-full px-1.5 py-0.5 ${
                  active === cat
                    ? "bg-hvn-black/10 text-hvn-black"
                    : "bg-hvn-mist/50 text-hvn-steel"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-hvn-mist/50 bg-hvn-cream px-8 py-20 text-center">
          <p className="text-hvn-steel text-sm">No posts in this category yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
