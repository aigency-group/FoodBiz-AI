
import React, { useState } from 'react';
import { useEventSource } from '../hooks/useEventSource';
import { Bell, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const Alerts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sseUrl = `${API_URL}/alerts/sse`;
  const { data: alerts } = useEventSource(sseUrl);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.2s ease',
        }}
      >
        <Bell size={20} color="#8E8E93" />
        {alerts.length > 0 && (
          <span 
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#FF3B30',
              border: '2px solid #FFFFFF',
            }}
          />
        )}
      </button>
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '280px',
            zIndex: 1000,
          }}
        >
          <div 
            style={{
              padding: '16px 20px 12px',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              fontSize: '16px',
              fontWeight: '600',
              color: '#000000',
            }}
          >
            알림
          </div>
          <div style={{ padding: '12px 0' }}>
            {alerts.length === 0 ? (
              <div 
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#8E8E93',
                  fontSize: '14px',
                }}
              >
                새로운 알림이 없습니다
              </div>
            ) : (
              alerts.map((alert, index) => (
                <div 
                  key={index} 
                  style={{
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderBottom: index < alerts.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  <CheckCircle size={16} color="#10B981" />
                  <p style={{ margin: 0, fontSize: '14px', color: '#000000', lineHeight: '1.4' }}>
                    {alert.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
