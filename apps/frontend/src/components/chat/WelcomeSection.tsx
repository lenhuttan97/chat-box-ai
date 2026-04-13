import { motion } from 'framer-motion';
import { SvgIcon } from '@mui/material';

// Define the icons as components
const EditNoteIcon = () => (
  <SvgIcon className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1lrr7yx-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditNoteIcon">
    <path d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71-5.3 5.3V21h2.12l5.3-5.3z"></path>
  </SvgIcon>
);

const PaletteIcon = () => (
  <SvgIcon className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1lrr7yx-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="PaletteIcon">
    <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.2-.64-1.67-.08-.1-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9m5.5 11c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m-3-4c-.83 0-1.5-.67-1.5-1.5S13.67 6 14.5 6s1.5.67 1.5 1.5S15.33 9 14.5 9M5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S7.33 13 6.5 13 5 12.33 5 1.5m6-4c0 .83-.67 1.5-1.5 1.5S8 8.33 8 7.5 8.67 6 9.5 6s1.5.67 1.5 1.5"></path>
  </SvgIcon>
);

const CodeIcon = () => (
  <SvgIcon className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1lrr7yx-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CodeIcon">
    <path d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6z"></path>
  </SvgIcon>
);

const AnalyticsIcon = () => (
  <SvgIcon className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1lrr7yx-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AnalyticsIcon">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M9 17H7v-5h2zm4 0h-2v-3h2zm0-5h-2v-2h2zm4 5h-2V7h2z"></path>
  </SvgIcon>
);

interface SuggestionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay: number;
}

const SuggestionCard = ({ icon, title, description, onClick, delay }: SuggestionCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative flex flex-col items-start p-5 rounded-xl bg-surface-3/50 backdrop-blur-sm border border-theme hover:border-accent/30 transition-all duration-300 text-left w-full overflow-hidden suggestion-btn"
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_var(--accent-primary)/5,_transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon container */}
      <div className="relative mb-3 p-2.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
        {icon}
      </div>

      {/* Title */}
      <h3 className="relative mb-1 text-base font-semibold text-text-primary group-hover:text-accent transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="relative text-sm text-text-secondary group-hover:text-text-tertiary transition-colors duration-300">
        {description}
      </p>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,_var(--accent-primary)_0%,_transparent_70%)] opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-300" />
    </motion.button>
  );
};

interface WelcomeSectionProps {
  onSuggestionClick?: (suggestion: string) => void;
}

const suggestions = [
  {
    icon: <EditNoteIcon />,
    title: 'Help me write',
    description: 'Create emails, essays, or creative content',
    action: 'write'
  },
  {
    icon: <PaletteIcon />,
    title: 'Design something',
    description: 'Get help with logos, UI concepts, or art',
    action: 'design'
  },
  {
    icon: <CodeIcon />,
    title: 'Write code',
    description: 'Debug, refactor, or explain code',
    action: 'code'
  },
  {
    icon: <AnalyticsIcon />,
    title: 'Analyze data',
    description: 'Interpret charts, graphs, or research',
    action: 'analyze'
  },
];

export const WelcomeSection = ({ onSuggestionClick }: WelcomeSectionProps) => {
  const handleSuggestionClick = (title: string, action: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(action);
    } else {
      // Default: Just log for now - the actual implementation would trigger the input
      console.log('Suggestion clicked:', title);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8">
      {/* Welcome message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 animate-fade-in"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          How can I help you today?
        </h2>
        <p className="text-text-secondary text-base max-w-md">
          I can help you write, design, code, or analyze. Choose a suggestion or type a message.
        </p>
      </motion.div>

      {/* Suggestion cards - Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl suggestion-grid">
        {suggestions.map((suggestion, index) => (
          <SuggestionCard
            key={suggestion.title}
            icon={suggestion.icon}
            title={suggestion.title}
            description={suggestion.description}
            delay={0.1 + index * 0.1}
            onClick={() => handleSuggestionClick(suggestion.title, suggestion.action)}
          />
        ))}
      </div>
    </div>
  );
};