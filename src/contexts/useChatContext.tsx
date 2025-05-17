import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getRandomAvatar } from '../utils/chatUtils';
import { UserProfile, Room } from '../types/chat';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode
      ? JSON.parse(savedMode)
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Initialize dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return { isDarkMode, toggleDarkMode };
};

const initProfile: UserProfile = {
  id: uuidv4(),
  name: 'Anonymous',
  avatar: getRandomAvatar(),
  color: '#6366f1',
};

const initRoom: Room = {
  id: uuidv4(),
  name: 'General',
  members: [], // not used
};

const useProfile = () => {
  // App state
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([
    initProfile,
  ]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(
    initProfile,
  );

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
      name: profile.name || 'Anonymous',
      avatar: profile.avatar || getRandomAvatar(),
      color: profile.color || '#6366f1',
    };

    setUserProfiles((prev) => [...prev, newProfile]);
    return newProfile;
  };

  // Edit a profile
  const editProfile = (id: string, profile: Partial<UserProfile>) => {
    setUserProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...profile } : p)),
    );

    if (activeProfile?.id === id) {
      setActiveProfile((prev) => (prev ? { ...prev, ...profile } : null));
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
  return {
    userProfiles,
    activeProfile,
    switchProfile,
    createProfile,
    editProfile,
    deleteProfile,
  };
};

const useMessages = (uuid?: string) => {
  const room = useQuery(api.rooms.getRoom, uuid ? { uuid } : 'skip');
  const messages =
    useQuery(
      api.rooms.getRoomMessages,
      room?._id ? { roomId: room._id } : 'skip',
    ) || [];
  const sendMessage = useMutation(api.messages.sendMessage);

  async function handleSendMessage(msg: string, user: string) {
    if (!msg.trim()) return;

    await sendMessage({
      roomId: room._id,
      content: msg,
      sender: user,
      type: 'text',
    });
  }

  return { messages, handleSendMessage };
};

export const useChatContext = () => {
  // App state
  const { activeProfile, ...aaa } = useProfile();
  const dark = useDarkMode();
  const [rooms, setRooms] = useState<Room[]>([initRoom]);
  const [activeRoom, setActiveRoom] = useState<Room>(initRoom);
  const { messages, handleSendMessage } = useMessages(activeRoom?.id);
  const createRoom = useMutation(api.rooms.createRoom);

  // Create a new room
  const handleCreateRoom = async (name: string) => {
    if (!activeProfile) throw new Error('No active profile');
    const { uuid } = await createRoom({});

    const newRoom: Room = {
      id: uuid,
      name,
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
          : room,
      ),
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
  // const sendMessage = (text: string, imageUrl?: string) => {
  //   if (!activeProfile || !activeRoom) return;

  //   const newMessage: Message = {
  //     id: uuidv4(),
  //     roomId: activeRoom.id,
  //     text,
  //     imageUrl,
  //     senderId: activeProfile.id,
  //     senderName: activeProfile.name,
  //     senderAvatar: activeProfile.avatar,
  //     timestamp: Date.now(),
  //   };

  //   setMessages((prev) => [...prev, newMessage]);
  // };

  return {
    activeProfile,
    ...aaa,
    rooms,
    activeRoom,
    createRoom: handleCreateRoom,
    joinRoom,
    setActiveRoom: setActiveRoomById,
    messages,
    sendMessage: handleSendMessage,
    ...dark,
  };
};
