import React from 'react';
import { Play } from 'lucide-react';

interface CatalogCardProps {
  id: string;
  title: string;
  subtitle: string;
  type: 'album' | 'artist' | 'playlist';
  coverUrl?: string;
  onClick?: () => void;
  onPlayClick?: (e: React.MouseEvent) => void;
}

export function CatalogCard({
  id,
  title,
  subtitle,
  type,
  coverUrl,
  onClick,
  onPlayClick,
}: CatalogCardProps) {
  const isArtist = type === 'artist';

  const handlePlayTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayClick) onPlayClick(e);
  };

  return React.createElement(
    'div',
    {
      onClick: onClick,
      className:
        'group p-ch-4 rounded-ch-lg bg-chotify-bg-surface border border-chotify-border-primary hover:border-chotify-aura-gold/30 hover:shadow-ch-glow transition-all duration-300 cursor-pointer flex flex-col gap-ch-4 focus-ring select-none',
    },
    // Media / Image Container
    React.createElement(
      'div',
      {
        className: `w-full aspect-square bg-chotify-bg-secondary border border-chotify-border-secondary relative overflow-hidden flex items-center justify-center font-mono ${
          isArtist ? 'rounded-full' : 'rounded-ch-md'
        }`,
      },
      coverUrl
        ? React.createElement('img', {
            src: coverUrl,
            alt: title,
            className: 'w-full h-full object-cover',
          })
        : React.createElement(
            'span',
            { className: 'text-xs font-bold text-chotify-text-muted' },
            type.toUpperCase()
          ),
      // Play Button Overlay on hover (only for albums/playlists, or artists with play triggers)
      onPlayClick &&
        React.createElement(
          'button',
          {
            onClick: handlePlayTrigger,
            className: `absolute bottom-ch-3 right-ch-3 w-10 h-10 rounded-full bg-chotify-aura-gold text-chotify-carbon-950 flex items-center justify-center shadow-md scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer outline-none focus-ring`,
            'aria-label': `Play ${title}`,
          },
          React.createElement(Play, { className: 'w-ch-4.5 h-ch-4.5 fill-currentColor pl-0.5' })
        )
    ),
    // Text Metadata details
    React.createElement(
      'div',
      { className: isArtist ? 'text-center' : 'text-left' },
      React.createElement(
        'h3',
        { className: 'text-xs font-semibold text-chotify-text-primary truncate mb-1' },
        title
      ),
      React.createElement(
        'p',
        { className: 'text-[10px] text-chotify-text-muted font-mono uppercase tracking-wider truncate' },
        subtitle
      )
    )
  );
}
