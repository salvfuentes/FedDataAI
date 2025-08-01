"use client";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// You can use a CDN topojson or add a local file for US states
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Example: Replace this with a fetch to your AI summary API per state
const stateSummaries: Record<string, string> = {
  CA: "California: OPM summary here...",
  TX: "Texas: OPM summary here...",
  NY: "New York: OPM summary here...",
  // ...
};

const stateAbbr: Record<string, string> = {
  6: "CA", 48: "TX", 36: "NY",  // FIPS to state abbr
  // ...add all FIPS codes
};

export default function USMapWithSummaries() {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{x: number, y: number} | null>(null);

  return (
    <div className="relative w-full flex flex-col items-center">
      <ComposableMap projection="geoAlbersUsa" width={800} height={500} style={{width: "100%", height: "auto"}}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const abbr = stateAbbr[geo.id as string];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={e => {
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
