
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Define the user profile type
export type UserProfile = {
  id: string;
  name: string;
  avatar: string;
  color?: string;
};

// Define a message type
export type Message = {
  id: string;
  roomId: string;
  text: string;
  imageUrl?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: number;
};

// Define a room type
export type Room = {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
};

// Define the context type
type ChatContextType = {
  isLoggedIn: boolean;
  login: (initialProfile: Partial<UserProfile>) => void;
  logout: () => void;
  userProfiles: UserProfile[];
  activeProfile: UserProfile | null;
  switchProfile: (profileId: string) => void;
  createProfile: (profile: Partial<UserProfile>) => UserProfile;
  editProfile: (id: string, profile: Partial<UserProfile>) => void;
  deleteProfile: (id: string) => void;
  rooms: Room[];
  activeRoom: Room | null;
  createRoom: (name: string) => Room;
  joinRoom: (roomId: string) => boolean;
  setActiveRoom: (roomId: string) => void;
  messages: Message[];
  sendMessage: (text: string, imageUrl?: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

// Create the context with default values
const ChatContext = createContext<ChatContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  userProfiles: [],
  activeProfile: null,
  switchProfile: () => {},
  createProfile: () => ({ id: "", name: "", avatar: "" }),
  editProfile: () => {},
  deleteProfile: () => {},
  rooms: [],
  activeRoom: null,
  createRoom: () => ({ id: "", name: "", createdBy: "", members: [] }),
  joinRoom: () => false,
  setActiveRoom: () => {},
  messages: [],
  sendMessage: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// Generate random avatar URL
const getRandomAvatar = () => {
  const avatars = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Max",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie",
  ];
  return avatars[Math.floor(Math.random() * avatars.length)];
};

// Create a provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // App state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Initialize dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Login function
  const login = (initialProfile: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      id: uuidv4(),
      name: initialProfile.name || "Anonymous",
      avatar: initialProfile.avatar || getRandomAvatar(),
      color: initialProfile.color || "#6366f1",
    };

    setUserProfiles([newProfile]);
    setActiveProfile(newProfile);
    setIsLoggedIn(true);

    // Create a default room only after setting the active profile
    const defaultRoom = createRoom("General");
    setActiveRoom(defaultRoom);

    // Simulate welcome message
    const welcomeMessage: Message = {
      id: uuidv4(),
      roomId: defaultRoom.id,
      text: `Welcome to the chat, ${newProfile.name}!`,
      senderId: "system",
      senderName: "ChatApp",
      senderAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ChatApp",
      timestamp: Date.now(),
    };

    setMessages([welcomeMessage]);
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    setActiveProfile(null);
    setUserProfiles([]);
    setActiveRoom(null);
    setRooms([]);
    setMessages([]);
  };

  // Switch active profile
  const switchProfile = (profileId: string) => {
    const profile = userProfiles.find((p) => p.id === profileId);
    if (profile) {
      setActiveProfile(profile);
    }
  };

  // Create a new profile
  const createProfile = (profile: Partial<UserProfile>): UserProfile => {
    const newProfile: UserProfile = {
      id: uuidv4(),
      name: profile.name || "Anonymous",
      avatar: profile.avatar || getRandomAvatar(),
      color: profile.color || "#6366f1",
    };

    setUserProfiles((prev) => [...prev, newProfile]);
    return newProfile;
  };

  // Edit a profile
  const editProfile = (id: string, profile: Partial<UserProfile>) => {
    setUserProfiles((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...profile } : p
      )
    );

    if (activeProfile?.id === id) {
      setActiveProfile((prev) => prev ? { ...prev, ...profile } : null);
    }
  };

  // Delete a profile
  const deleteProfile = (id: string) => {
    // Don't delete if it's the only profile
    if (userProfiles.length <= 1) return;

    setUserProfiles((prev) => prev.filter((p) => p.id !== id));
    
    // If active profile is deleted, switch to another one
    if (activeProfile?.id === id) {
      const newActiveProfile = userProfiles.find((p) => p.id !== id);
      if (newActiveProfile) {
        setActiveProfile(newActiveProfile);
      }
    }
  };

  // Create a new room
  const createRoom = (name: string): Room => {
    if (!activeProfile) throw new Error("No active profile");
    
    const newRoom: Room = {
      id: uuidv4(),
      name,
      createdBy: activeProfile.id,
      members: [activeProfile.id],
    };

    setRooms((prev) => [...prev, newRoom]);
    return newRoom;
  };

  // Join a room
  const joinRoom = (roomId: string): boolean => {
    if (!activeProfile) return false;

    const roomExists = rooms.some((room) => room.id === roomId);
    
    if (!roomExists) {
      // Create the room if it doesn't exist (for direct link joins)
      const newRoom: Room = {
        id: roomId,
        name: `Room ${roomId.substring(0, 5)}`,
        createdBy: "unknown",
        members: [activeProfile.id],
      };
      setRooms((prev) => [...prev, newRoom]);
      setActiveRoom(newRoom);
      return true;
    }

    // Add member to room if not already a member
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId && !room.members.includes(activeProfile.id)
          ? { ...room, members: [...room.members, activeProfile.id] }
          : room
      )
    );

    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setActiveRoom(room);
      return true;
    }
    return false;
  };

  // Set active room
  const setActiveRoomById = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setActiveRoom(room);
    }
  };

  // Send a message
  const sendMessage = (text: string, imageUrl?: string) => {
    if (!activeProfile || !activeRoom) return;

    const newMessage: Message = {
      id: uuidv4(),
      roomId: activeRoom.id,
      text,
      imageUrl,
      senderId: activeProfile.id,
      senderName: activeProfile.name,
      senderAvatar: activeProfile.avatar,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <ChatContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        userProfiles,
        activeProfile,
        switchProfile,
        createProfile,
        editProfile,
        deleteProfile,
        rooms,
        activeRoom,
        createRoom,
        joinRoom,
        setActiveRoom: setActiveRoomById,
        messages,
        sendMessage,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Create a custom hook to use the chat context
export const useChat = () => useContext(ChatContext);
