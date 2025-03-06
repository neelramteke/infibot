
import React from 'react';
import { ChatMessage as MessageType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import UserForm from './UserForm';
import TicketModal from './TicketModal';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: MessageType;
  onSelectCity: (city: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectEvent: (event: string) => void;
  onSubmitUserInfo: (userInfo: any) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSelectCity,
  onSelectCategory,
  onSelectEvent,
  onSubmitUserInfo,
}) => {
  const isUser = message.role === 'user';

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
            <AvatarImage src="/placeholder.svg" alt="Bot" />
            <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
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
                  className="btn-secondary text-sm"
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
                  className="btn-secondary text-sm"
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
            />
          </div>
        )}

        {/* User form */}
        {message.type === 'userForm' && (
          <div className="space-y-4">
            <div className="whitespace-pre-wrap">{message.content}</div>
            <UserForm onSubmit={onSubmitUserInfo} />
          </div>
        )}

        {/* Ticket */}
        {message.type === 'ticket' && message.ticketImage && (
          <div className="space-y-4">
            <div className="whitespace-pre-wrap">{message.content}</div>
            <TicketModal ticketImage={message.ticketImage} />
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
