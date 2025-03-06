
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import useChat from '@/hooks/useChat';
import ChatMessage from './ChatMessage';

const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { 
    messages, 
    loading, 
    sendMessage, 
    selectCity, 
    selectCategory, 
    selectEvent, 
    bookEvent 
  } = useChat();

  // Handle sending messages
  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
    }
  };

  // Handle pressing Enter to send messages
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Start voice recording
  const startRecording = () => {
    // In a real implementation, we would use the Web Speech API
    setIsRecording(true);
    toast({
      title: "Voice recording",
      description: "Voice recording is not implemented in this demo.",
    });
    
    // Simulate ending the recording after 3 seconds
    setTimeout(() => {
      setIsRecording(false);
    }, 3000);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show scroll button when user scrolls up
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to bottom
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b border-border bg-white dark:bg-card flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <span className="text-sm font-semibold">AI</span>
          </div>
          <div>
            <h2 className="font-semibold">Event Booking Assistant</h2>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50"
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSelectCity={selectCity}
            onSelectCategory={selectCategory}
            onSelectEvent={selectEvent}
            onSubmitUserInfo={bookEvent}
          />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-center space-x-2 p-2 w-fit">
            <motion.div
              animate={{ scale: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            <motion.div
              animate={{ scale: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            <motion.div
              animate={{ scale: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          </div>
        )}

        {/* Reference for scrolling to the bottom */}
        <div ref={messageEndRef} />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-20 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Message input */}
      <div className="p-4 border-t border-border bg-white dark:bg-card flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="input-primary pr-12"
            disabled={loading}
          />
          <button
            onClick={startRecording}
            disabled={loading || isRecording}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            {isRecording ? (
              <Clock className="h-5 w-5 text-red-500 animate-pulse" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || loading}
          className={`btn-primary p-2 rounded-full ${
            !message.trim() || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
