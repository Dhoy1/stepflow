import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    join(__dirname, "popup.html"),
    join(__dirname, "editor.html"),
    join(__dirname, "src/**/*.{js,ts,jsx,tsx}"),
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        stepflow: {
          orange: '#FF5C35',
          dark: '#1E1E24',
          light: '#F8F9FA'
        }
      }
    },
  },
  plugins: [],
}

