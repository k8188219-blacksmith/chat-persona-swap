
import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "../contexts/ChatContext";

const MessageList = () => {
  const { messages, activeRoom, activeProfile } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Filter messages for active room
  const roomMessages = messages.filter(
    (message) => message.roomId === activeRoom?.id
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages.length]);

  return (
    <ScrollArea className="h-[calc(100vh-10rem)] p-4" ref={scrollAreaRef}>
      <div className="flex flex-col space-y-4">
        {roomMessages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          roomMessages.map((message) => {
            const isCurrentUser = message.senderId === activeProfile?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} animate-slide-in`}
              >
                {!isCurrentUser && (
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-col max-w-[70%]">
                  {!isCurrentUser && (
                    <span className="text-xs text-muted-foreground mb-1">
                      {message.senderName}
                    </span>
                  )}
                  <div
                    className={`message-bubble ${
                      isCurrentUser ? "message-bubble-user" : "message-bubble-other"
                    }`}
                  >
                    {message.text}
                    {message.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={message.imageUrl}
                          alt="Shared image"
                          className="max-w-full rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 self-end">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                {isCurrentUser && (
                  <div className="flex-shrink-0 ml-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
