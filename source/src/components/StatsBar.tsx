import type { Category, Product, SiteInfo, Stat } from "@/lib/types";

export default function StatsBar({
  info,
  products,
  categories,
}: {
  info: SiteInfo;
  products: Product[];
  categories: Category[];
}) {
  const derivedStats: Stat[] = [
    { label: "Catalog products", value: products.length.toLocaleString() },
    { label: "Categories", value: categories.length.toLocaleString() },
    {
      label: "With images",
      value: products.filter((product) => product.hasImage !== false && product.image).length.toLocaleString(),
    },
    {
      label: "Multi-image items",
      value: products.filter((product) => (product.gallery?.length ?? 0) > 1).length.toLocaleString(),
    },
  ];
  const stats = info.stats && info.stats.length > 0 ? info.stats : derivedStats;

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="container-page grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-slate-200 sm:grid-cols-4">
        {stats.slice(0, 4).map((s) => (
          <div key={s.label} className="bg-white px-5 py-6 text-center">
            <div className="text-2xl font-extrabold tracking-tight text-brand-700 sm:text-3xl">
              {s.value}
            </div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
