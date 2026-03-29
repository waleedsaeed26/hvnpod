import { prisma } from "@/lib/prisma";

const STATUSES = ["ALL", "NEW", "REVIEWED", "QUOTED", "CLOSED"];

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-hvn-info/20 text-blue-300 border-hvn-info/30",
  REVIEWED: "bg-hvn-warning/20 text-yellow-300 border-hvn-warning/30",
  QUOTED: "bg-hvn-forest/20 text-green-300 border-hvn-forest/30",
  CLOSED: "bg-hvn-mist/40 text-hvn-steel border-hvn-mist/40",
};

function StatusBadge({ status }: { status: string }) {
  const cls =
    STATUS_STYLES[status] ??
    "bg-hvn-mist/40 text-hvn-steel border-hvn-mist/40";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}
    >
      {status}
    </span>
  );
}

async function getQuotes(status?: string) {
  return prisma.quoteRequest.findMany({
    where: status && status !== "ALL" ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
    },
  });
}

async function getCounts() {
  const counts: Record<string, number> = { ALL: 0 };
  const rows = await prisma.quoteRequest.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  for (const row of rows) {
    counts[row.status] = row._count._all;
    counts.ALL = (counts.ALL ?? 0) + row._count._all;
  }
  return counts;
}

export default async function QuotesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = STATUSES.includes(status ?? "") ? status : "ALL";

  const [quotes, counts] = await Promise.all([
    getQuotes(activeStatus),
    getCounts(),
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-hvn-black font-[family-name:var(--font-heading)]">
          Quote Requests
        </h1>
        <p className="text-sm text-hvn-steel mt-1">
          Manage and respond to incoming quote requests
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-hvn-mist pb-0 overflow-x-auto">
        {STATUSES.map((s) => {
          const isActive = activeStatus === s;
          const count = counts[s] ?? 0;
          return (
            <a
              key={s}
              href={`?status=${s}`}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                isActive
                  ? "border-hvn-forest text-hvn-black"
                  : "border-transparent text-hvn-steel hover:text-hvn-steel"
              }`}
            >
              {s}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                  isActive
                    ? "bg-hvn-forest/30 text-hvn-black"
                    : "bg-hvn-pearl text-hvn-steel"
                }`}
              >
                {count}
              </span>
            </a>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-hvn-cream border border-hvn-mist rounded-lg overflow-hidden">
        {quotes.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-hvn-steel">
            No quote requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hvn-mist">
                  {[
                    "Name",
                    "Email",
                    "Company",
                    "Product",
                    "Model",
                    "Tier",
                    "Qty",
                    "Status",
                    "Date",
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
                {quotes.map((q) => (
                  <tr
                    key={q.id}
                    className="hover:bg-hvn-mist/20 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-hvn-steel font-medium whitespace-nowrap">
                      {q.name}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel">
                      <a
                        href={`mailto:${q.email}`}
                        className="hover:text-hvn-steel transition-colors"
                      >
                        {q.email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {q.company ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {q.product?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {q.model ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {q.tier ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel text-center">
                      {q.quantity}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {new Date(q.createdAt).toLocaleDateString("en-GB", {
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
        {quotes.length} {quotes.length === 1 ? "record" : "records"}
      </p>
    </div>
  );
}
