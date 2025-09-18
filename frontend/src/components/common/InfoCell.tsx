
import React from 'react';

export const InfoCell: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ textAlign: "center" }}>
    <p style={{ fontSize: 12, color: "var(--app-text-secondary)" }}>{label}</p>
    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--app-primary)" }}>{value}</p>
  </div>
);
