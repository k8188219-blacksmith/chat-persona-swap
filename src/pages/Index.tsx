import { useChat } from '../contexts/ChatContext';
import LoginScreen from '../components/LoginScreen';
import ChatInterface from '../components/ChatInterface';

const Index = () => {
  const { isLoggedIn } = useChat();

  return isLoggedIn ? <ChatInterface /> : <LoginScreen />;
};

export default Index;
