import { useState, useEffect } from "react";
import { SxProps, Theme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useConversations } from "../../hooks/useConversations";
import { format } from "date-fns";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContrastIcon from "@mui/icons-material/Contrast";
import SettingsIcon from "@mui/icons-material/Settings";
import LoginIcon from "@mui/icons-material/Login";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

interface SidebarProps {
  onNewChat?: () => void;
  className?: string;
  sx?: SxProps<Theme>;
}

export const Sidebar = ({ onNewChat, className = "", sx }: SidebarProps) => {
  const { isAuthenticated } = useAuth();
  const {
    conversations,
    currentConversation,
    loadConversation,
    removeConversation,
    selectConversation,
    loadConversations,
  } = useConversations();
  const navigate = useNavigate();
  const [localConversations, setLocalConversations] = useState(conversations);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations]);

  const handleNewChat = () => {
    selectConversation(null);
    onNewChat?.();
  };

  const handleConversationClick = (id: string) => {
    loadConversation(id);
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeConversation(id);
  };

  return (
    <aside
      className={`hidden md:flex w-[260px] h-full flex-col justify-between bg-surface-2/90 backdrop-blur-2xl border-r border-border-subtle/40 ${className}`}
      style={sx as any}
    >
      <div className="flex-1">
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white">
              <SmartToyIcon sx={{ fontSize: 20 }} />
            </div>
            <div>
              <p className="text-body font-bold text-text-primary leading-tight">
                Premium AI
              </p>
              <p className="text-caption text-text-secondary/70 font-medium tracking-wider">Vercel-inspired workspace</p>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 h-11 rounded-full bg-accent text-white font-semibold text-body shadow-lg shadow-accent-glow hover:brightness-105 transition-all active:scale-95"
          >
            <AddIcon sx={{ fontSize: 20 }} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
          <div className="px-3 py-3">
            <p className="text-caption font-bold uppercase tracking-wider text-text-tertiary/50">
              Recent Chats
            </p>
          </div>

          <div className="space-y-1 px-2">
            {localConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleConversationClick(conv.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all group ${
                  currentConversation?.id === conv.id
                    ? "bg-accent/10 border-l-2 border-accent text-accent"
                    : "hover:bg-surface-3/50"
                }`}
              >
                <ChatBubbleIcon sx={{ fontSize: 16 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium text-text-primary truncate">
                    {conv.name}
                  </p>
                  <p className="text-caption text-text-secondary">
                    {format(new Date(conv.updatedAt), "MMM d, yyyy")}
                  </p>
                </div>
                <span
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-3/50 transition-opacity"
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                >
                  <DeleteIcon
                    sx={{ fontSize: 16, color: "var(--text-secondary)" }}
                  />
                </span>
              </button>
            ))}

            {localConversations.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-caption text-text-secondary/70">
                  No conversations yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-[21.8px] px-4 border-t border-border-subtle/40 flex flex-col gap-2 mt-auto flex-none">
        <button
          onClick={() =>
            window.dispatchEvent(new CustomEvent("open-theme-modal"))
          }
          className="flex items-center gap-3 px-4 py-2 h-10 rounded-lg text-text-secondary hover:bg-surface-3/50 transition-colors w-full"
        >
          <ContrastIcon sx={{ fontSize: 20 }} />
          <span className="text-body font-medium">Theme</span>
        </button>

        {isAuthenticated ? (
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-3 px-4 py-2 h-10 rounded-lg text-text-secondary hover:bg-surface-3/50 transition-colors w-full"
          >
            <SettingsIcon sx={{ fontSize: 20 }} />
            <span className="text-body font-medium">Settings</span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 px-4 py-2 h-10 rounded-lg text-text-secondary hover:bg-surface-3/50 transition-colors w-full"
          >
            <LoginIcon sx={{ fontSize: 20 }} />
            <span className="text-body font-medium">Settings</span>
          </button>
        )}
      </div>
    </aside>
  );
};