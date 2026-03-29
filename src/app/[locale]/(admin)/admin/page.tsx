import { prisma } from "@/lib/prisma";
import { FileText, Package, Users, Mail, MessageSquare } from "lucide-react";

async function getStats() {
  const [
    totalQuotes,
    pendingQuotes,
    publishedProducts,
    newsletterSubscribers,
    unreadMessages,
    recentQuotes,
  ] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
    prisma.product.count({ where: { published: true } }),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        product: { select: { name: true } },
      },
    }),
  ]);

  return {
    totalQuotes,
    pendingQuotes,
    publishedProducts,
    newsletterSubscribers,
    unreadMessages,
    recentQuotes,
  };
}

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-hvn-info/20 text-blue-300 border-hvn-info/30",
  REVIEWED: "bg-hvn-warning/20 text-yellow-300 border-hvn-warning/30",
  QUOTED: "bg-hvn-forest/20 text-green-300 border-hvn-forest/30",
  CLOSED: "bg-hvn-mist/40 text-hvn-steel border-hvn-mist/40",
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-hvn-mist/40 text-hvn-steel border-hvn-mist/40";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}
    >
      {status}
    </span>
  );
}

export default async function AdminDashboard() {
  const {
    totalQuotes,
    pendingQuotes,
    publishedProducts,
    newsletterSubscribers,
    unreadMessages,
    recentQuotes,
  } = await getStats();

  const stats = [
    {
      label: "Total Quotes",
      value: totalQuotes,
      icon: FileText,
      sub: `${pendingQuotes} new`,
      subColor: pendingQuotes > 0 ? "text-yellow-400" : "text-hvn-steel",
    },
    {
      label: "Published Products",
      value: publishedProducts,
      icon: Package,
      sub: "live on site",
      subColor: "text-hvn-steel",
    },
    {
      label: "Subscribers",
      value: newsletterSubscribers,
      icon: Users,
      sub: "active",
      subColor: "text-hvn-steel",
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      icon: MessageSquare,
      sub: unreadMessages > 0 ? "needs attention" : "all clear",
      subColor: unreadMessages > 0 ? "text-hvn-error" : "text-hvn-steel",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-hvn-black font-[family-name:var(--font-heading)]">
          Dashboard
        </h1>
        <p className="text-sm text-hvn-steel mt-1">
          Overview of your HVNPOD operations
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, sub, subColor }) => (
          <div
            key={label}
            className="bg-hvn-cream border border-hvn-mist rounded-lg p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs uppercase tracking-wider text-hvn-steel font-medium">
                {label}
              </p>
              <div className="p-1.5 rounded bg-hvn-pearl">
                <Icon size={14} className="text-hvn-forest-light" />
              </div>
            </div>
            <p className="text-3xl font-bold text-hvn-black font-[family-name:var(--font-heading)]">
              {value}
            </p>
            <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent quotes */}
      <div className="bg-hvn-cream border border-hvn-mist rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-hvn-mist flex items-center gap-2">
          <Mail size={15} className="text-hvn-forest-light" />
          <h2 className="text-sm font-semibold text-hvn-black">
            Recent Quote Requests
          </h2>
        </div>

        {recentQuotes.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-hvn-steel">
            No quote requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hvn-mist">
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-hvn-steel font-medium">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-hvn-steel font-medium">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-hvn-steel font-medium">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-hvn-steel font-medium">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-hvn-steel font-medium">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-hvn-steel font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hvn-mist/50">
                {recentQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-hvn-mist/20 transition-colors">
                    <td className="px-6 py-3.5 text-hvn-steel font-medium">
                      {quote.name}
                    </td>
                    <td className="px-6 py-3.5 text-hvn-steel">
                      {quote.company ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-hvn-steel">
                      {quote.product?.name ?? quote.model ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-hvn-steel">
                      {quote.quantity}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={quote.status} />
                    </td>
                    <td className="px-6 py-3.5 text-hvn-steel whitespace-nowrap">
                      {new Date(quote.createdAt).toLocaleDateString("en-GB", {
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
    </div>
  );
}
