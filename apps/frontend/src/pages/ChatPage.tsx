import { ChatLayout } from "../components/layout/ChatLayout";
import { ChatWindow } from "../components/chat/ChatWindow";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const ChatPage = () => {
  const { initialize } = useAuth();
  // initialize()

  useEffect(() => {
    console.log("MOUNT");
    initialize();
  }, []);

  return (
    <ChatLayout>
      <ChatWindow />
    </ChatLayout>
  );
};

export default ChatPage;
