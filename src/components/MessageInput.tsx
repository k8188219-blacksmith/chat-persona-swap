import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '../contexts/ChatContext';
import { fileToBase64, validateImageFile } from '../utils/fileUtils';
import { toast } from '@/components/ui/use-toast';
import { Send, Image, X } from 'lucide-react';

const MessageInput = () => {
  const { sendMessage, activeRoom } = useChat();
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if ((!message.trim() && !imagePreview) || !activeRoom) return;

    sendMessage(message, imagePreview || undefined);
    setMessage('');
    setImagePreview(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    if (!validateImageFile(file)) {
      toast({
        title: 'Invalid file',
        description:
          'Please upload an image file (JPEG, PNG, GIF) less than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process the image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!activeRoom) return null;

  return (
    <div className="p-4 border-t">
      {imagePreview && (
        <div className="mb-2 relative">
          <div className="max-h-32 overflow-hidden rounded-md relative">
            <img
              src={imagePreview}
              alt="Upload preview"
              className="max-h-32 object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={clearImagePreview}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="shrink-0"
        >
          <Image className="h-5 w-5" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isUploading}
          className="flex-1"
        />

        <Button
          type="button"
          size="icon"
          onClick={handleSendMessage}
          disabled={(!message.trim() && !imagePreview) || isUploading}
          className="shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
