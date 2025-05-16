
import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';

// Create a custom hook to use the chat context
export const useChat = () => useContext(ChatContext);
