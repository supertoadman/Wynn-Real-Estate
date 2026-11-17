import {
  AboutWynn,
  ContactCTA,
  FeaturedListings,
  Hero,
  MarketExplorer,
} from "@/components/sections";
import { Marquee } from "@/components/ui";
import { brokerageFacts, marqueePhrases, servicePillars } from "@/data";
import { getNeighborhoods, getProperties } from "@/lib/api/listings";

/**
 * Homepage. A Server Component that loads listing data through the API
 * adapters and hands it to self-contained, interactive sections — add,
 * remove or reorder sections here without touching their internals.
 */
export default async function HomePage() {
  const [properties, neighborhoods] = await Promise.all([
    getProperties(),
    getNeighborhoods(),
  ]);

  return (
    <>
      <Hero properties={properties} neighborhoods={neighborhoods} />

      <div className="border-t border-white/10 bg-obsidian pb-16 pt-8 md:pb-20 md:pt-10">
        <Marquee items={marqueePhrases} />
      </div>

      <FeaturedListings properties={properties} neighborhoods={neighborhoods} />
      <MarketExplorer properties={properties} neighborhoods={neighborhoods} />
      <AboutWynn facts={brokerageFacts} pillars={servicePillars} />
      <ContactCTA />
    </>
  );
}
