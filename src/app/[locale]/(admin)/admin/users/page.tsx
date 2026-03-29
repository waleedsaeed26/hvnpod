import { prisma } from "@/lib/prisma";
import { Shield, User } from "lucide-react";

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "ADMIN";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
        isAdmin
          ? "bg-hvn-forest/20 text-green-300 border-hvn-forest/30"
          : "bg-hvn-mist/40 text-hvn-steel border-hvn-mist/40"
      }`}
    >
      {isAdmin ? <Shield size={10} /> : <User size={10} />}
      {role}
    </span>
  );
}

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      company: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-hvn-black font-[family-name:var(--font-heading)]">
          Users
        </h1>
        <p className="text-sm text-hvn-steel mt-1">
          Registered user accounts
        </p>
      </div>

      {/* Table */}
      <div className="bg-hvn-cream border border-hvn-mist rounded-lg overflow-hidden">
        {users.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-hvn-steel">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hvn-mist">
                  {["Name", "Email", "Role", "Company", "Joined"].map((h) => (
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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-hvn-mist/20 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-hvn-steel font-medium whitespace-nowrap">
                      {user.name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel">
                      <a
                        href={`mailto:${user.email}`}
                        className="hover:text-hvn-steel transition-colors"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {user.company ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-hvn-steel whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
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
        {users.length} {users.length === 1 ? "user" : "users"}
      </p>
    </div>
  );
}
