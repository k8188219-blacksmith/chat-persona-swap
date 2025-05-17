import React, { createContext } from 'react';
import { ChatContextType } from '../types/chat';

// Create the context with default values
export const ChatContext = createContext<ChatContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  userProfiles: [],
  activeProfile: null,
  switchProfile: () => {},
  createProfile: () => ({ id: '', name: '', avatar: '' }),
  editProfile: () => {},
  deleteProfile: () => {},
  rooms: [],
  activeRoom: null,
  createRoom: () => ({ id: '', name: '', createdBy: '', members: [] }),
  joinRoom: () => false,
  setActiveRoom: () => {},
  messages: [],
  sendMessage: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// Re-export components for backwards compatibility
export { ChatProvider } from './ChatProvider';
export { useChat } from '../hooks/useChat';
export type { UserProfile, Message, Room } from '../types/chat';
