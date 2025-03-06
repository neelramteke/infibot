
import React, { useState } from 'react';
import { Send, Mic, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, loading }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  // Handle sending messages
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
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

  return (
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
        className={`btn-gradient p-2 rounded-full ${
          !message.trim() || loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MessageInput;
