import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StorageIcon from '@mui/icons-material/Storage';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ sx?: React.CSSProperties }>> = {
  'account_circle': AccountCircleIcon,
  'notifications': NotificationsIcon,
  'palette': PaletteIcon,
  'help': HelpIcon,
  'info': InfoIcon,
  'person': AccountCircleIcon,
  'smart_toy': SmartToyIcon,
  'storage': StorageIcon,
};

const SettingsSection = ({ title, description, icon, children, defaultOpen = false }: SettingsSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-surface-5 backdrop-blur-sm border border-theme rounded-xl overflow-hidden">
      <button
        className="w-full p-4 flex justify-between items-center text-left hover:bg-surface-3/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[color:var(--accent-primary)]/10 flex items-center justify-center text-[color:var(--accent-primary)]">
            {icon === 'account_circle' && <AccountCircleIcon sx={{ fontSize: 16 }} />}
            {icon === 'notifications' && <NotificationsIcon sx={{ fontSize: 16 }} />}
            {icon === 'palette' && <PaletteIcon sx={{ fontSize: 16 }} />}
            {icon === 'help' && <HelpIcon sx={{ fontSize: 16 }} />}
            {icon === 'info' && <InfoIcon sx={{ fontSize: 16 }} />}
            {icon === 'person' && <AccountCircleIcon sx={{ fontSize: 16 }} />}
            {icon === 'smart_toy' && <SmartToyIcon sx={{ fontSize: 16 }} />}
            {icon === 'storage' && <StorageIcon sx={{ fontSize: 16 }} />}
            {!(icon in iconMap) && <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: `'FILL' 0` }}>{icon}</span>}
          </div>
          <div>
            <h2 className="font-semibold text-[color:var(--text-primary)]">{title}</h2>
            <p className="text-sm text-[color:var(--text-secondary)]">{description}</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-[color:var(--text-secondary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-theme pt-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Profile Settings Section
const ProfileSection = () => {
  const { currentUser, updateProfile: updateUserProfile } = useUser();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      await updateUserProfile(displayName, currentUser?.photoUrl == null ? "" : currentUser.photoUrl);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          {currentUser?.photoUrl ? (
            <img
              src={currentUser?.photoUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-[color:var(--accent-primary)]/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[color:var(--accent-primary)] flex items-center justify-center text-white text-xl font-semibold border-2 border-[color:var(--accent-primary)]/20">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <PhotoCameraIcon sx={{ fontSize: 20, color: 'white' }} />
          </div>
        </div>
        <div>
          <p className="text-[color:var(--text-primary)] font-medium">{currentUser?.displayName || 'User'}</p>
          <p className="text-sm text-[color:var(--text-secondary)]">Pro Plan Member</p>
        </div>
      </div>

      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">Display Name</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={!isEditing}
            className="flex-1 px-3 py-2 rounded-lg border border-theme bg-surface-3/50 text-[color:var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)] focus:border-transparent disabled:opacity-60"
          />
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg bg-surface-3 text-[color:var(--text-secondary)] hover:text-[color:var(--accent-primary)] transition-colors"
            >
              <EditIcon sx={{ fontSize: 14 }} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-[color:var(--accent-primary)] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50 shadow-sm shadow-[color:var(--accent-glow)]"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">Email Address</label>
        <input
          type="email"
          value={currentUser?.email || ''}
          disabled
          readOnly
          className="w-full px-3 py-2 rounded-lg border border-theme bg-surface-3/50 text-[color:var(--text-primary)] opacity-60 cursor-not-allowed"
        />
      </div>

      {/* Change Password */}
      <div className="pt-2">
        <button className="text-[color:var(--accent-primary)] hover:brightness-110 font-medium text-sm flex items-center gap-1">
          <EditIcon sx={{ fontSize: 14 }} />
          Change Password
        </button>
      </div>
    </div>
  );
};

// Appearance Section (Light/Dark/System)
const AppearanceSection = () => {
  const { darkMode, themeSetting, setThemeSetting } = useTheme();

  const themes = [
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
    { id: 'auto', label: 'System', icon: '⚙️' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setThemeSetting(theme.id)}
            className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all relative ${
              themeSetting === theme.id
                ? 'bg-surface-3/50 border-2 border-[color:var(--accent-primary)] text-[color:var(--accent-primary)]'
                : 'bg-surface-3/30 border border-theme hover:border-[color:var(--accent-primary)] text-[color:var(--text-secondary)] hover:text-[color:var(--accent-primary)]'
            }`}
          >
            <span className="text-2xl">{theme.icon}</span>
            <span className="text-sm font-medium">{theme.label}</span>
            {themeSetting === theme.id && (
              <div className="w-2 h-2 rounded-full bg-[color:var(--accent-primary)] absolute top-2 right-2" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 p-3 bg-surface-3/30 rounded-lg">
        <div>
          <p className="text-[color:var(--text-primary)] font-medium">Current theme</p>
          <p className="text-sm text-[color:var(--text-secondary)]">
            {darkMode ? 'Dark mode' : 'Light mode'} is currently active
          </p>
        </div>
        <div
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
            darkMode ? 'bg-[color:var(--accent-primary)]' : 'bg-[color:var(--border-subtle)]'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              darkMode ? 'translate-x-6' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
};

// AI Model Selection Section
const AISelectionSection = () => {
  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chatbox_ai_model') || 'gpt-4-turbo';
    }
    return 'gpt-4-turbo';
  });

  const models = [
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      description: 'Our most capable model for complex reasoning and creativity.',
      badge: 'Best Choice',
      icon: '🚀',
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Optimized for speed and efficiency. Best for quick tasks.',
      badge: null,
      icon: '⚡',
    },
  ];

  const handleSelect = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem('chatbox_ai_model', modelId);
  };

  return (
    <div className="space-y-3">
      {models.map((model) => (
        <button
          key={model.id}
          onClick={() => handleSelect(model.id)}
          className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
            selectedModel === model.id
              ? 'bg-surface-3/50 border-l-4 border-[color:var(--accent-primary)]'
              : 'bg-surface-3/30 border border-theme hover:border-[color:var(--accent-primary)]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              selectedModel === model.id ? 'bg-[color:var(--accent-primary)]/20 text-[color:var(--accent-primary)]' : 'bg-surface-3/50 text-[color:var(--text-secondary)]'
            }`}>
              <span>{model.icon}</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[color:var(--text-primary)]">{model.name}</p>
                {model.badge && (
                  <span className="text-[10px] bg-[color:var(--accent-primary)] text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {model.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-[color:var(--text-secondary)]">{model.description}</p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            selectedModel === model.id ? 'border-[color:var(--accent-primary)] bg-[color:var(--accent-primary)]' : 'border-[color:var(--border-default)]'
          }`}>
            {selectedModel === model.id && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

// Data Management Section
const DataManagementSection = () => {
  const [historyEnabled, setHistoryEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chatbox_save_history');
      return stored !== 'false';
    }
    return true;
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleHistoryToggle = () => {
    const newValue = !historyEnabled;
    setHistoryEnabled(newValue);
    localStorage.setItem('chatbox_save_history', String(newValue));
  };

  const handleExport = () => {
    alert('Export feature coming soon! Your data will be available for download.');
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    alert('Delete account feature coming soon! This will permanently remove all your data.');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-0 divide-y divide-[color:var(--border-subtle)]">
      {/* History Toggle */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-[color:var(--text-primary)]">Chat History & Training</p>
          <p className="text-sm text-[color:var(--text-secondary)]">Save new chats to your history and help improve our models.</p>
        </div>
        <button
          onClick={handleHistoryToggle}
          className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${
            historyEnabled ? 'bg-[color:var(--accent-primary)]' : 'bg-[color:var(--border-default)]'
          }`}
        >
          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
            historyEnabled ? 'translate-x-6' : ''
          }`} />
        </button>
      </div>

      {/* Export */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-[color:var(--text-primary)]">Export Data</p>
          <p className="text-sm text-[color:var(--text-secondary)]">Download a copy of your chat history and personal settings.</p>
        </div>
        <button
          onClick={handleExport}
          className="text-[color:var(--accent-primary)] font-semibold text-sm hover:underline"
        >
          Export
        </button>
      </div>

      {/* Delete */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-[color:var(--text-primary)]">Delete Account</p>
          <p className="text-sm text-[color:var(--text-secondary)]">Permanently remove all your data and workspace access.</p>
        </div>
        <button
          onClick={handleDelete}
          className="text-[color:var(--error)] font-semibold text-sm px-4 py-2 border border-[color:var(--error)] rounded-lg hover:bg-[color:var(--error)]/10 transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-2 p-6 rounded-xl max-w-md mx-4">
            <h3 className="text-lg font-semibold text-[color:var(--text-primary)] mb-2">Delete Account?</h3>
            <p className="text-[color:var(--text-secondary)] mb-4">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-[color:var(--border-default)] text-[color:var(--text-secondary)] hover:bg-surface-3"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-[color:var(--error)] text-white font-medium hover:bg-[color:var(--error)]/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main SettingsPage Component
export const SettingsPage = () => {
  return (
    <div className="relative flex flex-col h-full bg-surface-1 text-[color:var(--text-primary)]">
      {/* Noise overlay */}
      <div className="noise-dark"></div>

      {/* Floating decorative glow orb in bottom-right */}
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-accent-glow opacity-10 blur-[60px] -z-10"></div>

      <div className="p-6 border-b border-theme">
        <h1 className="text-display font-bold text-[color:var(--text-primary)]">Settings</h1>
        <p className="text-[color:var(--text-secondary)] mt-1">Manage your workspace preferences and model configurations.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* Profile Settings */}
        <SettingsSection
          title="Profile Settings"
          description="Manage your account information"
          icon="person"
          defaultOpen={true}
        >
          <ProfileSection />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection
          title="Appearance"
          description="Customize the look and feel"
          icon="palette"
          defaultOpen={false}
        >
          <AppearanceSection />
        </SettingsSection>

        {/* AI Model Selection */}
        <SettingsSection
          title="AI Model Selection"
          description="Choose your preferred AI model"
          icon="smart_toy"
          defaultOpen={false}
        >
          <AISelectionSection />
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection
          title="Data Management"
          description="Control your data and privacy"
          icon="storage"
          defaultOpen={false}
        >
          <DataManagementSection />
        </SettingsSection>
      </div>
    </div>
  );
};

export default SettingsPage;