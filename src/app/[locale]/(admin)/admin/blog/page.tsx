import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Eye, EyeOff } from "lucide-react";

const CATEGORY_STYLES: Record<string, string> = {
  JOURNAL: "bg-hvn-info/20 text-blue-300 border-hvn-info/30",
  CASE_STUDY: "bg-hvn-forest/20 text-green-300 border-hvn-forest/30",
  NEWS: "bg-hvn-warning/20 text-yellow-300 border-hvn-warning/30",
};

function CategoryBadge({ category }: { category: string }) {
  const cls =
    CATEGORY_STYLES[category] ??
    "bg-hvn-mist/40 text-hvn-steel border-hvn-mist/40";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}
    >
      {category.replace("_", " ")}
    </span>
  );
}

function PublishedBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
        published
          ? "bg-hvn-forest/20 text-green-300 border-hvn-forest/30"
          : "bg-hvn-mist/40 text-hvn-steel border-hvn-mist/40"
      }`}
    >
      {published ? <Eye size={10} /> : <EyeOff size={10} />}
      {published ? "Published" : "Draft"}
    </span>
  );
}

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-hvn-black font-[family-name:var(--font-heading)]">
            Blog Posts
          </h1>
          <p className="text-sm text-hvn-steel mt-1">
            Manage your blog content
          </p>
        </div>
        <Link
          href="/en/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-hvn-neon hover:bg-hvn-neon-bright text-hvn-white text-sm font-medium transition-colors whitespace-nowrap"
        >
          <Plus size={14} />
          New Post
        </Link>
      </div>

      {/* Table */}
      <div className="bg-hvn-cream border border-hvn-mist rounded-lg overflow-hidden">
        {posts.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-hvn-steel">
            No blog posts yet.{" "}
            <Link
              href="/en/admin/blog/new"
              className="text-hvn-steel underline underline-offset-2 hover:text-hvn-black transition-colors"
            >
              Create your first post.
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hvn-mist">
                  {["Title", "Category", "Author", "Status", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs uppercase tracking-wider text-hvn-steel font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-hvn-mist/50">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-hvn-mist/20 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-hvn-steel font-medium">
                          {post.title}
                        </p>
                        <p className="text-hvn-steel text-xs mt-0.5">
                          /{post.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <CategoryBadge category={post.category} />
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {post.authorName ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <PublishedBadge published={post.published} />
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-hvn-steel text-right">
        {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>
    </div>
  );
}
