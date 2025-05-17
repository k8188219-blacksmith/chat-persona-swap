import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChat } from '../contexts';
import { Sun, Moon, LogOut, Plus } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';

const ChatHeader = () => {
  const { signOut } = useAuthActions();
  const {
    activeRoom,
    activeProfile,
    toggleDarkMode,
    isDarkMode,
    userProfiles,
    switchProfile,
  } = useChat();

  return (
    <header className="border-b bg-card">
      <div className="flex justify-between items-center h-16 px-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold truncate max-w-[200px]">
            {activeRoom?.name || 'Chat'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  {activeProfile?.avatar && (
                    <img
                      src={activeProfile.avatar}
                      alt={activeProfile.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">
                  {activeProfile?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Profiles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userProfiles.map((profile) => (
                <DropdownMenuItem
                  key={profile.id}
                  onClick={() => switchProfile(profile.id)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{profile.name}</span>
                  {activeProfile?.id === profile.id && (
                    <span className="ml-auto text-primary">•</span>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  document.getElementById('profile-modal-trigger')?.click();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
