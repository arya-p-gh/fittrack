import { useState, useRef, useEffect } from 'react';
import { ChatStrategy } from '../../application/chat/ChatStrategy';
import { createChatStrategy } from '../../application/chat/createChatStrategy';
import { AppLogger } from '../../application/common/AppLogger';
import { sanitizeChatInput } from '../../application/chat/chatUtils';
import './ChatWindow.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const chatStrategy: ChatStrategy = createChatStrategy();

export const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = sanitizeChatInput(input);
    if (!userMessage) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const aiResponse = await chatStrategy.sendMessage(userMessage);
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      AppLogger.error({
        scope: 'ChatWindow',
        action: 'sendMessage',
        message: 'Failed to send chat message.',
        details: error,
      });
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chat-window ${isOpen ? 'open' : ''}`}>
      <button 
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? '×' : '💬'}
      </button>

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-header-content">
              <h3>TreyniAI</h3>
              <span className="chat-subtitle">Your Fitness Assistant</span>
            </div>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="messages-container">
            {messages.length === 0 && (
              <div className="welcome-message">
                <h4>Welcome to TreyniAI! 👋</h4>
                <p>I'm your personal fitness assistant. Ask me anything about:</p>
                <ul>
                  <li>Workout routines</li>
                  <li>Nutrition advice</li>
                  <li>Exercise form</li>
                  <li>Fitness goals</li>
                </ul>
              </div>
            )}
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role}`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="message assistant loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about fitness..."
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="send-button"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}; 