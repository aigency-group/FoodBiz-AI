
import React from 'react';

export const GhostButton: React.FC<React.PropsWithChildren<{ onClick?: () => void; fluid?: boolean }>> = ({
  children, onClick, fluid = true,}) => (<button onClick={onClick}className="text-sm transition-all duration-200"
    style={{
      flex: fluid ? "1 1 auto" : "0 0 auto",padding: "12px 16px",border: "1.5px solid var(--app-primary)",color: "var(--app-primary)",background: "var(--app-light-blue)",borderRadius: 14,boxShadow: "0 2px 8px rgba(0,0,0,0.05)",whiteSpace: "nowrap",
    }}>
    {children}
  </button>
);

export const SolidButton: React.FC<React.PropsWithChildren<{ onClick?: () => void; disabled?: boolean; fluid?: boolean, type?: "button" | "submit" | "reset" }>> = ({
  children, onClick, disabled, fluid = true, type = 'button'
}) => (
  <button type={type} onClick={onClick} disabled={disabled} className="text-sm text-white transition-all duration-200 hover:shadow-md disabled:opacity-50"
    style={{ flex: fluid ? "1 1 auto" : "0 0 auto", padding: "12px 16px", background: "var(--app-primary)", borderRadius: 14,boxShadow: "0 6px 14px rgba(0,85,160,0.24)",whiteSpace: "nowrap", }}>
    {children}
  </button>
);

export const OutlineButton: React.FC<
  React.PropsWithChildren<{ onClick?: () => void; disabled?: boolean }>
> = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="text-sm"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      border: "1.5px solid var(--app-primary)",
      background: "var(--app-light-blue)",
      color: "var(--app-primary)",
      borderRadius: 12,
      whiteSpace: "nowrap",
      opacity: disabled ? 0.6 : 1,
    }}
  >
    {children}
  </button>
);
