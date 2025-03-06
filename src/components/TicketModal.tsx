
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface TicketModalProps {
  ticketImage: string;
}

const TicketModal: React.FC<TicketModalProps> = ({ ticketImage }) => {
  const [showFullSize, setShowFullSize] = useState(false);
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = ticketImage;
    link.download = 'event-ticket.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Ticket downloaded successfully');
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Event Ticket',
          text: 'Check out my event ticket!',
          url: ticketImage,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(ticketImage);
        toast.success('Ticket URL copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share ticket');
    }
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel rounded-xl overflow-hidden shadow-lg"
      >
        <div className="p-4">
          <div 
            className="cursor-pointer" 
            onClick={() => setShowFullSize(true)}
          >
            <img 
              src={ticketImage} 
              alt="Event Ticket" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <button
              onClick={handleDownload}
              className="btn-secondary text-sm flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            
            <button
              onClick={handleShare}
              className="btn-primary text-sm flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </motion.div>
      
      {showFullSize && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullSize(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={ticketImage} 
              alt="Event Ticket" 
              className="w-full h-auto rounded-lg"
            />
            
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleDownload}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              
              <button
                onClick={handleShare}
                className="btn-primary text-sm flex items-center gap-1"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              
              <button
                onClick={() => setShowFullSize(false)}
                className="btn-ghost text-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TicketModal;
