/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm amber primary accent (CTA buttons)
        amber: {
          50: '#fef6e7',
          100: '#fde8c2',
          200: '#fbd28a',
          300: '#f9bb52',
          400: '#f7a823',
          500: '#ef9608',
          600: '#d27e05',
          700: '#a85f08',
          800: '#874c0e',
          900: '#723f10',
        },
        // Deep navy / charcoal for hero + dark banners
        ink: {
          50: '#f4f5f7',
          100: '#e4e7ec',
          200: '#c8cdd8',
          300: '#9aa3b4',
          400: '#67718a',
          500: '#454f68',
          600: '#2f3850',
          700: '#222a3d',
          800: '#1a2030',
          900: '#121724',
        },
        canvas: '#f6f6f4',
        surface: '#ffffff',
        line: '#e6e5e1',
        coal: '#1c2330',
      },
      fontFamily: {
        display: ['"Archivo"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 18px 50px -20px rgba(18, 23, 36, 0.35)',
        card: '0 10px 30px -16px rgba(18, 23, 36, 0.18)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
