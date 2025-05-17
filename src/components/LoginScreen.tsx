import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChat } from '../contexts';
import { fileToBase64, validateImageFile } from '../utils/fileUtils';
import { toast } from '@/components/ui/use-toast';
import { Sun, Moon, User, Upload } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';

const LoginScreen: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useChat();
  const { signIn } = useAuthActions();
  const [username, setUsername] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    if (!validateImageFile(file)) {
      toast({
        title: 'Invalid file',
        description:
          'Please upload an image file (JPEG, PNG, GIF) less than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setAvatarPreview(base64);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process the image.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    signIn('anonymous');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Chat App</CardTitle>
          <CardDescription>
            Sign in anonymously to start chatting
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-primary mb-4">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Image (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => document.getElementById('avatar')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Avatar
                </Button>
              </div>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username (Optional)</Label>
              <Input
                id="username"
                placeholder="Enter username or stay anonymous"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In Anonymously'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginScreen;
