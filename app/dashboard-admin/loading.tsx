export default function Loading() {
  return (
    <section className="space-y-6" aria-label="Memuat dashboard admin" role="status">
      <div className="skeleton h-20 rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => <div key={item} className="skeleton h-28 rounded-2xl" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="skeleton h-72 rounded-2xl" />
        <div className="skeleton h-72 rounded-2xl" />
      </div>
    </section>
  );
}
