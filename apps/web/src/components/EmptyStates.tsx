import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Heart, Search, ListMusic, History, Music } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export function BaseEmptyState({ icon, title, message, actionText, onAction }: EmptyStateProps) {
  return React.createElement(
    'div',
    { className: 'flex flex-col items-center justify-center text-center p-8 md:p-12 bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[28px] max-w-lg mx-auto my-8 select-none' },
    React.createElement(
      'div',
      { className: 'w-16 h-16 rounded-full bg-glorify-accent/10 flex items-center justify-center text-glorify-accent mb-5 shadow-inner' },
      icon
    ),
    React.createElement(
      'h3',
      { className: 'text-lg font-bold text-glorify-text-primary mb-2 tracking-tight' },
      title
    ),
    React.createElement(
      'p',
      { className: 'text-xs text-glorify-text-muted leading-relaxed max-w-sm mb-6' },
      message
    ),
    actionText && onAction &&
      React.createElement(
        motion.button,
        {
          onClick: onAction,
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          className: 'px-ch-5 py-2.5 rounded-full bg-glorify-accent text-glorify-carbon-950 text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer outline-none focus-ring'
        },
        actionText
      )
  );
}

export function NoDownloads() {
  const navigate = useNavigate();
  return React.createElement(BaseEmptyState, {
    icon: React.createElement(Download, { className: 'w-7 h-7' }),
    title: 'No Offline Downloads',
    message: 'Songs you download will appear here so you can play them without an internet connection.',
    actionText: 'Find Music to Download',
    onAction: () => navigate('/search')
  });
}

export function NoFavorites() {
  const navigate = useNavigate();
  return React.createElement(BaseEmptyState, {
    icon: React.createElement(Heart, { className: 'w-7 h-7' }),
    title: 'Your Favorites is Empty',
    message: 'Tap the heart icon on any song, album, or artist to add it to your library collection.',
    actionText: 'Explore Catalog',
    onAction: () => navigate('/search')
  });
}

export function NoSearchResults({ query }: { query: string }) {
  return React.createElement(BaseEmptyState, {
    icon: React.createElement(Search, { className: 'w-7 h-7' }),
    title: 'No Matches Found',
    message: `We couldn't find any results matching "${query}". Double check your spelling or search for another song title, artist name, or genre.`,
  });
}

export function NoQueue() {
  const navigate = useNavigate();
  return React.createElement(BaseEmptyState, {
    icon: React.createElement(ListMusic, { className: 'w-7 h-7' }),
    title: 'Your Queue is Empty',
    message: 'Add songs to your queue from album listings or search cards to keep the music playing.',
    actionText: 'Browse Popular Songs',
    onAction: () => navigate('/')
  });
}

export function NoPlaylists({ onCreate }: { onCreate: () => void }) {
  return React.createElement(BaseEmptyState, {
    icon: React.createElement(Music, { className: 'w-7 h-7' }),
    title: 'No Playlists Created',
    message: 'Create a custom playlist to group your favorite tracks together for study, work, or relaxation.',
    actionText: 'Create Playlist Now',
    onAction: onCreate
  });
}

export function NoHistory() {
  const navigate = useNavigate();
  return React.createElement(BaseEmptyState, {
    icon: React.createElement(History, { className: 'w-7 h-7' }),
    title: 'No Listening History',
    message: "Tracks you've recently played will appear here. Start playing music to build your history log.",
    actionText: 'Start Listening',
    onAction: () => navigate('/')
  });
}
