'use client';

const hearts = [
  { left: '8%', size: 10, duration: '14s', delay: '0s', opacity: 0.15 },
  { left: '22%', size: 8, duration: '18s', delay: '3s', opacity: 0.12 },
  { left: '38%', size: 12, duration: '16s', delay: '7s', opacity: 0.18 },
  { left: '55%', size: 7, duration: '20s', delay: '2s', opacity: 0.13 },
  { left: '72%', size: 10, duration: '15s', delay: '5s', opacity: 0.16 },
  { left: '88%', size: 9, duration: '17s', delay: '9s', opacity: 0.14 },
];

export function FloatingHearts() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h, i) => (
        <svg
          key={i}
          width={h.size}
          height={h.size}
          viewBox="0 0 14 13"
          className="absolute animate-float-heart fill-accent"
          style={{
            left: h.left,
            bottom: '-20px',
            opacity: h.opacity,
            animationDuration: h.duration,
            animationDelay: h.delay,
          }}
        >
          <path d="M7 12.5C7 12.5 0.5 8 0.5 4.5C0.5 2 2.5 0.5 4.5 0.5C5.8 0.5 6.8 1.2 7 2C7.2 1.2 8.2 0.5 9.5 0.5C11.5 0.5 13.5 2 13.5 4.5C13.5 8 7 12.5 7 12.5Z" />
        </svg>
      ))}
    </div>
  );
}
