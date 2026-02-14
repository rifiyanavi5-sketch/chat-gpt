"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });

    setLoading(false);
    if (!response.ok) {
      setError("Invalid credentials");
      return;
    }

    const { role } = await response.json();
    router.push(role === "ADMIN" ? "/admin" : "/operator");
  }

  return (
    <form
      action={onSubmit}
      className="mx-auto mt-6 flex max-w-md flex-col gap-3 rounded-xl border bg-white p-4 dark:bg-slate-900"
    >
      <h1 className="text-xl font-semibold">Login</h1>
      <input className="rounded-lg border px-3 py-2" type="email" name="email" placeholder="Email" required />
      <input className="rounded-lg border px-3 py-2" type="password" name="password" placeholder="Password" required />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button disabled={loading} className="rounded-lg bg-indigo-600 px-3 py-2 text-white disabled:opacity-50">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
