/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1f36',
        accent: '#34d399',
        secondary: {
          100: '#f3f4f6',
          200: '#d1d5db',
        },
        warning: '#fbbf24',
        caution: '#f97316',
        danger: '#ef4444',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        pulseArrow: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(6px)' },
        },
        shimmer: {
          '100%': { backgroundPosition: '200% center' },
        },
        progressBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        dotPulse: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        cardPop: {
          '0%': { opacity: 0, transform: 'scale(0.95) translateY(20px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
        modalPop: {
          '0%': { opacity: 0, transform: 'scale(0.85)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        ripple: {
          '0%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.4)' },
          '100%': { boxShadow: '0 0 0 12px rgba(16,185,129,0)' },
        },
        focusGlow: {
          '0%': { boxShadow: '0 0 0 0 #10b981' },
          '100%': { boxShadow: '0 0 0 6px #10b98144' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.7s cubic-bezier(.39,.575,.565,1) both',
        bounceIn: 'bounceIn 0.7s',
        pulseArrow: 'pulseArrow 0.7s infinite',
        shimmer: 'shimmer 1.5s linear infinite',
        progressBar: 'progressBar 1.2s cubic-bezier(.4,0,.2,1) forwards',
        dotPulse: 'dotPulse 1s infinite',
        cardPop: 'cardPop 0.5s cubic-bezier(.39,.575,.565,1) both',
        modalPop: 'modalPop 0.35s cubic-bezier(.39,.575,.565,1) both',
        ripple: 'ripple 0.4s linear',
        focusGlow: 'focusGlow 0.4s linear',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

