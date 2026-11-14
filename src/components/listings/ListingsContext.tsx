"use client";

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_FILTERS } from "@/lib/filters";
import type { LeadIntent, Property, PropertyFilters } from "@/types";

/** What the visitor is enquiring about, carried into the contact form. */
export interface Inquiry {
  property?: Property;
  intent?: LeadIntent;
}

interface ListingsContextValue {
  /** Search filters applied by the hero filter bar. */
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
  resetFilters: () => void;

  /** Listing shown in the quick-view drawer, if any. */
  quickView: Property | null;
  openQuickView: (property: Property) => void;
  closeQuickView: () => void;

  inquiry: Inquiry;
  setInquiry: (inquiry: Inquiry) => void;
}

const ListingsContext = createContext<ListingsContextValue | null>(null);

/**
 * Cross-section listing state: the hero search drives the featured grid,
 * any card can open the quick view, and the quick view can hand a listing
 * to the contact form. Mounted once in the root layout.
 */
export function ListingsProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [quickView, setQuickView] = useState<Property | null>(null);
  const [inquiry, setInquiry] = useState<Inquiry>({});

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const closeQuickView = useCallback(() => setQuickView(null), []);

  const value = useMemo<ListingsContextValue>(
    () => ({
      filters,
      setFilters,
      resetFilters,
      quickView,
      openQuickView: setQuickView,
      closeQuickView,
      inquiry,
      setInquiry,
    }),
    [filters, resetFilters, quickView, closeQuickView, inquiry],
  );

  return <ListingsContext value={value}>{children}</ListingsContext>;
}

export function useListings(): ListingsContextValue {
  const context = use(ListingsContext);
  if (!context) {
    throw new Error("useListings must be used inside <ListingsProvider>.");
  }
  return context;
}
