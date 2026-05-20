/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        bg: '#000000',
        surface: 'rgba(255,255,255,0.06)',
        'surface-hover': 'rgba(255,255,255,0.10)',
        'surface-strong': 'rgba(255,255,255,0.10)',
        'border-glass': 'rgba(255,255,255,0.10)',
        'border-strong': 'rgba(255,255,255,0.20)',
        'text-primary': '#FFFFFF',
        'text-secondary': 'rgba(255,255,255,0.50)',
        'text-tertiary': 'rgba(255,255,255,0.30)',
        accent: '#FFFFFF',
      },
      borderRadius: {
        'glass-sm': '10px',
        'glass': '14px',
        'glass-lg': '20px',
        'glass-xl': '28px',
      },
      backdropBlur: {
        glass: '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
