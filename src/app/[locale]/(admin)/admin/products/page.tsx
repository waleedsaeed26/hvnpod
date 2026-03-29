import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: { select: { name: true } },
    },
  });
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
      {published ? (
        <Eye size={10} />
      ) : (
        <EyeOff size={10} />
      )}
      {published ? "Published" : "Draft"}
    </span>
  );
}

export default async function ProductsAdminPage() {
  const products = await getProducts();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-hvn-black font-[family-name:var(--font-heading)]">
            Products
          </h1>
          <p className="text-sm text-hvn-steel mt-1">
            Manage your product catalogue
          </p>
        </div>
        <Link
          href="/en/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-hvn-neon hover:bg-hvn-neon-bright text-hvn-white text-sm font-medium transition-colors whitespace-nowrap"
        >
          <Plus size={14} />
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-hvn-cream border border-hvn-mist rounded-lg overflow-hidden">
        {products.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-hvn-steel">
            No products found.{" "}
            <Link
              href="/en/admin/products/new"
              className="text-hvn-steel underline underline-offset-2 hover:text-hvn-black transition-colors"
            >
              Add your first product.
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hvn-mist">
                  {[
                    "Product",
                    "Category",
                    "Model",
                    "Tier",
                    "Price",
                    "SKU",
                    "Stock",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs uppercase tracking-wider text-hvn-steel font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-hvn-mist/50">
                {products.map((p) => {
                  const thumb = p.images[0];
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-hvn-mist/20 transition-colors"
                    >
                      {/* Product name + thumbnail */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-hvn-pearl shrink-0 overflow-hidden">
                            {thumb ? (
                              <Image
                                src={thumb.url}
                                alt={thumb.alt ?? p.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-hvn-mist text-xs">
                                —
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-hvn-steel font-medium whitespace-nowrap">
                              {p.name}
                            </p>
                            <p className="text-hvn-steel text-xs">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                        {p.category.name}
                      </td>
                      <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                        {p.model ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                        {p.tier ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap font-mono text-xs">
                        {p.currency}{" "}
                        {p.price.toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-hvn-steel font-mono text-xs whitespace-nowrap">
                        {p.sku}
                      </td>
                      <td className="px-5 py-3.5 text-hvn-steel text-center">
                        {p.stock}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <PublishedBadge published={p.published} />
                          {p.comingSoon && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-hvn-warning/20 text-yellow-300 border-hvn-warning/30">
                              Soon
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-hvn-steel text-right">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>
    </div>
  );
}
