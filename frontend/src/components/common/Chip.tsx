
import React from 'react';

export const Chip: React.FC<{ label: string; active?: boolean; onClick?: () => void }> = ({ label, active, onClick }) => (
  <button onClick={onClick} className="px-5 py-2.5 text-sm transition-all whitespace-nowrap"
    style={{
      borderRadius: "var(--r-chip)",
      background: active ? "var(--app-primary)" : "var(--app-white)",
      color: active ? "#fff" : "var(--app-text-primary)",
      border: active ? "1px solid var(--app-primary)" : "1px solid rgba(0,0,0,0.06)",
      boxShadow: active ? "0 4px 16px rgba(0,0,0,0.06)" : "0 2px 8px rgba(0,0,0,0.04)",
      transform: active ? "translateY(-1px)" : undefined,
    }}>
    {label}
  </button>
);
