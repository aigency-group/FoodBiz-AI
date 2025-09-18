
import React from 'react';

export const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div style={{ height: 8, background: "#E5E7EB", borderRadius: 999, overflow: "hidden" }}>
    <div className="transition-all" style={{ width: `${value}%`, height: "100%", background: "var(--app-primary)" }} />
  </div>
);
