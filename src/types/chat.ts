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
export type ChatContextType = {
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
