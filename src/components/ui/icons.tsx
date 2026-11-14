import type { SVGProps } from "react";

/**
 * Hand-tuned 24px line icons. All inherit `currentColor` and accept any SVG
 * prop; they are decorative by default (`aria-hidden`).
 */

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowUpRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Icon>
);

export const ArrowRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Icon>
);

export const ArrowDown = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </Icon>
);

export const ChevronDown = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const Close = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const Search = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Icon>
);

export const Bed = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 18v-6.5A2.5 2.5 0 0 1 5.5 9h13a2.5 2.5 0 0 1 2.5 2.5V18M3 15h18M6 9V6.5h12V9M3 18v1.5M21 18v1.5" />
  </Icon>
);

export const Bath = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 12h18v2.5A4.5 4.5 0 0 1 16.5 19h-9A4.5 4.5 0 0 1 3 14.5V12ZM6 12V6.2A2.2 2.2 0 0 1 8.2 4c1 0 1.8.6 2.1 1.5M7 19l-1 1.5M17 19l1 1.5" />
  </Icon>
);

export const Area = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 4h16v16H4zM4 9h3M4 14h3M9 20v-3M14 20v-3" />
  </Icon>
);

export const MapPin = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icon>
);

export const Phone = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 4h3.5l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </Icon>
);

export const Mail = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Icon>
);

export const Check = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

export const Calendar = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Icon>
);

export const TrendUp = (props: IconProps) => (
  <Icon {...props}>
    <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />
  </Icon>
);

export const Camera = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13" r="3.2" />
  </Icon>
);
