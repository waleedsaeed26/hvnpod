"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  FileText,
  ClipboardCheck,
  BookOpen,
  MessageSquare,
  Users,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/en/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/en/admin/products", label: "Products", icon: Package },
  { href: "/en/admin/quotes", label: "Quotes", icon: FileText },
  { href: "/en/admin/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/en/admin/journal", label: "Journal", icon: BookOpen },
  { href: "/en/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/en/admin/users", label: "Users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/en/admin") {
      return pathname === "/en/admin";
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-60 shrink-0 bg-hvn-cream border-r border-hvn-mist flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-hvn-mist">
        <Link href="/en/admin">
          <span className="text-lg font-bold text-hvn-black tracking-widest font-[family-name:var(--font-heading)]">
            HVNPOD
          </span>
        </Link>
        <p className="text-xs text-hvn-steel mt-0.5 uppercase tracking-wider">
          Admin
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                active
                  ? "bg-hvn-forest/20 text-hvn-black border-l-2 border-hvn-forest"
                  : "text-hvn-steel hover:text-hvn-steel hover:bg-hvn-mist/50"
              }`}
            >
              <Icon
                size={16}
                className={active ? "text-hvn-forest-light" : "text-current"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-hvn-mist">
        <button
          onClick={() => signOut({ callbackUrl: "/en/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-hvn-steel hover:text-hvn-steel hover:bg-hvn-mist/50 transition-colors w-full"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
