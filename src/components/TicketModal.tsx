
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Eye, X } from 'lucide-react';
import { toast } from 'sonner';

interface TicketModalProps {
  ticketPdfUrl: string;
}

const TicketModal: React.FC<TicketModalProps> = ({ ticketPdfUrl }) => {
  const [showFullSize, setShowFullSize] = useState(false);
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = ticketPdfUrl;
    link.download = 'event-ticket.pdf';
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
          url: ticketPdfUrl,
        });
        toast.success('Ticket shared successfully');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(ticketPdfUrl);
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
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 mb-3 text-center">
            <p className="text-sm text-muted-foreground">Your e-ticket has been generated as a PDF</p>
          </div>
          
          <div className="aspect-[3/4] bg-white/90 dark:bg-slate-900/90 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <object
              data={ticketPdfUrl}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="flex flex-col items-center justify-center h-full p-4">
                <p className="text-center text-muted-foreground mb-2">PDF preview not available</p>
                <button
                  onClick={() => setShowFullSize(true)}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View PDF
                </button>
              </div>
            </object>
          </div>
          
          <div className="flex justify-between mt-4">
            <button
              onClick={handleDownload}
              className="btn-gradient-secondary text-sm flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            
            <button
              onClick={handleShare}
              className="btn-gradient text-sm flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share Ticket
            </button>
          </div>
        </div>
      </motion.div>
      
      {showFullSize && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullSize(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">E-Ticket Preview</h3>
              <button
                onClick={() => setShowFullSize(false)}
                className="p-1 rounded-full hover:bg-secondary/80"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="h-[70vh] overflow-hidden">
              <iframe
                src={ticketPdfUrl}
                className="w-full h-full"
                title="Ticket PDF"
              />
            </div>
            
            <div className="flex justify-center gap-4 p-4 border-t">
              <button
                onClick={handleDownload}
                className="btn-gradient-secondary text-sm flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              
              <button
                onClick={handleShare}
                className="btn-gradient text-sm flex items-center gap-1"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TicketModal;
