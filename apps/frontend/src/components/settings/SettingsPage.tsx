import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DatabaseIcon from '@mui/icons-material/Storage';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SettingsSection = ({ title, description, icon, children, defaultOpen = false }: SettingsSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-bg-secondary rounded-card border border-border-subtle overflow-hidden">
      <button
        className="w-full p-4 flex justify-between items-center text-left hover:bg-bg-tertiary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            {icon}
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">{title}</h2>
            <p className="text-sm text-text-secondary">{description}</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-border-subtle pt-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Profile Settings Section
const ProfileSection = () => {
  const { updateProfile: updateAuthProfile } = useAuth();
  const { currentUser, updateProfile: updateUserProfile, isLoading: userLoading } = useUser();
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
              className="w-16 h-16 rounded-full object-cover ring-2 ring-accent/20 ring-offset-2 ring-offset-bg-secondary"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white text-xl font-semibold ring-2 ring-accent/20 ring-offset-2 ring-offset-bg-secondary">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <PhotoCameraIcon className="text-white" />
          </div>
        </div>
        <div>
          <p className="text-text-primary font-medium">{currentUser?.displayName || 'User'}</p>
          <p className="text-sm text-text-secondary">Pro Plan Member</p>
        </div>
      </div>

      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Display Name</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={!isEditing}
            className="flex-1 px-3 py-2 rounded-input border border-border-default bg-bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-60"
          />
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-button bg-bg-tertiary text-text-secondary hover:text-accent transition-colors"
            >
              <EditIcon fontSize="small" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-button bg-accent text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
        <input
          type="email"
          value={currentUser?.email || ''}
          disabled
          readOnly
          className="w-full px-3 py-2 rounded-input border border-border-default bg-bg-input/50 text-text-primary opacity-60 cursor-not-allowed"
        />
      </div>

      {/* Change Password */}
      <div className="pt-2">
        <button className="text-accent hover:text-accent-hover font-medium text-sm flex items-center gap-1">
          <EditIcon fontSize="small" />
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
            className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
              themeSetting === theme.id
                ? 'bg-accent/10 border-2 border-accent text-accent'
                : 'border border-border-subtle hover:border-accent/50 text-text-secondary hover:text-accent'
            }`}
          >
            <span className="text-2xl">{theme.icon}</span>
            <span className="text-sm font-medium">{theme.label}</span>
            {themeSetting === theme.id && (
              <div className="w-2 h-2 rounded-full bg-accent absolute top-2 right-2" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 p-3 bg-bg-tertiary rounded-lg">
        <div>
          <p className="text-text-primary font-medium">Current theme</p>
          <p className="text-sm text-text-secondary">
            {darkMode ? 'Dark mode' : 'Light mode'} is currently active
          </p>
        </div>
        <div
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
            darkMode ? 'bg-accent' : 'bg-border-default'
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
      return localStorage.getItem('chatbox_ai_model') || 'gpt-4';
    }
    return 'gpt-4';
  });

  const models = [
    {
      id: 'gpt-4',
      name: 'GPT-4 Turbo',
      description: 'Our most capable model for complex reasoning and creativity.',
      badge: 'Best Choice',
      icon: '🚀',
    },
    {
      id: 'gpt-3.5',
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
              ? 'bg-accent/10 border-2 border-accent/30'
              : 'border border-border-subtle hover:border-accent/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              selectedModel === model.id ? 'bg-accent/20 text-accent' : 'bg-bg-tertiary text-text-secondary'
            }`}>
              <span>{model.icon}</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-text-primary">{model.name}</p>
                {model.badge && (
                  <span className="text-[10px] bg-accent text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {model.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary">{model.description}</p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            selectedModel === model.id ? 'border-accent bg-accent' : 'border-border-default'
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
    <div className="space-y-0 divide-y divide-border-subtle">
      {/* History Toggle */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-text-primary">Chat History & Training</p>
          <p className="text-sm text-text-secondary">Save new chats to your history and help improve our models.</p>
        </div>
        <button
          onClick={handleHistoryToggle}
          className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${
            historyEnabled ? 'bg-accent' : 'bg-border-default'
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
          <p className="font-medium text-text-primary">Export Data</p>
          <p className="text-sm text-text-secondary">Download a copy of your chat history and personal settings.</p>
        </div>
        <button
          onClick={handleExport}
          className="text-accent font-semibold text-sm hover:underline"
        >
          Export
        </button>
      </div>

      {/* Delete */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-text-primary">Delete Account</p>
          <p className="text-sm text-text-secondary">Permanently remove all your data and workspace access.</p>
        </div>
        <button
          onClick={handleDelete}
          className="text-error font-semibold text-sm px-4 py-2 border border-error/30 rounded-lg hover:bg-error/10 transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-secondary p-6 rounded-xl max-w-md mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Delete Account?</h3>
            <p className="text-text-secondary mb-4">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-border-default text-text-secondary hover:bg-bg-tertiary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-error text-white font-medium hover:bg-error/90"
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
    <div className="flex flex-col h-full bg-bg-primary text-text-primary">
      <div className="p-6 border-b border-border-subtle">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your workspace preferences and model configurations.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Profile Settings */}
        <SettingsSection
          title="Profile Settings"
          description="Manage your account information"
          icon={<PersonIcon />}
          defaultOpen={true}
        >
          <ProfileSection />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection
          title="Appearance"
          description="Customize the look and feel"
          icon={<PaletteIcon />}
        >
          <AppearanceSection />
        </SettingsSection>

        {/* AI Model Selection */}
        <SettingsSection
          title="AI Model Selection"
          description="Choose your preferred AI model"
          icon={<SmartToyIcon />}
        >
          <AISelectionSection />
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection
          title="Data Management"
          description="Control your data and privacy"
          icon={<DatabaseIcon />}
        >
          <DataManagementSection />
        </SettingsSection>
      </div>
    </div>
  );
};

export default SettingsPage;