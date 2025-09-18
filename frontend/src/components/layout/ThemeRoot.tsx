
import React from 'react';

/* ------- ThemeRoot (전역 폰트/톤) ------- */
export const ThemeRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const vars: React.CSSProperties = {
    ["--app-primary" as any]: "#1E4F9E",
    ["--app-light-blue" as any]: "#E3EEFF",
    ["--app-text-primary" as any]: "#123B70",
    ["--app-text-secondary" as any]: "#42526E",
    ["--app-background" as any]: "#E7F2FF",
    ["--app-white" as any]: "#FFFFFF",
    ["--accent-green" as any]: "#2AA5A0",
    ["--accent-yellow" as any]: "#F5A45A",
    ["--accent-red" as any]: "#C63A3A",
    ["--elev-1" as any]: "0 4px 16px rgba(0,0,0,0.06)",
    ["--r-card" as any]: "20px",
    ["--r-chip" as any]: "999px",
    ["--fs-h2" as any]: "16px",
    ["--fs-body" as any]: "14px",
    ["--charts-primary" as any]: "var(--app-primary)",
    ["--charts-secondary" as any]: "#6FADE8",
    ["--charts-accent" as any]: "var(--accent-yellow)",
  };
  const font =
    '"Pretendard","Noto Sans KR","Inter","Apple SD Gothic Neo",system-ui,-apple-system,sans-serif';
  return (
    <div style={{ ...vars, fontFamily: font as any, color: "var(--app-text-primary)", background: "var(--app-background)", width: "100%", height: "100%" }}>
      {children}
    </div>
  );
};
