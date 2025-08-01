import React from "react";

export default function ReferenceTooltip({ number, data, children }: { number: number|string, data: any, children?: React.ReactNode }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          cursor: 'pointer',
          color: '#7c3aed',
          fontWeight: 'bold',
          background: '#ede9fe',
          borderRadius: '0.25rem',
          padding: '0 0.25em',
        }}
        tabIndex={0}
      >
        [{number}]
      </span>
      <span
        style={{
          visibility: 'hidden',
          opacity: 0,
          position: 'absolute',
          zIndex: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: '120%',
          background: '#23284a',
          color: '#fff',
          borderRadius: '0.5rem',
          padding: '1em',
          minWidth: '250px',
          boxShadow: '0 4px 16px 0 rgba(75,60,250,0.10)',
          transition: 'opacity 0.2s',
          fontSize: '0.95em',
          pointerEvents: 'none',
        }}
        className="reference-tooltip-content"
      >
        {data ? (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <span>No data found.</span>
        )}
      </span>
      <style>{`
        span[tabindex="0"]:hover + .reference-tooltip-content,
        span[tabindex="0"]:focus + .reference-tooltip-content {
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
      `}</style>
      {children}
    </span>
  );
}
