import React, { useState } from "react";

interface ReferenceHoverProps {
  number: string;
  tableInfo: string;
}

export default function ReferenceHover({ number, tableInfo }: ReferenceHoverProps) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", cursor: "pointer" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <sup style={{ color: "#6c4cff", fontWeight: 700 }}>{number}</sup>
      {show && (
        <div style={{
          position: "absolute",
          left: "50%",
          top: "1.5em",
          transform: "translateX(-50%)",
          background: "#fff",
          color: "#23284a",
          border: "1px solid #bca6f7",
          borderRadius: 8,
          boxShadow: "0 4px 16px 0 rgba(75,60,250,0.10)",
          padding: 12,
          zIndex: 1000,
          minWidth: 220,
          maxWidth: 320,
          fontSize: 13,
          whiteSpace: "pre-line"
        }}>
          {tableInfo}
        </div>
      )}
    </span>
  );
}
