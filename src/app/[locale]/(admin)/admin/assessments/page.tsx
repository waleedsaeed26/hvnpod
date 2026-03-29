import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const STATUSES = ["PENDING", "SCHEDULED", "COMPLETED"] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-hvn-warning/20 text-yellow-300 border-hvn-warning/30",
  SCHEDULED: "bg-hvn-info/20 text-blue-300 border-hvn-info/30",
  COMPLETED: "bg-hvn-forest/20 text-green-300 border-hvn-forest/30",
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

async function updateStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  if (!id || !status) return;

  await prisma.siteAssessment.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/en/admin/assessments");
}

export default async function AssessmentsPage() {
  const assessments = await prisma.siteAssessment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-hvn-black font-[family-name:var(--font-heading)]">
          Site Assessments
        </h1>
        <p className="text-sm text-hvn-steel mt-1">
          Manage site assessment requests
        </p>
      </div>

      {/* Table */}
      <div className="bg-hvn-cream border border-hvn-mist rounded-lg overflow-hidden">
        {assessments.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-hvn-steel">
            No site assessments yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hvn-mist">
                  {[
                    "Date",
                    "Name",
                    "Company",
                    "Email",
                    "Address",
                    "Preferred Date",
                    "Notes",
                    "Status",
                    "Update",
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
                {assessments.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-hvn-mist/20 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {new Date(a.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel font-medium whitespace-nowrap">
                      {a.name}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {a.company}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel">
                      <a
                        href={`mailto:${a.email}`}
                        className="hover:text-hvn-steel transition-colors"
                      >
                        {a.email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel max-w-[200px] truncate">
                      {a.address ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {a.preferredDate ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel max-w-[200px] truncate">
                      {a.notes ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <form action={updateStatus}>
                        <input type="hidden" name="id" value={a.id} />
                        <div className="flex items-center gap-2">
                          <select
                            name="status"
                            defaultValue={a.status}
                            className="bg-hvn-pearl border border-hvn-mist text-hvn-black text-xs rounded px-2 py-1.5 focus:outline-none focus:border-hvn-forest"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-hvn-neon hover:bg-hvn-neon-bright text-hvn-white text-xs font-medium rounded transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-hvn-steel text-right">
        {assessments.length}{" "}
        {assessments.length === 1 ? "assessment" : "assessments"}
      </p>
    </div>
  );
}
