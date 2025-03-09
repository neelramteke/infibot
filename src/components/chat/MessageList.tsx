
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage as MessageType } from '@/lib/types';
import ChatMessage from '../ChatMessage';

interface MessageListProps {
  messages: MessageType[];
  loading: boolean;
  onSelectCity: (city: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectEvent: (event: string) => void;
  onBookEvent: (eventId: string) => void;
  onSubmitUserInfo: (userInfo: any) => void;
  onSelectTicketQuantity?: (eventId: string, quantity: number) => void;
  onScroll: (scrollPosition: { scrollTop: number; scrollHeight: number; clientHeight: number }) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  onSelectCity,
  onSelectCategory,
  onSelectEvent,
  onBookEvent,
  onSubmitUserInfo,
  onSelectTicketQuantity,
  onScroll,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect scroll for showing scroll button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      onScroll({ scrollTop, scrollHeight, clientHeight });
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50 dark:bg-slate-900"
    >
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          onSelectCity={onSelectCity}
          onSelectCategory={onSelectCategory}
          onSelectEvent={onSelectEvent}
          onBookEvent={onBookEvent}
          onSubmitUserInfo={onSubmitUserInfo}
          onSelectTicketQuantity={onSelectTicketQuantity}
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
  );
};

export default MessageList;
