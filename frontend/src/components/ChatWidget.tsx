
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useWebSocket, ReadyState } from '../hooks/useWebSocket';
import { Send, MessageSquare, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const WS_URL = API_URL.replace(/^http/, 'ws');

interface Message {
  sender: 'user' | 'bot';
  text: string;
  sources?: any[];
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
        setMessages(prevMessages => {
            const last = prevMessages[prevMessages.length - 1];
            if (lastMessage.type === 'chunk' && last && last.sender === 'bot' && lastMessage.content) {
                // Append chunk to the last bot message
                last.text += lastMessage.content;
                return [...prevMessages.slice(0, -1), last];
            } else if (lastMessage.type === 'final' && lastMessage.response) {
                // Replace the last message (which was streaming) with the final one
                const finalMessage: Message = {
                    sender: 'bot',
                    text: lastMessage.response,
                    sources: lastMessage.sources || [],
                };
                // Check if the last message was a bot message to replace it
                if(last && last.sender === 'bot') {
                    return [...prevMessages.slice(0, -1), finalMessage];
                } else {
                    return [...prevMessages, finalMessage];
                }
            } else if (lastMessage.type === 'chunk' && lastMessage.content) {
                // This is the first chunk
                const newBotMessage: Message = { sender: 'bot', text: lastMessage.content };
                return [...prevMessages, newBotMessage];
            }
            return prevMessages;
        });
    }
  }, [lastMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            {msg.sources && msg.sources.length > 0 && (
              <div className="sources">
                <strong>Sources:</strong>
                <ul>
                  {msg.sources.map((source, i) => (
                    <li key={i}>{source.source_name}</li>
                  ))}
                </ul>
              </div>
            )}
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
