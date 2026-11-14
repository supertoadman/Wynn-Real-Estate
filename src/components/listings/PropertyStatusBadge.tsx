import { Badge, type BadgeTone } from "@/components/ui";
import { formatListingStatus } from "@/lib/formatters";
import type { Property } from "@/types";

function toneFor(property: Property, label: string): BadgeTone {
  switch (property.standardStatus) {
    case "Active":
      return label === "Open house" ? "gold" : "live";
    case "ComingSoon":
      return "glass";
    case "ActiveUnderContract":
    case "Pending":
      return "crimson";
    case "Closed":
      return "light";
  }
}

/** Live listing status — "Just listed", "Open house", "Sale pending", "Sold"… */
export function PropertyStatusBadge({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const label = formatListingStatus(property);
  const tone = toneFor(property, label);

  return (
    <Badge tone={tone} dot={tone === "live" || tone === "glass"} className={className}>
      {label}
    </Badge>
  );
}
