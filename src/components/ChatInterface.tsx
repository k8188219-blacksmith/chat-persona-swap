import React, { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ProfileModal from "./ProfileModal";
import { Button } from "@/components/ui/button";
import { UserProfile, useChat } from "../contexts/ChatContext";
import { Plus, User } from "lucide-react";
const ChatInterface = () => {
  const {
    userProfiles,
    joinRoom
  } = useChat();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined);

  // Check URL for room ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get("room");
    if (roomId) {
      joinRoom(roomId);
    }
  }, [joinRoom]);
  const handleCreateProfile = () => {
    setSelectedProfile(undefined);
    setIsProfileModalOpen(true);
  };
  const handleEditProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setIsProfileModalOpen(true);
  };
  return <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        
        <div className="flex-1 overflow-hidden">
          <MessageList />
        </div>
        
        <MessageInput />
      </div>

      {/* Floating button for creating profiles */}
      <Button onClick={handleCreateProfile} className="fixed bottom-20 right-4 rounded-full w-12 h-12 shadow-lg bg-violet-500 hover:bg-violet-400">
        <Plus className="h-5 w-5" />
      </Button>

      {/* Profile Modal */}
      <ProfileModal profile={selectedProfile} isOpen={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} />
    </div>;
};
export default ChatInterface;