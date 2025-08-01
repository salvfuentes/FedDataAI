"use client";

import { useEffect, useState } from "react";

export default function FilterPage() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((d) => setData(d || []));
  }, []);

  useEffect(() => {
    if (!query) {
      setFiltered(data);
    } else {
      setFiltered(
        data.filter((item) =>
          Object.values(item).some((v) =>
            String(v).toLowerCase().includes(query.toLowerCase())
          )
        )
      );
    }
  }, [query, data]);

  return (
    <main className="min-h-screen bg-[#edeaff] p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#4b3cfa]">Filter Data</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="mb-6 p-3 rounded-xl border-none shadow-lg w-full max-w-md bg-white text-[#222]"
        style={{ border: "none" }}
      />
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        {filtered.length === 0 ? (
          <div className="text-muted-foreground">No results found.</div>
        ) : (
          <ul className="space-y-4">
            {filtered.map((item, idx) => (
              <li key={idx} className="p-4 rounded-xl bg-[#f3f3f3] text-[#222] shadow-md">
                {Object.entries(item).map(([k, v]) => (
                  <div key={k}>
                    <span className="font-semibold">{k}:</span> {String(v)}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
