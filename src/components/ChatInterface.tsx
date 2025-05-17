import { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ProfileModal from './ProfileModal';
import { Button } from '@/components/ui/button';
import { UserProfile, useChat } from '../contexts';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatInterface = () => {
  const { joinRoom } = useChat();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<
    UserProfile | undefined
  >(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Check URL for room ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room');
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-3 left-3 z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar with conditional classes for mobile */}
      <div
        className={`${isMobile ? (isSidebarOpen ? 'fixed inset-y-0 left-0 z-40 w-64' : 'hidden') : 'block'}`}
      >
        <ChatSidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />

        <div className="flex-1 overflow-hidden">
          <MessageList />
        </div>

        <MessageInput />
      </div>

      {/* Hidden button to trigger the profile modal */}
      <button
        id="profile-modal-trigger"
        className="hidden"
        onClick={handleCreateProfile}
      />

      {/* Profile Modal */}
      <ProfileModal
        profile={selectedProfile}
        isOpen={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </div>
  );
};

export default ChatInterface;
