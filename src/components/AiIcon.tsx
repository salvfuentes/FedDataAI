import React from "react";

export default function AiIcon({ className = "", style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      className={className}
      style={style}
    >
      <g>
        <rect width="512" height="512" rx="120" fill="#fff6e0" />
        <path d="M256 64c-106 0-192 86-192 192s86 192 192 192 192-86 192-192S362 64 256 64zm0 352c-88.2 0-160-71.8-160-160S167.8 96 256 96s160 71.8 160 160-71.8 160-160 160z" fill="#ffe082" />
        <path d="M352 256a96 96 0 11-192 0 96 96 0 01192 0z" fill="#ffe082" />
        <rect x="200" y="200" width="112" height="112" rx="56" fill="#b6d0ff" />
        <rect x="224" y="224" width="64" height="64" rx="32" fill="#7faaff" />
        <rect x="240" y="240" width="32" height="32" rx="16" fill="#4b3cfa" />
        <g>
          <rect x="320" y="120" width="56" height="32" rx="16" fill="#b6d0ff" />
          <rect x="136" y="120" width="56" height="32" rx="16" fill="#b6d0ff" />
        </g>
        <g>
          <rect x="120" y="320" width="32" height="56" rx="16" fill="#b6d0ff" />
          <rect x="360" y="320" width="32" height="56" rx="16" fill="#b6d0ff" />
        </g>
        <g>
          <rect x="368" y="368" width="32" height="32" rx="16" fill="#b6d0ff" />
          <rect x="112" y="368" width="32" height="32" rx="16" fill="#b6d0ff" />
        </g>
        <g>
          <rect x="368" y="112" width="32" height="32" rx="16" fill="#b6d0ff" />
          <rect x="112" y="112" width="32" height="32" rx="16" fill="#b6d0ff" />
        </g>
        <text x="180" y="295" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="80" fill="#4b3cfa">AI</text>
      </g>
    </svg>
  );
}
