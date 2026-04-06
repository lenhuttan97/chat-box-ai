/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* ============================================
         Colors - CSS Variables (for dark/light mode)
         ============================================ */
      colors: {
        // Primary accent
        accent: {
          DEFAULT: 'var(--accent-primary)',
          hover: 'var(--accent-hover)',
          glow: 'var(--accent-glow)',
        },

        // Background colors
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          glass: 'var(--bg-glass)',
        },

        // Text colors
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },

        // Border colors
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          focus: 'var(--border-focus)',
        },

        // Message bubbles
        bubble: {
          user: 'var(--user-bubble)',
          ai: 'var(--ai-bubble)',
        },

        // Legacy aliases (backward compatibility)
        primary: 'var(--accent-primary)',
        'background-light': '#f6f8f7',
        'background-dark': '#11211d',
        'border-muted': '#3D3D3D',
      },

      /* ============================================
         Typography Scale
         Based on design spec: Inter font
         ============================================ */
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },

      fontSize: {
        // Display: 32px / 600 / -0.02em
        'display': ['32px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.02em' }],
        // H1: 24px / 600 / -0.02em
        'h1': ['24px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.02em' }],
        // H2: 18px / 600 / -0.01em
        'h2': ['18px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '-0.01em' }],
        // Body: 15px / 400 / 0
        'body': ['15px', { lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }],
        // Message: 15px / 400 / 0
        'message': ['15px', { lineHeight: '1.6', fontWeight: '400', letterSpacing: '0' }],
        // Caption: 13px / 400 / 0
        'caption': ['13px', { lineHeight: '1.4', fontWeight: '400', letterSpacing: '0' }],
        // Input: 15px / 400 / 0
        'input': ['15px', { lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }],
      },

      /* ============================================
         Spacing Scale
         xs: 4px, sm: 8px, md: 12px, lg: 16px
         xl: 24px, 2xl: 32px, 3xl: 48px, 4xl: 64px
         ============================================ */
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },

      /* ============================================
         Border Radius
         button: 8px, input: 24px (pill)
         card: 12px, message: 16px
         ============================================ */
      borderRadius: {
        'button': '8px',
        'input': '24px',    // Pill shape
        'card': '12px',
        'message': '16px',
        'full': '9999px',  // For complete pills
      },

      /* ============================================
         Layout
         ============================================ */
      width: {
        'sidebar': '260px',
        'chat-max': '800px',
      },
      height: {
        'header': '56px',
      },

      /* ============================================
         Custom Utilities
         ============================================ */
      backgroundImage: {
        'accent-gradient': 'var(--accent-gradient)',
      },

      boxShadow: {
        'glow': '0 0 20px var(--accent-glow)',
        'glow-sm': '0 0 10px var(--accent-glow)',
        'glow-lg': '0 0 30px var(--accent-glow)',
      },

      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },

      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
        'slide-down': 'slideDown 200ms ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}