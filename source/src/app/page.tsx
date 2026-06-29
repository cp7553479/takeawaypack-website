import CategoryGrid from "@/components/CategoryGrid";
import HeroSection from "@/components/HeroSection";
import InquiryCTA from "@/components/InquiryCTA";
import ProcessSteps from "@/components/ProcessSteps";
import ProductCard from "@/components/ProductCard";
import StatsBar from "@/components/StatsBar";
import TrustSection from "@/components/TrustSection";
import { getFeaturedProducts, getSiteData } from "@/lib/dataAdapter";

export default function HomePage() {
  const data = getSiteData();
  const featured = getFeaturedProducts(6);

  return (
    <>
      <HeroSection info={data.info} />
      <StatsBar info={data.info} />
      <CategoryGrid categories={data.categories} />

      <section className="section bg-slate-50">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Featured</span>
              <h2 className="h-section mt-2">Popular packaging for trade buyers</h2>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <TrustSection info={data.info} />
      <ProcessSteps info={data.info} />
      <InquiryCTA />
    </>
  );
}
