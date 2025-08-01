"use client";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
// Type for geo object from react-simple-maps
type GeoType = { id: string | number; rsmKey: string };
const isGeoType = (g: unknown): g is GeoType =>
  !!g && (typeof (g as any).id === 'string' || typeof (g as any).id === 'number') && typeof (g as any).rsmKey === 'string';

// You can use a CDN topojson or add a local file for US states
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Example: Replace this with a fetch to your AI summary API per state
const stateSummaries: Record<string, string> = {
  CA: "California: OPM summary here...",
  TX: "Texas: OPM summary here...",
  NY: "New York: OPM summary here...",
  // ...
};

// FIPS codes must be string keys, not numbers
const stateAbbr: Record<string, string> = {
  "06": "CA", "48": "TX", "36": "NY",  // FIPS to state abbr (as string)
  // ...add all FIPS codes as string keys
};

export default function USMapWithSummaries() {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{x: number, y: number} | null>(null);

  return (
    <div className="relative w-full flex flex-col items-center">
      <ComposableMap projection="geoAlbersUsa" width={800} height={500} style={{ width: "100%", height: "auto" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            (geographies as unknown[]).map((geo) => {
              if (!isGeoType(geo)) return null;
              const fips = String(geo.id).padStart(2, "0");
              const abbr = stateAbbr[fips] || fips;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(e: React.MouseEvent<SVGPathElement, MouseEvent>) => {
                    setTooltip(stateSummaries[abbr] || "No summary available");
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: { fill: "#a084ee", outline: "none" },
                    hover: { fill: "#6c4cff", outline: "none" },
                    pressed: { fill: "#bca6f7", outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {tooltip && tooltipPos && (
        <div
          className="absolute bg-[#23284a] text-white text-xs rounded-lg px-4 py-2 shadow-lg z-50"
          style={{ left: tooltipPos.x - 100, top: tooltipPos.y - 80, pointerEvents: "none", minWidth: 200 }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
