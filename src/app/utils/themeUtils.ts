import { Theme } from '../types';

export const THEMES = {
  'light-default': {
    name: 'Sable Doux',
    primary: '#b5835a',
    secondary: '#7a918d',
    accent: '#c97c5d',
    background: '#fdfaf7',
  },
  'dark-default': {
    name: 'Pierre Noire',
    primary: '#d69e6d',
    secondary: '#8da3a0',
    accent: '#d68d71',
    background: '#1c1917',
  },
  'mixed-glass': {
    name: 'Verre Glacé',
    primary: '#b5835a',
    secondary: '#7a918d',
    accent: '#c97c5d',
    background: 'rgba(253, 250, 247, 0.6)',
  },
  'dark-blue': {
    name: 'Océan de Nuit',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#14b8a6',
    background: '#0a0e1a',
  },
  'dark-purple': {
    name: 'Nébuleuse',
    primary: '#a855f7',
    secondary: '#d946ef',
    accent: '#ec4899',
    background: '#0f0a1a',
  },
  'dark-green': {
    name: 'Forêt Calme',
    primary: '#22c55e',
    secondary: '#10b981',
    accent: '#84cc16',
    background: '#0a1a0a',
  },
};

export const applyTheme = (theme: Theme) => {
  const themeColors = THEMES[theme];
  const root = document.documentElement;
  const isDark = theme.startsWith('dark');
  const isMixed = theme === 'mixed-glass';

  // Toggle classes
  root.classList.toggle('dark', isDark);
  root.classList.toggle('mixed-glass', isMixed);

  // Set CSS variables
  root.style.setProperty('--background', themeColors.background);
  root.style.setProperty('--primary', themeColors.primary);
  root.style.setProperty('--secondary', themeColors.secondary);
  root.style.setProperty('--accent', themeColors.accent);
  root.style.setProperty('--foreground', isDark ? '#f5f5f4' : '#4a443f');
};

export const getThemeColor = (type: 'primary' | 'secondary' | 'accent' | 'background'): string => {
  return `var(--color-${type})`;
};

export const getThemeGradient = (theme: Theme): string => {
  return 'from-primary to-secondary';
};
