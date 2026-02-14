import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4 rounded-xl border bg-white p-4 dark:bg-slate-900">
      <h1 className="text-2xl font-bold">BENCLO Warehouse System</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">Production-ready inventory and scanning workflow.</p>
      <Link href="/login" className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-white">
        Open Login
      </Link>
    </section>
  );
}
