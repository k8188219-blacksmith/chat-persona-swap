import LoginScreen from '../components/LoginScreen';
import ChatInterface from '../components/ChatInterface';
import { Authenticated, Unauthenticated } from 'convex/react';

const Index = () => {

  return (
    <>
      <Authenticated>
        <ChatInterface />
      </Authenticated>
      <Unauthenticated>
        <LoginScreen />
      </Unauthenticated>
    </>
  );
};

export default Index;
