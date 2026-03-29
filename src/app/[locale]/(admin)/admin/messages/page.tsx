import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Mail, MailOpen } from "lucide-react";

async function markAsRead(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });

  revalidatePath("/en/admin/messages");
}

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-hvn-black font-[family-name:var(--font-heading)]">
          Messages
        </h1>
        <p className="text-sm text-hvn-steel mt-1">
          Contact form inbox
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-hvn-forest/20 text-green-300 border border-hvn-forest/30">
              {unreadCount} unread
            </span>
          )}
        </p>
      </div>

      {/* Messages list */}
      <div className="bg-hvn-cream border border-hvn-mist rounded-lg overflow-hidden">
        {messages.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-hvn-steel">
            No messages yet.
          </div>
        ) : (
          <div className="divide-y divide-hvn-mist/50">
            {messages.map((msg) => (
              <details
                key={msg.id}
                className="group hover:bg-hvn-mist/20 transition-colors"
              >
                <summary className="cursor-pointer px-5 py-4 flex items-center gap-4 list-none [&::-webkit-details-marker]:hidden">
                  {/* Read/Unread icon */}
                  <div className="shrink-0">
                    {msg.read ? (
                      <MailOpen size={16} className="text-hvn-steel" />
                    ) : (
                      <Mail size={16} className="text-hvn-forest-light" />
                    )}
                  </div>

                  {/* Main row info */}
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_2fr_auto] gap-2 sm:gap-4 items-center">
                    <div className="min-w-0">
                      <p
                        className={`text-sm truncate ${
                          msg.read
                            ? "text-hvn-steel"
                            : "text-hvn-steel font-medium"
                        }`}
                      >
                        {msg.name}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <a
                        href={`mailto:${msg.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-hvn-steel hover:text-hvn-steel transition-colors truncate block"
                      >
                        {msg.email}
                      </a>
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm truncate ${
                          msg.read
                            ? "text-hvn-steel"
                            : "text-hvn-black font-medium"
                        }`}
                      >
                        {msg.subject}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <p className="text-xs text-hvn-steel whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="shrink-0">
                    {msg.read ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-hvn-mist/40 text-hvn-steel border-hvn-mist/40">
                        Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-hvn-forest/20 text-green-300 border-hvn-forest/30">
                        New
                      </span>
                    )}
                  </div>
                </summary>

                {/* Expanded message content */}
                <div className="px-5 pb-5 pt-0 ml-9">
                  <div className="bg-hvn-mist/30 border border-hvn-mist/40 rounded-lg p-4">
                    {msg.phone && (
                      <p className="text-xs text-hvn-steel mb-2">
                        Phone: {msg.phone}
                      </p>
                    )}
                    {msg.company && (
                      <p className="text-xs text-hvn-steel mb-2">
                        Company: {msg.company}
                      </p>
                    )}
                    <p className="text-sm text-hvn-steel whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>

                    {!msg.read && (
                      <form action={markAsRead} className="mt-4">
                        <input type="hidden" name="id" value={msg.id} />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-hvn-neon hover:bg-hvn-neon-bright text-hvn-white text-xs font-medium rounded transition-colors"
                        >
                          Mark as Read
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-hvn-steel text-right">
        {messages.length} {messages.length === 1 ? "message" : "messages"}
      </p>
    </div>
  );
}
