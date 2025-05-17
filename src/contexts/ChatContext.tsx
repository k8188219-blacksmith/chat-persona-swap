import React, { createContext, useContext } from 'react';
import { useChatContext } from './useChatContext';

// Create the context with default values
const ChatContext = createContext<ReturnType<typeof useChatContext>>({
  userProfiles: [],
  activeProfile: null,
  switchProfile: () => {},
  createProfile: () => ({ id: '', name: '', avatar: '' }),
  editProfile: () => {},
  deleteProfile: () => {},
  rooms: [],
  activeRoom: null,
  createRoom: async () => ({ id: '', name: '', members: [] }),
  joinRoom: () => false,
  setActiveRoom: () => {},
  messages: [],
  sendMessage: async () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// Create a provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useChatContext();
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
