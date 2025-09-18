
import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket, ReadyState, WebSocketMessage } from '../hooks/useWebSocket';

interface ChatProps {
  token: string | null;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  sources?: any[];
}

export const Chat: React.FC<ChatProps> = ({ token }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const wsUrl = token ? `ws://localhost:8000/ws/chat?token=${token}` : null;
  const { lastMessage, readyState, sendMessage } = useWebSocket(wsUrl);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessage) {
      setMessages(prevMessages => {
        const last = prevMessages[prevMessages.length - 1];
        if (lastMessage.type === 'chunk' && last && last.sender === 'bot') {
          // Append chunk to the last bot message
          last.text += lastMessage.content || '';
          return [...prevMessages.slice(0, -1), last];
        } else if (lastMessage.type === 'final') {
          // Finalize the bot message with sources
          const finalBotMessage: Message = {
            sender: 'bot',
            text: lastMessage.response || 'No response',
            sources: lastMessage.sources || [],
          };
          return [...prevMessages, finalBotMessage];
        } else if (lastMessage.type === 'chunk') {
            // First chunk
            const newBotMessage: Message = {
                sender: 'bot',
                text: lastMessage.content || '',
            };
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

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting...',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing...',
    [ReadyState.CLOSED]: 'Disconnected',
  }[readyState];

  if (!token) {
    return <div className="chat-window">Please log in to use the chat.</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">Manager Kim <span className="status">({connectionStatus})</span></div>
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
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
