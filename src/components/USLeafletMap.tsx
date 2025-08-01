"use client";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import ReferenceHover from "./ReferenceHover";

import "leaflet/dist/leaflet.css";
import { useState, useRef } from "react";

// Example: US States GeoJSON (use a CDN or local file for full US states)
const usStatesGeoJsonUrl = "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";


// Helper to map state names to abbreviations (for GeoJSON compatibility)
const stateNameToAbbr: Record<string, string> = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
};

export default function USLeafletMap() {
  const [geoJson, setGeoJson] = useState<any>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const loadingStates = useRef<Record<string, boolean>>({});
  const [popup, setPopup] = useState<{ latlng: [number, number]; abbr: string; stateName: string } | null>(null);

  // Fetch GeoJSON on mount
  if (!geoJson && typeof window !== "undefined") {
    fetch(usStatesGeoJsonUrl)
      .then((res) => res.json())
      .then((data) => setGeoJson(data));
  }

  // Fetch summary for a state if not already loaded
  const fetchSummary = async (stateName: string) => {
    const abbr = stateNameToAbbr[stateName] || stateName;
    if (summaries[abbr] || loadingStates.current[abbr]) return;
    loadingStates.current[abbr] = true;
    setSummaries((prev) => ({ ...prev, [abbr]: "Loading..." }));
    try {
      const res = await fetch("/api/opm-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: stateName }),
      });
      const data = await res.json();
      setSummaries((prev) => ({ ...prev, [abbr]: data.summary || "No summary available." }));
    } catch {
      setSummaries((prev) => ({ ...prev, [abbr]: "Failed to load summary." }));
    } finally {
      loadingStates.current[abbr] = false;
    }
  };

  // Demo: simple mapping of reference numbers to table info (in real use, this should be dynamic)
  const referenceTableMap: Record<string, string> = {
    "1": "Table 1: Federal Employment by State, OPM 2025 Report\nhttps://www.opm.gov/data/employment/table1",
    "2": "Table 2: Occupation Groups, OPM 2025\nhttps://www.opm.gov/data/employment/table2",
    "3": "Table 3: STEM Occupations, OPM 2025\nhttps://www.opm.gov/data/employment/table3",
    "4": "Table 4: Age Distribution, OPM 2025\nhttps://www.opm.gov/data/employment/table4",
  };

  // Replace [n] or superscript numbers in summary with ReferenceHover
  function renderSummaryWithRefs(summary: string) {
    if (!summary) return null;
    // Replace [n] and superscript numbers
    const parts = [];
    let lastIdx = 0;
    const regex = /\[(\d+)\]|<sup>(\d+)<\/sup>|\^(\d+)/g;
    let match;
    while ((match = regex.exec(summary)) !== null) {
      const idx = match.index;
      const number = match[1] || match[2] || match[3];
      if (idx > lastIdx) parts.push(summary.slice(lastIdx, idx));
      parts.push(
        <ReferenceHover key={idx} number={number} tableInfo={referenceTableMap[number] || "No table info available."} />
      );
      lastIdx = regex.lastIndex;
    }
    if (lastIdx < summary.length) parts.push(summary.slice(lastIdx));
    return parts;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <MapContainer center={[37.8, -96]} zoom={4} scrollWheelZoom={true} style={{ height: 500, width: "100%", maxWidth: 900, borderRadius: 24 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoJson && (
          <GeoJSON
            data={geoJson}
            eventHandlers={{
              add: (e) => {
                // Set style for all features
                e.target.setStyle({ color: "#6c4cff", weight: 2, fillColor: "#a084ee", fillOpacity: 0.6 });
              },
            }}
            onEachFeature={(feature: any, layer: any) => {
              const stateName = feature.properties?.name;
              const abbr = stateNameToAbbr[stateName] || stateName;
              layer.on("click", (e: any) => {
                setPopup({ latlng: [e.latlng.lat, e.latlng.lng], abbr, stateName });
                fetchSummary(stateName);
              });
            }}
          />
        )}
        {popup && (
          <Popup position={popup.latlng} eventHandlers={{ remove: () => setPopup(null) }}>
            <div style={{ minWidth: 260, minHeight: 60, maxHeight: 260, overflowY: 'auto' }}>
              <div className="font-bold mb-1">{popup.stateName}</div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {renderSummaryWithRefs(summaries[popup.abbr]) || "Loading..."}
              </div>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
