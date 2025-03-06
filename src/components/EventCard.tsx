
import React from 'react';
import { Event } from '@/lib/types';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag, IndianRupee } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  compact?: boolean;
  showDetails?: boolean;
  showBookButton?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onClick, 
  compact = false,
  showDetails = false,
  showBookButton = false
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={!showDetails ? onClick : undefined}
      className={`rounded-xl overflow-hidden cursor-pointer bg-card shadow-sm border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300 ${compact ? 'flex gap-3' : 'block'}`}
    >
      <div className={`overflow-hidden ${compact ? 'w-16 h-16' : 'h-40'}`}>
        <img 
          src={event.image || "/placeholder.svg"} 
          alt={event.name}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
        />
      </div>
      
      <div className={`p-3 ${compact ? 'flex-1' : ''}`}>
        <h3 className={`font-semibold text-card-foreground ${compact ? 'text-sm' : 'text-lg mb-2'}`}>
          {event.name}
        </h3>
        
        {!compact && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {event.description}
          </p>
        )}
        
        <div className={`flex flex-wrap gap-2 ${compact ? 'mt-1' : 'mt-3'}`}>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{event.date}</span>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{event.time}</span>
          </div>
          
          {!compact && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{event.venue}</span>
            </div>
          )}
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Tag className="h-3 w-3 mr-1" />
            <span>{event.category}</span>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <IndianRupee className="h-3 w-3 mr-1" />
            <span>{event.price}</span>
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-4 text-sm text-card-foreground">
            <p className="mb-2">{event.description}</p>
            <div className="flex flex-col gap-1 mt-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span>{event.venue}, {event.city}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span>{event.date} at {event.time}</span>
              </div>
              <div className="flex items-center">
                <IndianRupee className="h-4 w-4 mr-2 text-primary" />
                <span>{event.price}</span>
              </div>
            </div>
          </div>
        )}
        
        {showBookButton && (
          <button 
            onClick={onClick}
            className="mt-4 w-full btn-primary flex items-center justify-center gap-2"
          >
            Book Tickets
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
