"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["JOURNAL", "CASE_STUDY", "NEWS"] as const;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [category, setCategory] = useState<string>("JOURNAL");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [published, setPublished] = useState(false);

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      if (!slugManual) {
        setSlug(slugify(value));
      }
    },
    [slugManual]
  );

  const handleSlugChange = useCallback((value: string) => {
    setSlugManual(true);
    setSlug(slugify(value));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          category,
          excerpt: excerpt || undefined,
          content,
          coverImage: coverImage || undefined,
          tags: tags || undefined,
          authorName: authorName || undefined,
          published,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create post");
      }

      router.push("/en/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-hvn-black font-[family-name:var(--font-heading)]">
          New Blog Post
        </h1>
        <p className="text-sm text-hvn-steel mt-1">
          Create a new blog post
        </p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded bg-hvn-error/10 border border-hvn-error/30 text-hvn-error text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-hvn-cream border border-hvn-mist rounded-lg p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-hvn-steel font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-hvn-pearl border border-hvn-mist text-hvn-black rounded px-3 py-2.5 text-sm focus:outline-none focus:border-hvn-forest placeholder:text-hvn-silver"
              placeholder="Enter post title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-hvn-steel font-medium mb-2">
              Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full bg-hvn-pearl border border-hvn-mist text-hvn-black rounded px-3 py-2.5 text-sm focus:outline-none focus:border-hvn-forest placeholder:text-hvn-silver font-mono"
              placeholder="post-url-slug"
            />
            <p className="text-xs text-hvn-steel mt-1">
              Auto-generated from title. Edit to customise.
            </p>
          </div>

          {/* Category + Author row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-hvn-steel font-medium mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-hvn-pearl border border-hvn-mist text-hvn-black rounded px-3 py-2.5 text-sm focus:outline-none focus:border-hvn-forest"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-hvn-steel font-medium mb-2">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-hvn-pearl border border-hvn-mist text-hvn-black rounded px-3 py-2.5 text-sm focus:outline-none focus:border-hvn-forest placeholder:text-hvn-silver"
                placeholder="Author name"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-hvn-steel font-medium mb-2">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full bg-hvn-pearl border border-hvn-mist text-hvn-black rounded px-3 py-2.5 text-sm focus:outline-none focus:border-hvn-forest placeholder:text-hvn-silver resize-y"
              placeholder="Short description for previews"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-hvn-steel font-medium mb-2">
              Content *
            </label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full bg-hvn-pearl border border-hvn-mist text-hvn-black rounded px-3 py-2.5 text-sm focus:outline-none focus:border-hvn-forest placeholder:text-hvn-silver resize-y font-mono"
              placeholder="Write your blog content here..."
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-hvn-steel font-medium mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full bg-hvn-pearl border border-hvn-mist text-hvn-black rounded px-3 py-2.5 text-sm focus:outline-none focus:border-hvn-forest placeholder:text-hvn-silver"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-hvn-steel font-medium mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-hvn-pearl border border-hvn-mist text-hvn-black rounded px-3 py-2.5 text-sm focus:outline-none focus:border-hvn-forest placeholder:text-hvn-silver"
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-xs text-hvn-steel mt-1">
              Comma-separated list of tags
            </p>
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={published}
              onClick={() => setPublished(!published)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                published ? "bg-hvn-neon" : "bg-hvn-pearl"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-hvn-white transition-transform ${
                  published ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <label className="text-sm text-hvn-steel">
              {published ? "Published" : "Draft"}
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/en/admin/blog")}
            className="px-4 py-2.5 rounded border border-hvn-mist text-hvn-steel text-sm font-medium hover:text-hvn-black hover:border-hvn-mist transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded bg-hvn-neon hover:bg-hvn-neon-bright text-hvn-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
