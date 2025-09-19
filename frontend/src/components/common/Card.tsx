
import React from 'react';

export const Card: React.FC<React.PropsWithChildren<{ 
  style?: React.CSSProperties;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}>> = ({ children, style, onClick, onMouseEnter, onMouseLeave }) => (
  <div 
    className="bg-white p-5" 
    style={{ borderRadius: "var(--r-card)", boxShadow: "var(--elev-1)", border: "1px solid rgba(0,0,0,0.04)", ...style }}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </div>
);
