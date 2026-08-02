import React from 'react';

// A single item skeleton card
export function CardSkeleton() {
  return React.createElement(
    'div',
    { className: 'w-full aspect-[3/4] p-4 rounded-[22px] bg-glorify-bg-surface/30 border border-glorify-border-primary/5 flex flex-col gap-3' },
    React.createElement('div', { className: 'w-full aspect-square rounded-[18px] shimmer-bg' }),
    React.createElement('div', { className: 'h-4 w-3/4 rounded shimmer-bg mt-1' }),
    React.createElement('div', { className: 'h-3 w-1/2 rounded shimmer-bg' })
  );
}

// A single row track skeleton
export function TrackRowSkeleton() {
  return React.createElement(
    'div',
    { className: 'flex items-center gap-4 p-3 rounded-[12px] border border-transparent' },
    React.createElement('div', { className: 'w-4 h-4 rounded shimmer-bg' }),
    React.createElement('div', { className: 'w-10 h-10 rounded shimmer-bg flex-shrink-0' }),
    React.createElement(
      'div',
      { className: 'flex-1 flex flex-col gap-1.5' },
      React.createElement('div', { className: 'h-3.5 w-1/3 rounded shimmer-bg' }),
      React.createElement('div', { className: 'h-3 w-1/4 rounded shimmer-bg' })
    ),
    React.createElement('div', { className: 'h-3.5 w-12 rounded shimmer-bg' })
  );
}

export function HomeSkeleton() {
  return React.createElement(
    'div',
    { className: 'w-full flex flex-col gap-12 mt-4 pb-32 animate-pulse' },
    
    // Banner skeleton
    React.createElement(
      'div',
      { className: 'w-full h-48 rounded-[28px] shimmer-bg' }
    ),

    // Quick access grid
    React.createElement(
      'div',
      { className: 'flex flex-col gap-4' },
      React.createElement('div', { className: 'h-6 w-48 rounded shimmer-bg' }),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' },
        Array.from({ length: 6 }).map((_, i) =>
          React.createElement(
            'div',
            { key: i, className: 'h-20 w-full rounded-[22px] shimmer-bg' }
          )
        )
      )
    ),

    // Row layout skeletons
    Array.from({ length: 3 }).map((_, i) =>
      React.createElement(
        'div',
        { key: i, className: 'flex flex-col gap-4' },
        React.createElement('div', { className: 'h-6 w-36 rounded shimmer-bg' }),
        React.createElement(
          'div',
          { className: 'flex gap-6 overflow-x-auto scrollbar-none py-2' },
          Array.from({ length: 5 }).map((_, j) =>
            React.createElement(
              'div',
              { key: j, className: 'w-44 flex-shrink-0' },
              React.createElement(CardSkeleton)
            )
          )
        )
      )
    )
  );
}

export function SearchSkeleton() {
  return React.createElement(
    'div',
    { className: 'flex flex-col gap-8 w-full mx-auto mt-4 pb-32 animate-pulse' },
    React.createElement('div', { className: 'w-full h-14 rounded-full shimmer-bg' }),
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-5 gap-8' },
      React.createElement(
        'div',
        { className: 'lg:col-span-2 flex flex-col gap-4' },
        React.createElement('div', { className: 'h-5 w-24 rounded shimmer-bg' }),
        React.createElement('div', { className: 'w-full h-64 rounded-[28px] shimmer-bg' })
      ),
      React.createElement(
        'div',
        { className: 'lg:col-span-3 flex flex-col gap-4' },
        React.createElement('div', { className: 'h-5 w-20 rounded shimmer-bg' }),
        React.createElement(
          'div',
          { className: 'flex flex-col gap-3 rounded-[28px] bg-glorify-bg-surface/20 p-2 border border-glorify-border-primary/5' },
          Array.from({ length: 4 }).map((_, i) =>
            React.createElement(TrackRowSkeleton, { key: i })
          )
        )
      )
    )
  );
}

export function LibrarySkeleton() {
  return React.createElement(
    'div',
    { className: 'flex flex-col gap-6 w-full mx-auto pb-32 animate-pulse' },
    React.createElement(
      'div',
      { className: 'flex flex-col gap-2' },
      React.createElement('div', { className: 'h-8 w-44 rounded shimmer-bg' }),
      React.createElement('div', { className: 'h-4 w-3/4 rounded shimmer-bg' })
    ),
    React.createElement('div', { className: 'h-10 w-full rounded-full shimmer-bg mt-2' }),
    React.createElement(
      'div',
      { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4' },
      Array.from({ length: 10 }).map((_, i) =>
        React.createElement(CardSkeleton, { key: i })
      )
    )
  );
}

export function PlaylistPageSkeleton() {
  return React.createElement(
    'div',
    { className: 'w-full flex flex-col gap-8 pb-32 animate-pulse' },
    React.createElement('div', { className: 'h-5 w-16 rounded shimmer-bg' }),
    React.createElement(
      'div',
      { className: 'w-full h-56 rounded-[28px] shimmer-bg' }
    ),
    React.createElement('div', { className: 'h-12 w-full rounded-full shimmer-bg' }),
    React.createElement(
      'div',
      { className: 'flex flex-col gap-2 rounded-[24px] bg-glorify-bg-surface/20 p-4 border border-glorify-border-primary/5' },
      Array.from({ length: 6 }).map((_, i) =>
        React.createElement(TrackRowSkeleton, { key: i })
      )
    )
  );
}

export function AlbumPageSkeleton() {
  return React.createElement(
    'div',
    { className: 'w-full flex flex-col gap-8 pb-32 animate-pulse' },
    React.createElement('div', { className: 'h-5 w-16 rounded shimmer-bg' }),
    React.createElement(
      'div',
      { className: 'w-full h-56 rounded-[28px] shimmer-bg' }
    ),
    React.createElement('div', { className: 'h-12 w-full rounded-full shimmer-bg' }),
    React.createElement(
      'div',
      { className: 'flex flex-col gap-2 rounded-[24px] bg-glorify-bg-surface/20 p-4 border border-glorify-border-primary/5' },
      Array.from({ length: 6 }).map((_, i) =>
        React.createElement(TrackRowSkeleton, { key: i })
      )
    )
  );
}

export function ArtistPageSkeleton() {
  return React.createElement(
    'div',
    { className: 'w-full flex flex-col gap-8 pb-32 animate-pulse' },
    React.createElement('div', { className: 'h-5 w-16 rounded shimmer-bg' }),
    React.createElement(
      'div',
      { className: 'w-full h-64 rounded-[28px] shimmer-bg' }
    ),
    React.createElement('div', { className: 'h-12 w-full rounded-full shimmer-bg' }),
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-3 gap-8' },
      React.createElement(
        'div',
        { className: 'lg:col-span-2 flex flex-col gap-3 rounded-[24px] bg-glorify-bg-surface/20 p-4' },
        Array.from({ length: 4 }).map((_, i) =>
          React.createElement(TrackRowSkeleton, { key: i })
        )
      ),
      React.createElement(
        'div',
        { className: 'lg:col-span-1 h-44 rounded-[24px] shimmer-bg' }
      )
    )
  );
}
