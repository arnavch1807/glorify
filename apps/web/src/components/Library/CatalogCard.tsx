import React from 'react';
import { Play } from 'lucide-react';

interface CatalogCardProps {
  id: string;
  title: string;
  subtitle: string;
  type: 'album' | 'artist' | 'playlist';
  coverUrl?: string;
  year?: number;
  onClick?: () => void;
  onPlayClick?: (e: React.MouseEvent) => void;
}

export const CatalogCard = React.memo(function CatalogCard({
  id,
  title,
  subtitle,
  type,
  coverUrl,
  year,
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
        'group p-ch-4 rounded-[22px] card-warm-gradient hover-lift transition-all duration-300 cursor-pointer flex flex-col gap-ch-4 focus-ring select-none shadow-sm',
    },
    // Media / Image Container
    React.createElement(
      'div',
      {
        className: `w-full aspect-square bg-glorify-bg-secondary/60 relative overflow-hidden flex items-center justify-center font-mono ${
          isArtist ? 'rounded-full' : 'rounded-[20px]'
        }`,
      },
      // Artwork or default placeholder
      coverUrl
        ? React.createElement('img', {
            src: coverUrl,
            alt: title,
            className: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110',
          })
        : React.createElement(
            'div',
            { className: 'text-xs font-bold text-glorify-text-muted/60 tracking-wider uppercase' },
            type.slice(0, 3)
          ),
      
      // Gradient Overlay inside artwork
      React.createElement('div', {
        className: 'absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'
      }),
 
      // Floating Play Button Overlay
      onPlayClick &&
        React.createElement(
          'button',
          {
            onClick: handlePlayTrigger,
            className: `absolute bottom-ch-3 right-ch-3 w-11 h-11 rounded-full bg-glorify-accent text-glorify-carbon-950 flex items-center justify-center shadow-lg transform translate-y-2 scale-90 opacity-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer outline-none focus-ring z-10`,
            'aria-label': `Play ${title}`,
          },
          React.createElement(Play, { className: 'w-ch-5 h-ch-5 fill-currentColor pl-0.5' })
        )
    ),
    // Text Metadata details
    React.createElement(
      'div',
      { className: isArtist ? 'text-center' : 'text-left px-ch-1 font-sans' },
      React.createElement(
        'h3',
        { className: 'text-sm font-semibold text-glorify-text-primary truncate mb-0.5' },
        title
      ),
      React.createElement(
        'div',
        { className: 'flex items-center gap-ch-1.5 text-xs text-glorify-text-muted truncate font-medium' },
        React.createElement(
          'span',
          { className: isArtist ? 'mx-auto' : '' },
          subtitle
        ),
        year && React.createElement(
          React.Fragment,
          null,
          React.createElement('span', null, '•'),
          React.createElement('span', null, year)
        )
      )
    )
  );
});
