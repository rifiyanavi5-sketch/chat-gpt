export default function AdminPage() {
  return (
    <section className="space-y-3 rounded-xl border bg-white p-4 dark:bg-slate-900">
      <h1 className="text-xl font-semibold">Admin Console</h1>
      <p className="text-sm">Manage products, users, warehouses and variants via protected admin APIs.</p>
      <ul className="list-disc pl-5 text-sm">
        <li>POST /api/admin/products</li>
        <li>POST /api/admin/warehouses</li>
        <li>POST /api/admin/users</li>
      </ul>
    </section>
  );
}
