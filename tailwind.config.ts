import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        finance: {
          bg: '#0B0F19',
          surface: '#111827',
          surfaceHover: '#1E293B',
          border: 'rgba(51, 65, 85, 0.5)',
          borderSubtle: 'rgba(51, 65, 85, 0.3)',
          income: '#10B981', // Emerald
          fixed: '#F43F5E', // Rose
          variable: '#F59E0B', // Amber
          invest: '#6366F1', // Indigo
          primary: '#3B82F6', // Blue
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.25), 0 1px 2px -1px rgba(0, 0, 0, 0.25)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
