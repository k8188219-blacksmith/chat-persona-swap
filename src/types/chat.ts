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
  members: string[];
};
