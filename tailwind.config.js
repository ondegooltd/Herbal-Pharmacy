/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3A7D44',
        secondary: '#FFAC0C',
        accent: '#E74C3C',
        neutral: {
          light: '#F5F5F5',
          dark: '#333333',
          medium: '#666666'
        }
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif']
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.1)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.15)'
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-delay-1': 'fadeIn 0.8s ease-out 0.2s both',
        'fade-in-delay-2': 'fadeIn 0.8s ease-out 0.4s both',
        'fade-in-delay-3': 'fadeIn 0.8s ease-out 0.6s both',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};