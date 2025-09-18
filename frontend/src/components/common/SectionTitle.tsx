
import React from 'react';

export const SectionTitle: React.FC<React.PropsWithChildren<{ icon?: React.ReactNode }>> = ({ icon, children }) => (
  <div className="flex items-center gap-2">
    {icon}
    <h3 style={{ fontSize: "var(--fs-h2)", fontWeight: 700 }}>{children}</h3>
  </div>
);
