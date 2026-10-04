/**
 * ULTRON GLOBAL INTELLIGENCE REAL 3D EARTH SURFACE
 * Directive Sections 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 21
 *
 * Uses Google Maps Platform 3D Maps JavaScript API (<gmp-map-3d>)
 * Replaces fake Three.js Earth with real Google 3D Earth imagery.
 */

"use client";

import React from "react";
import UltronEarth from "../intelligence/UltronEarth";
import { SelectedLocation } from "@/types/location";

export interface GlobalIntelligenceGlobeProps {
  selectedLocation?: SelectedLocation;
  onSelectLocation?: (loc: SelectedLocation) => void;
  targetCoordinates?: { lat: number; lon: number } | null;
  onInvestigateLocation?: (loc: SelectedLocation) => void;
}

export default function GlobalIntelligenceGlobe(props: GlobalIntelligenceGlobeProps) {
  return <UltronEarth {...props} />;
}
