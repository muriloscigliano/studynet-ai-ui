import React, { useState, useEffect, useRef } from 'react';
import ChatComposer from './ChatComposer';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

type ChatInterfaceProps = {
  suggestions: string[];
  onFirstMessage?: () => void;
};

export default function ChatInterface({ suggestions, onFirstMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasStartedChat = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Trigger first message callback to hide hero content
    if (messages.length === 0) {
      if (onFirstMessage) {
        onFirstMessage();
      }
      // Dispatch custom event for index.astro to listen to
      document.dispatchEvent(new CustomEvent('chat:firstMessage'));
    }

    setIsLoading(true);

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a placeholder response. The AI API will be integrated here later.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleChipClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div className="chat-interface">
      {hasStartedChat && (
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}
            >
              <div className="chat-message-content">
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message chat-message-assistant">
              <div className="chat-message-content">
                <div className="chat-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {!hasStartedChat && (
        <div className="chat-suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="chip"
              onClick={() => handleChipClick(suggestion)}
            >
              <span>{suggestion}</span>
              <span className="chip-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="chat-composer-container">
        <ChatComposer onSend={handleSend} />
      </div>
    </div>
  );
}

