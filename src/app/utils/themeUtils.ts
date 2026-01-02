import { Theme } from '../types';

export const THEMES = {
  'dark-default': {
    name: 'Noir classique',
    primary: '#3b82f6', // blue-500
    secondary: '#8b5cf6', // violet-500
    accent: '#10b981', // green-500
    background: '#000000',
  },
  'dark-blue': {
    name: 'Océan nocturne',
    primary: '#0ea5e9', // sky-500
    secondary: '#06b6d4', // cyan-500
    accent: '#14b8a6', // teal-500
    background: '#0a0e1a',
  },
  'dark-purple': {
    name: 'Galaxie violette',
    primary: '#a855f7', // purple-500
    secondary: '#d946ef', // fuchsia-500
    accent: '#ec4899', // pink-500
    background: '#0f0a1a',
  },
  'dark-green': {
    name: 'Forêt mystique',
    primary: '#22c55e', // green-500
    secondary: '#10b981', // emerald-500
    accent: '#84cc16', // lime-500
    background: '#0a1a0a',
  },
};

export const applyTheme = (theme: Theme) => {
  const themeColors = THEMES[theme];
  const root = document.documentElement;
  
  root.style.setProperty('--color-primary', themeColors.primary);
  root.style.setProperty('--color-secondary', themeColors.secondary);
  root.style.setProperty('--color-accent', themeColors.accent);
  root.style.setProperty('--color-background', themeColors.background);
};

export const getThemeGradient = (theme: Theme): string => {
  switch (theme) {
    case 'dark-blue':
      return 'from-sky-500 to-cyan-500';
    case 'dark-purple':
      return 'from-purple-500 to-fuchsia-500';
    case 'dark-green':
      return 'from-green-500 to-emerald-500';
    default:
      return 'from-blue-500 to-violet-500';
  }
};
