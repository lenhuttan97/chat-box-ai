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
    <ChatWindow />
  );
};

export default ChatPage;
