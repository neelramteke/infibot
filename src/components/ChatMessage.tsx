
import React, { useState } from 'react';
import { ChatMessage as MessageType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import UserForm from './UserForm';
import TicketModal from './TicketModal';
import { cn } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';

interface ChatMessageProps {
  message: MessageType;
  onSelectCity: (city: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectEvent: (event: string) => void;
  onBookEvent: (eventId: string) => void;
  onSubmitUserInfo: (userInfo: any) => void;
  onSelectTicketQuantity?: (eventId: string, quantity: number) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSelectCity,
  onSelectCategory,
  onSelectEvent,
  onBookEvent,
  onSubmitUserInfo,
  onSelectTicketQuantity,
}) => {
  const isUser = message.role === 'user';
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(10, value));
    setQuantity(newQuantity);
  };

  const calculateTotalAmount = (price: string, qty: number) => {
    const priceValue = parseInt(price.replace(/[^\d]/g, ''));
    return `₹${priceValue * qty}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="mr-2 flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/bot-avatar.svg" alt="Bot" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="50" fill="#5E35B1"/>
                <path d="M30 40C30 34.4772 34.4772 30 40 30H60C65.5228 30 70 34.4772 70 40V60C70 65.5228 65.5228 70 60 70H40C34.4772 70 30 65.5228 30 60V40Z" fill="#D1C4E9"/>
                <circle cx="40" cy="45" r="5" fill="#311B92"/>
                <circle cx="60" cy="45" r="5" fill="#311B92"/>
                <path d="M37.5 60C37.5 60 40 65 50 65C60 65 62.5 60 62.5 60" stroke="#311B92" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%]',
          isUser ? 'chat-bubble-user' : 'chat-bubble-bot'
        )}
      >
        {/* Regular text message */}
        {(!message.type || message.type === 'text') && (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}

        {/* City selection */}
        {message.type === 'citySelection' && message.options && (
          <div className="space-y-3">
            <div className="whitespace-pre-wrap">{message.content}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {message.options.map((city) => (
                <button
                  key={city}
                  onClick={() => onSelectCity(city)}
                  className="btn-gradient-secondary text-sm"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category selection */}
        {message.type === 'categorySelection' && message.options && (
          <div className="space-y-3">
            <div className="whitespace-pre-wrap">{message.content}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {message.options.map((category) => (
                <button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  className="btn-gradient-secondary text-sm"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Event selection */}
        {message.type === 'eventSelection' && message.events && (
          <div className="space-y-4">
            <div className="whitespace-pre-wrap">{message.content}</div>
            <div className="flex flex-col space-y-3 mt-2">
              {message.events.map((event) => (
                <EventCard 
                  key={event.id}
                  event={event}
                  onClick={() => onSelectEvent(event.name)}
                  compact
                />
              ))}
            </div>
          </div>
        )}

        {/* Event info */}
        {message.type === 'eventInfo' && message.selectedEvent && (
          <div className="space-y-4">
            <div className="whitespace-pre-wrap">{message.content}</div>
            <EventCard 
              event={message.selectedEvent}
              showDetails
              showBookButton
              onClick={() => {}}
              onBookClick={() => onBookEvent(message.selectedEvent?.id || '')}
            />
          </div>
        )}

        {/* Ticket quantity selection */}
        {message.type === 'ticketQuantity' && message.selectedEvent && (
          <div className="space-y-4">
            <div className="whitespace-pre-wrap">{message.content}</div>
            <div className="mt-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-border">
              <h3 className="font-medium text-sm mb-3">{message.selectedEvent.name}</h3>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">Ticket Price:</span>
                <span className="font-medium">{message.selectedEvent.price}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4 border-t border-border pt-3">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold text-primary">{calculateTotalAmount(message.selectedEvent.price, quantity)}</span>
              </div>
              
              <button 
                onClick={() => onSelectTicketQuantity?.(message.selectedEvent?.id || '', quantity)}
                className="w-full btn-gradient"
              >
                Continue to Booking
              </button>
            </div>
          </div>
        )}

        {/* User form */}
        {message.type === 'userForm' && message.selectedEvent && (
          <div className="space-y-4">
            <div className="whitespace-pre-wrap">{message.content}</div>
            <UserForm 
              onSubmit={(userInfo) => onSubmitUserInfo(userInfo)} 
              eventId={message.selectedEvent.id} 
              quantity={message.ticketQuantity || 1}
              totalAmount={message.totalAmount || message.selectedEvent.price}
            />
          </div>
        )}

        {/* Ticket */}
        {message.type === 'ticket' && message.ticketPdfUrl && (
          <div className="space-y-4">
            <div className="whitespace-pre-wrap">{message.content}</div>
            <TicketModal ticketPdfUrl={message.ticketPdfUrl} />
          </div>
        )}
      </div>

      {isUser && (
        <div className="ml-2 flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="You" />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              You
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
