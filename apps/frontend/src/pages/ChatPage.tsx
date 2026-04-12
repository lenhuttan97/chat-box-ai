import { ChatLayout } from "../components/layout/ChatLayout";
import { ChatWindow } from "../components/chat/ChatWindow";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import { useEffect } from "react";

const ChatPage = () => {
  const { isAuthenticated, initialize, user } = useAuth();
  const { loadUser, currentUser, logout } = useUser();

  const initAuth = async () => {
    await initialize();
    if (isAuthenticated && (currentUser == null || currentUser?.email != user?.email)) {
      loadUser();
    }

    if (!isAuthenticated){
      logout()
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <ChatLayout>
      <ChatWindow />
    </ChatLayout>
  );
};

export default ChatPage;
