
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

  // Handle cursor gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const body = document.body;
      
      if (!body.classList.contains('cursor-effect-active')) {
        body.classList.add('cursor-effect-active');
      }
      
      // Set the position of the gradient
      body.style.setProperty('--cursor-x', `${e.clientX}px`);
      body.style.setProperty('--cursor-y', `${e.clientY}px`);
      
      // Update the gradient position
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          const x = e.clientX;
          const y = e.clientY;
          body.style.setProperty('--x', `${x}px`);
          body.style.setProperty('--y', `${y}px`);
          document.documentElement.style.setProperty('--mouse-x', `${x}px`);
          document.documentElement.style.setProperty('--mouse-y', `${y}px`);
          document.body.style.setProperty('--before-left', `${x}px`);
          document.body.style.setProperty('--before-top', `${y}px`);
        });
      } else {
        const x = e.clientX;
        const y = e.clientY;
        body.style.setProperty('--x', `${x}px`);
        body.style.setProperty('--y', `${y}px`);
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        document.body.style.setProperty('--before-left', `${x}px`);
        document.body.style.setProperty('--before-top', `${y}px`);
      }
    };
    
    // Set up event listener for cursor movement
    document.addEventListener('mousemove', handleMouseMove);
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
      
      {/* Reference for scrolling to bottom */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatInterface;
