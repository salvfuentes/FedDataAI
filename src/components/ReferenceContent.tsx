import React from "react";
import ReferenceTooltip from "./ReferenceTooltip";

const ReferenceContent = ({ content }: { content: string }) => {
  const mockData: Record<string, any> = {
    "1": { state: "California", employees: 182276 },
    "2": { age: "65+", avgSalary: 122278, avgService: 20.6 },
    "3": { plan: "AT/LK", avgSalary: 222900, avgService: 24.3 },
    "4": { plan: "ND", avgSalary: 205745, avgService: 24.8 },
    "5": { note: "Data from 2025 OPM DB" },
  };
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /\[(\d+)\]/g;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(content)) !== null) {
    const number = match[1];
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{content.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <ReferenceTooltip key={key++} number={number} data={mockData[number] || {}} />
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push(<span key={key++}>{content.slice(lastIndex)}</span>);
  }
  return <>{parts}</>;
};

export default ReferenceContent;
