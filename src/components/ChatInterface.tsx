
import React, { useState, useRef, useEffect } from 'react';
import useChat from '@/hooks/useChat';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import ScrollToBottomButton from './chat/ScrollToBottomButton';

const ChatInterface: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    loading, 
    sendMessage, 
    selectCity, 
    selectCategory, 
    selectEvent, 
    bookEvent,
    submitUserInfo
  } = useChat();

  // Handle scroll events from MessageList
  const handleScroll = ({ scrollTop, scrollHeight, clientHeight }: { 
    scrollTop: number; 
    scrollHeight: number; 
    clientHeight: number 
  }) => {
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages container */}
      <MessageList 
        messages={messages}
        loading={loading}
        onSelectCity={selectCity}
        onSelectCategory={selectCategory}
        onSelectEvent={selectEvent}
        onBookEvent={bookEvent}
        onSubmitUserInfo={submitUserInfo}
        onScroll={handleScroll}
      />

      {/* Scroll to bottom button */}
      <ScrollToBottomButton 
        visible={showScrollButton} 
        onClick={scrollToBottom} 
      />

      {/* Message input */}
      <MessageInput 
        onSendMessage={sendMessage}
        loading={loading}
      />
    </div>
  );
};

export default ChatInterface;
