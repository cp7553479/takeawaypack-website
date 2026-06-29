import { ShieldCheck, Palette, Truck, FileCheck2 } from "lucide-react";

import SectionHeading from "@/components/section-heading";
import { Card } from "@/components/ui/card";

interface ValuePropsProps {
  pillars?: string[];
}

const FALLBACK_PILLARS = [
  "Custom printing & private label available",
  "Material options to confirm per item",
  "Export packing and consolidated shipping",
  "Supplier communication support for RFQs",
];

const ICONS = [Palette, ShieldCheck, FileCheck2, Truck];

/**
 * "Why source here" pillars. Uses verified value props from the imported site
 * info when present; otherwise falls back to the documented sample pillars.
 */
export default function ValueProps({ pillars }: ValuePropsProps) {
  const items = (pillars && pillars.length ? pillars : FALLBACK_PILLARS).slice(0, 4);

  return (
    <section className="section bg-secondary/50">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why TakeawayPack"
          title="Built around the questions overseas packaging buyers ask first"
          description="The site is engineered to move procurement teams from shortlist to quote with fewer clarification loops — products, materials, customization paths, and RFQ details up front."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((pillar, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <Card key={pillar} className="h-full p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-base font-semibold leading-relaxed text-foreground">
                  {pillar}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
