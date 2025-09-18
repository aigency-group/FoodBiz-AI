
import React, { useState } from 'react';
import { useEventSource } from '../hooks/useEventSource';
import { Bell, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const Alerts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sseUrl = `${API_URL}/alerts/sse`;
  const { data: alerts } = useEventSource(sseUrl);

  return (
    <div className="alerts-container">
      <button onClick={() => setIsOpen(!isOpen)} className="alerts-bell-button">
        <Bell size={24} />
        {alerts.length > 0 && <span className="alerts-dot"></span>}
      </button>
      {isOpen && (
        <div className="alerts-dropdown">
          <div className="alerts-header">Notifications</div>
          <div className="alerts-list">
            {alerts.length === 0 ? (
              <div className="no-alerts">No new notifications</div>
            ) : (
              alerts.map((alert, index) => (
                <div key={index} className="alert-item">
                  <CheckCircle size={16} className="alert-icon" />
                  <p>{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
