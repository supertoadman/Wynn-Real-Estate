import { Icon } from "@/components/ui";
import { formatBaths, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Property } from "@/types";

/** Beds · baths · square feet, with tabular figures. */
export function PropertySpecs({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const specs = [
    {
      icon: <Icon.Bed />,
      value: property.bedroomsTotal,
      label: property.bedroomsTotal === 1 ? "bed" : "beds",
    },
    {
      icon: <Icon.Bath />,
      value: formatBaths(property.bathroomsFull, property.bathroomsHalf),
      label: "baths",
    },
    {
      icon: <Icon.Area />,
      value: formatNumber(property.livingArea),
      label: "sq ft",
    },
  ];

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]", className)}>
      {specs.map((spec) => (
        <li key={spec.label} className="flex items-center gap-1.5">
          <span className="text-base opacity-50">{spec.icon}</span>
          <span className="font-semibold tabular-nums">{spec.value}</span>
          <span className="opacity-60">{spec.label}</span>
        </li>
      ))}
    </ul>
  );
}
