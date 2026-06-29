import Image from "next/image";
import Link from "next/link";

import CategoryGrid from "@/components/CategoryGrid";
import HeroSection from "@/components/HeroSection";
import InquiryCTA from "@/components/InquiryCTA";
import ProcessSteps from "@/components/ProcessSteps";
import ProductCard from "@/components/ProductCard";
import StatsBar from "@/components/StatsBar";
import TrustSection from "@/components/TrustSection";
import { getFeaturedProducts, getSiteData } from "@/lib/dataAdapter";
import { getMediaAssetUrl } from "@/lib/mediaAssets";

const SOURCING_PILLARS = [
  {
    title: "Clear RFQ specs",
    body: "Share size, material, print, quantity, and destination so quotation details can be compared without guesswork.",
  },
  {
    title: "Sample-first decisions",
    body: "Use samples and artwork checks to confirm fit, print direction, and material feel before bulk purchase.",
  },
  {
    title: "Custom print & MOQ",
    body: "Discuss private-label artwork, carton marks, and realistic MOQ by item, material, and print method.",
  },
  {
    title: "Export packing reference",
    body: "Confirm carton packing, product protection, and shipping notes for international foodservice buyers.",
  },
];

export default async function HomePage() {
  const data = await getSiteData();
  const featured = await getFeaturedProducts(6);
  const [heroImage, customImage, qualityImage, ecoImage] = await Promise.all([
    getMediaAssetUrl("/generated/marketing/hero-global-foodservice-packaging.png"),
    getMediaAssetUrl("/generated/marketing/custom-print-packaging-showcase.png"),
    getMediaAssetUrl("/generated/marketing/factory-quality-control-packaging.png"),
    getMediaAssetUrl("/generated/marketing/ad-eco-packaging-sourcing.png"),
  ]);

  return (
    <>
      <HeroSection info={data.info} imageSrc={heroImage} />
      <StatsBar info={data.info} />
      <CategoryGrid categories={data.categories} />

      <section className="section">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
            <Image
              src={ecoImage}
              alt="Sustainable material options for foodservice packaging sourcing"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="eyebrow">Lower-risk sourcing</span>
            <h2 className="h-section mt-2">
              Built around the questions overseas packaging buyers ask first.
            </h2>
            <p className="lead mt-3">
              The homepage prioritizes products, materials, customization paths, and RFQ
              details so procurement teams can move from shortlist to quote with fewer
              clarification loops.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {SOURCING_PILLARS.map((pillar) => (
                <div key={pillar.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-950">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Get a Quote
              </Link>
              <Link href="/contact?intent=samples" className="btn-outline">
                Request Samples
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-slate-950 text-white">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow text-brand-300">Custom packaging</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              From stock format to branded export-ready packs.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
              Use the RFQ to confirm artwork, size, material structure, finish, and carton
              requirements. MOQ and pricing should be confirmed by specification rather than
              assumed from a generic catalog card.
            </p>
            <ul className="mt-7 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
              {[
                "Private-label print direction",
                "Material and coating options",
                "Size, capacity, and lid matching",
                "Carton marks and export packing notes",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-kraft-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
            <Image
              src={customImage}
              alt="Custom printed takeaway packaging mockups and branded foodservice packs"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">Featured</span>
              <h2 className="h-section mt-2">Popular packaging for trade buyers</h2>
            </div>
            <Link href="/products" className="btn-outline self-start sm:self-auto">
              Browse Products
            </Link>
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

      <section className="section bg-white">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="eyebrow">QC reference</span>
            <h2 className="h-section mt-2">Confirm the details that protect repeat orders.</h2>
            <p className="lead mt-3">
              Before production or shipment, buyers should align on approved sample, artwork,
              material, packing method, and inspection reference points. The image shown is a
              generated marketing visual for this workflow, not a claim of a specific factory.
            </p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <Image
              src={qualityImage}
              alt="Quality control reference workflow for foodservice packaging"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <InquiryCTA />
    </>
  );
}
