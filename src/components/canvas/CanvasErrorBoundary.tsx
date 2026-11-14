"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Keeps a WebGL failure (no GPU, context lost, blocked by policy) from
 * taking the page down. The section's CSS backdrop simply shows instead.
 */
export class CanvasErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[canvas] WebGL scene disabled:", error);
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
