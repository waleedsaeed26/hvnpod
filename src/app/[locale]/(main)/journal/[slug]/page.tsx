import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/journal/copy-link-button";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Minus,
} from "lucide-react";

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

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, coverImage: true },
  });
  if (!post) return {};
  return {
    title: `${post.title} — HVNPOD Journal`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

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
    <span className="inline-flex items-center rounded-full border border-hvn-forest/30 bg-hvn-forest/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-hvn-forest-light">
      {label}
    </span>
  );
}

function PostContent({ content }: { content: string }) {
  // Split content into paragraphs by double-newline or single newline
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {paragraphs.map((para, i) => {
        // Detect headings (lines starting with #)
        if (para.startsWith("# ")) {
          return (
            <h2
              key={i}
              className="font-[family-name:var(--font-heading)] text-2xl font-bold text-hvn-black tracking-tight mt-10 mb-2 first:mt-0"
            >
              {para.slice(2)}
            </h2>
          );
        }
        if (para.startsWith("## ")) {
          return (
            <h3
              key={i}
              className="font-[family-name:var(--font-heading)] text-xl font-semibold text-hvn-black tracking-tight mt-8 mb-2"
            >
              {para.slice(3)}
            </h3>
          );
        }
        if (para.startsWith("### ")) {
          return (
            <h4
              key={i}
              className="font-[family-name:var(--font-heading)] text-base font-semibold text-hvn-steel tracking-tight mt-6 mb-1"
            >
              {para.slice(4)}
            </h4>
          );
        }
        return (
          <p key={i} className="text-hvn-silver leading-[1.8] text-base">
            {para}
          </p>
        );
      })}
    </div>
  );
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const postUrl = `https://hvnpod.com/journal/${slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(post.title);

  return (
    <div className="min-h-screen bg-hvn-white">
      {/* ── Back link / Nav ────────────────────────────────── */}
      <div className="border-b border-hvn-mist/40 bg-hvn-cream/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/journal"
            className="group inline-flex items-center gap-2 text-sm text-hvn-steel hover:text-hvn-steel transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Journal
          </Link>
        </div>
      </div>

      {/* ── Cover image ───────────────────────────────────── */}
      {post.coverImage ? (
        <div className="w-full aspect-[21/8] overflow-hidden bg-hvn-cream border-b border-hvn-mist/40">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-hvn-cream via-hvn-pearl to-hvn-mist border-b border-hvn-mist/40 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-hvn-silver) 1px, transparent 1px), linear-gradient(90deg, var(--color-hvn-silver) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
      )}

      {/* ── Article ───────────────────────────────────────── */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <header className="space-y-6 mb-12">
          {/* Category + date row */}
          <div className="flex items-center gap-4 flex-wrap">
            <CategoryBadge category={post.category} />
            <div className="flex items-center gap-1.5 text-xs text-hvn-steel">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.createdAt.toISOString()}>
                {formatDate(post.createdAt)}
              </time>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-hvn-black tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Excerpt / lead */}
          {post.excerpt && (
            <p className="text-lg text-hvn-silver leading-relaxed border-l-2 border-hvn-forest/40 pl-5">
              {post.excerpt}
            </p>
          )}

          {/* Author */}
          {post.authorName && (
            <div className="flex items-center gap-3 pt-2 border-t border-hvn-mist/50">
              <div className="h-9 w-9 rounded-full border border-hvn-mist bg-hvn-pearl flex items-center justify-center">
                <User className="h-4 w-4 text-hvn-steel" />
              </div>
              <div>
                <p className="text-sm font-medium text-hvn-steel">
                  {post.authorName}
                </p>
                <p className="text-xs text-hvn-steel">HVNPOD Team</p>
              </div>
            </div>
          )}
        </header>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-hvn-mist/50" />
          <Minus className="h-3 w-3 text-hvn-forest-light" />
          <div className="h-px flex-1 bg-hvn-mist/50" />
        </div>

        {/* Body */}
        <div className="mb-16">
          <PostContent content={post.content} />
        </div>

        {/* Tags */}
        {post.tags && (
          <div className="mb-12 flex flex-wrap gap-2">
            {post.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-hvn-mist/60 bg-hvn-mist/20 px-3 py-1 text-xs text-hvn-steel"
                >
                  {tag}
                </span>
              ))}
          </div>
        )}

        {/* Share section */}
        <div className="rounded-2xl border border-hvn-mist/50 bg-hvn-cream p-7">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-hvn-steel" />
              <span className="text-sm font-medium text-hvn-silver">
                Share this article
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-hvn-mist text-hvn-silver transition-all hover:border-hvn-steel hover:text-hvn-black"
              >
                <TwitterXIcon className="h-4 w-4" />
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-hvn-mist text-hvn-silver transition-all hover:border-hvn-steel hover:text-hvn-black"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>

              {/* Copy link */}
              <CopyLinkButton url={postUrl} />
            </div>
          </div>
        </div>
      </article>

      {/* ── Back link footer ──────────────────────────────── */}
      <div className="border-t border-hvn-mist/40 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/journal"
            className="group inline-flex items-center gap-2 rounded-full border border-hvn-mist px-6 py-2.5 text-sm font-medium text-hvn-silver transition-all hover:border-hvn-steel hover:text-hvn-black hover:bg-hvn-cream"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Journal
          </Link>
        </div>
      </div>
    </div>
  );
}

