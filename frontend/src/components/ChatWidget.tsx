
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useWebSocket, ReadyState } from '../hooks/useWebSocket';
import { Send, MessageSquare, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const WS_URL = API_URL.replace(/^http/, 'ws');

interface HybridSource {
  type: 'sql' | 'doc';
  name: string;
  meta?: Record<string, any>;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  sources?: HybridSource[];
}

export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  const bizId = currentUser?.business_id;
  const wsUrl = bizId ? `${WS_URL}/ws/chat?business_id=${encodeURIComponent(bizId)}` : `${WS_URL}/ws/chat`;
  const { lastMessage, readyState, sendMessage } = useWebSocket(isOpen ? wsUrl : null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'error') {
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: lastMessage.detail || '오류가 발생했습니다. 다시 시도해주세요.' },
        ]);
      }

      if (lastMessage.type === 'final') {
        const payload = lastMessage.payload || {
          answer: lastMessage.response,
          sources: lastMessage.sources,
        };
        const finalMessage: Message = {
          sender: 'bot',
          text: payload.answer || '답변을 받지 못했습니다.',
          sources: payload.sources || [],
        };
        setMessages(prev => [...prev, finalMessage]);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderSources = useCallback((sources?: HybridSource[]) => {
    if (!sources?.length) return null;
    return (
      <div className="sources">
        <strong>Sources</strong>
        <ul>
          {sources.map((source, i) => (
            <li key={i}>
              [{source.type === 'sql' ? '데이터' : '문서'}] {source.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }, []);

  const handleSend = () => {
    if (input.trim() && readyState === ReadyState.OPEN) {
      const userMessage: Message = { sender: 'user', text: input };
      setMessages(prev => [...prev, userMessage]);
      sendMessage(JSON.stringify({ query: input }));
      setInput('');
    }
  };

  if (!isOpen) {
    return (
      <button className="chat-fab" onClick={() => setIsOpen(true)}>
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>Manager Kim</h3>
        <button onClick={() => setIsOpen(false)}><X size={18} /></button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
            {renderSources(msg.sources)}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          disabled={readyState !== ReadyState.OPEN}
        />
        <button onClick={handleSend} disabled={readyState !== ReadyState.OPEN}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
