"use client";
import dynamic from "next/dynamic";
import React from "react";

const USLeafletMap = dynamic(() => import("@/components/USLeafletMap"), { ssr: false });

export default function MapPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#181c2a] to-[#2e225a] p-8">
      <nav className="w-full flex items-center justify-between px-8 py-6 z-10">
        <div className="text-2xl font-bold text-white tracking-tight">FedDataAI.com</div>
        <div className="flex gap-6">
          <a href="/chat" className="text-[#bca6f7] font-semibold hover:underline">Chat</a>
          <a href="/map" className="text-[#bca6f7] font-semibold hover:underline">Map</a>
        </div>
      </nav>
      <section className="flex-1 flex flex-col items-center justify-start mt-8">
        <div className="w-full max-w-6xl bg-[#23284a] rounded-3xl shadow-2xl p-8 border-none">
          <h1 className="text-2xl font-bold text-white mb-6">Explore OPM Data on the US Map</h1>
          <USLeafletMap />
        </div>
      </section>
    </main>
  );
}
