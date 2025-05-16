import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useChat } from "../contexts/ChatContext";
import { Plus, Link } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
const ChatSidebar = () => {
  const {
    rooms,
    activeRoom,
    createRoom,
    setActiveRoom,
    joinRoom
  } = useChat();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    const room = createRoom(newRoomName.trim());
    setActiveRoom(room.id);
    setNewRoomName("");
    setIsCreateDialogOpen(false);
    toast({
      title: "Room created",
      description: `You've created the room "${room.name}"`
    });
  };
  const handleJoinRoom = () => {
    if (!roomId.trim()) return;
    const success = joinRoom(roomId.trim());
    if (success) {
      setRoomId("");
      setIsJoinDialogOpen(false);
      toast({
        title: "Room joined",
        description: "You've successfully joined the room"
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to join the room",
        variant: "destructive"
      });
    }
  };
  const handleShareRoom = (roomId: string) => {
    const url = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Room link has been copied to clipboard"
    });
  };
  return <div className="w-64 border-r h-full flex flex-col bg-card">
      <div className="p-4 flex flex-col gap-2">
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-violet-500 hover:bg-violet-400">
          <Plus className="mr-2 h-4 w-4" /> New Room
        </Button>
        <Button variant="outline" onClick={() => setIsJoinDialogOpen(true)}>
          <Link className="mr-2 h-4 w-4" /> Join Room
        </Button>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {rooms.length > 0 ? rooms.map(room => <div key={room.id} className={`p-2 rounded-md mb-1 cursor-pointer flex justify-between items-center group ${activeRoom?.id === room.id ? "bg-primary/10" : "hover:bg-accent"}`} onClick={() => setActiveRoom(room.id)}>
                <div className="truncate">{room.name}</div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8" onClick={e => {
            e.stopPropagation();
            handleShareRoom(room.id);
          }}>
                  <Link className="h-4 w-4" />
                </Button>
              </div>) : <div className="text-center py-4 text-muted-foreground">
              No rooms available
            </div>}
        </div>
      </ScrollArea>

      {/* Create Room Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Room</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Room name" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRoom}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Room Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Room</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Room ID or link" value={roomId} onChange={e => {
            // Extract ID from URL if pasted
            const input = e.target.value;
            if (input.includes("?room=")) {
              const id = input.split("?room=")[1].split("&")[0];
              setRoomId(id);
            } else {
              setRoomId(input);
            }
          }} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleJoinRoom}>Join</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default ChatSidebar;