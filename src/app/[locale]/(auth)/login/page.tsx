"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/en/admin",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-hvn-cream border border-hvn-mist rounded-lg p-8 shadow-elevated">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-hvn-black font-[family-name:var(--font-heading)]">
            Sign in
          </h2>
          <p className="text-sm text-hvn-steel mt-1">
            Access your HVNPOD account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-hvn-error/20 border border-hvn-error/40">
            <p className="text-sm text-hvn-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-hvn-steel mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-hvn-pearl border border-hvn-mist text-hvn-black placeholder-hvn-silver focus:outline-none focus:border-hvn-forest focus:ring-1 focus:ring-hvn-forest transition-colors text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-hvn-steel mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-hvn-pearl border border-hvn-mist text-hvn-black placeholder-hvn-silver focus:outline-none focus:border-hvn-forest focus:ring-1 focus:ring-hvn-forest transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded bg-hvn-neon hover:bg-hvn-neon-bright text-hvn-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-hvn-steel">
          Don&apos;t have an account?{" "}
          <Link
            href="/en/register"
            className="text-hvn-steel hover:text-hvn-black transition-colors underline underline-offset-2"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
