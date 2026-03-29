"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }

      router.push("/en/login");
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
            Create account
          </h2>
          <p className="text-sm text-hvn-steel mt-1">
            Join HVNPOD to request quotes and track orders
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
              htmlFor="name"
              className="block text-sm font-medium text-hvn-steel mb-1.5"
            >
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded bg-hvn-pearl border border-hvn-mist text-hvn-black placeholder-hvn-silver focus:outline-none focus:border-hvn-forest focus:ring-1 focus:ring-hvn-forest transition-colors text-sm"
              placeholder="Alex Johnson"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-hvn-steel mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded bg-hvn-pearl border border-hvn-mist text-hvn-black placeholder-hvn-silver focus:outline-none focus:border-hvn-forest focus:ring-1 focus:ring-hvn-forest transition-colors text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-hvn-steel mb-1.5"
            >
              Company{" "}
              <span className="text-hvn-steel font-normal">(optional)</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded bg-hvn-pearl border border-hvn-mist text-hvn-black placeholder-hvn-silver focus:outline-none focus:border-hvn-forest focus:ring-1 focus:ring-hvn-forest transition-colors text-sm"
              placeholder="Acme Corp"
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
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded bg-hvn-pearl border border-hvn-mist text-hvn-black placeholder-hvn-silver focus:outline-none focus:border-hvn-forest focus:ring-1 focus:ring-hvn-forest transition-colors text-sm"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-hvn-steel mb-1.5"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded bg-hvn-pearl border border-hvn-mist text-hvn-black placeholder-hvn-silver focus:outline-none focus:border-hvn-forest focus:ring-1 focus:ring-hvn-forest transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded bg-hvn-neon hover:bg-hvn-neon-bright text-hvn-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-hvn-steel">
          Already have an account?{" "}
          <Link
            href="/en/login"
            className="text-hvn-steel hover:text-hvn-black transition-colors underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
