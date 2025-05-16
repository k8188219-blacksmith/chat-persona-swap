
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserProfile, useChat } from "../contexts/ChatContext";
import { fileToBase64, validateImageFile } from "../utils/fileUtils";
import { toast } from "@/components/ui/use-toast";
import { User, Upload, Trash } from "lucide-react";

interface ProfileModalProps {
  profile?: UserProfile;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ 
  profile, 
  isOpen, 
  onOpenChange 
}) => {
  const { createProfile, editProfile, deleteProfile, switchProfile } = useChat();
  const [name, setName] = useState(profile?.name || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a profile name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (profile) {
        // Edit existing profile
        editProfile(profile.id, {
          name: name.trim(),
          avatar: avatarPreview || undefined,
        });
      } else {
        // Create new profile
        const newProfile = createProfile({
          name: name.trim(),
          avatar: avatarPreview || undefined,
        });
        switchProfile(newProfile.id);
      }
      
      onOpenChange(false);
      toast({
        title: profile ? "Profile updated" : "Profile created",
        description: profile 
          ? "Your profile has been updated successfully" 
          : "Your new profile has been created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (!validateImageFile(file)) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPEG, PNG, GIF) less than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const base64 = await fileToBase64(file);
      setAvatarPreview(base64);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the image.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (!profile) return;
    
    if (confirm("Are you sure you want to delete this profile?")) {
      deleteProfile(profile.id);
      onOpenChange(false);
      toast({
        title: "Profile deleted",
        description: "The profile has been deleted",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{profile ? "Edit Profile" : "Create New Profile"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-primary mb-4 relative group">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Avatar preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            <div 
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
              onClick={() => document.getElementById("avatar-upload")?.click()}
            >
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div className="space-y-2">
            <Label htmlFor="profile-name">Profile Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter profile name"
            />
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between">
          <div>
            {profile && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                type="button"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              type="button"
            >
              {isSubmitting ? "Saving..." : profile ? "Update" : "Create"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
