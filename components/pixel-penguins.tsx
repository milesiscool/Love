'use client';

export function PixelPenguins() {
  return (
    <div className="flex items-end justify-center gap-1 py-3" aria-hidden="true">
      {/* Left penguin */}
      <div className="animate-penguin-bob relative" style={{ animationDelay: '0s' }}>
        <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <ellipse cx="20" cy="30" rx="14" ry="16" className="fill-ink" />
          {/* Belly */}
          <ellipse cx="20" cy="32" rx="9" ry="12" fill="white" fillOpacity="0.92" />
          {/* Head */}
          <circle cx="20" cy="14" r="11" className="fill-ink" />
          {/* Face */}
          <ellipse cx="20" cy="16" rx="7" ry="6" fill="white" fillOpacity="0.92" />
          {/* Left eye */}
          <g className="animate-penguin-blink origin-center" style={{ animationDelay: '0.2s' }}>
            <circle cx="16.5" cy="14" r="2" className="fill-ink" />
            <circle cx="17.2" cy="13.3" r="0.6" fill="white" />
          </g>
          {/* Right eye */}
          <g className="animate-penguin-blink origin-center" style={{ animationDelay: '0.2s' }}>
            <circle cx="23.5" cy="14" r="2" className="fill-ink" />
            <circle cx="24.2" cy="13.3" r="0.6" fill="white" />
          </g>
          {/* Beak */}
          <path d="M18.5 17.5 L20 20 L21.5 17.5Z" className="fill-accent" />
          {/* Cheeks */}
          <circle cx="14" cy="17" r="2" className="fill-accent" fillOpacity="0.4" />
          <circle cx="26" cy="17" r="2" className="fill-accent" fillOpacity="0.4" />
          {/* Left flipper */}
          <ellipse cx="6" cy="28" rx="4" ry="8" className="fill-ink" transform="rotate(-12 6 28)" />
          {/* Right flipper — reaching toward other penguin */}
          <ellipse cx="34" cy="27" rx="4" ry="8" className="fill-ink" transform="rotate(18 34 27)" />
          {/* Feet */}
          <ellipse cx="14" cy="45" rx="5" ry="2.5" className="fill-accent" />
          <ellipse cx="26" cy="45" rx="5" ry="2.5" className="fill-accent" />
        </svg>
      </div>

      {/* Floating heart between them */}
      <div className="relative -mx-2 mb-6 flex items-center justify-center">
        <svg
          width="14"
          height="13"
          viewBox="0 0 14 13"
          className="animate-float-up fill-accent"
          style={{ animationIterationCount: 'infinite', animationDuration: '3s' }}
        >
          <path d="M7 12.5 C7 12.5 0.5 8 0.5 4.5 C0.5 2 2.5 0.5 4.5 0.5 C5.8 0.5 6.8 1.2 7 2 C7.2 1.2 8.2 0.5 9.5 0.5 C11.5 0.5 13.5 2 13.5 4.5 C13.5 8 7 12.5 7 12.5Z" />
        </svg>
      </div>

      {/* Right penguin — slightly tilted toward left one */}
      <div className="animate-penguin-bob relative" style={{ animationDelay: '0.4s' }}>
        <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
          {/* Body */}
          <ellipse cx="20" cy="30" rx="14" ry="16" className="fill-ink" />
          {/* Belly */}
          <ellipse cx="20" cy="32" rx="9" ry="12" fill="white" fillOpacity="0.92" />
          {/* Head */}
          <circle cx="20" cy="14" r="11" className="fill-ink" />
          {/* Face */}
          <ellipse cx="20" cy="16" rx="7" ry="6" fill="white" fillOpacity="0.92" />
          {/* Left eye */}
          <g className="animate-penguin-blink origin-center" style={{ animationDelay: '0.8s' }}>
            <circle cx="16.5" cy="14" r="2" className="fill-ink" />
            <circle cx="17.2" cy="13.3" r="0.6" fill="white" />
          </g>
          {/* Right eye */}
          <g className="animate-penguin-blink origin-center" style={{ animationDelay: '0.8s' }}>
            <circle cx="23.5" cy="14" r="2" className="fill-ink" />
            <circle cx="24.2" cy="13.3" r="0.6" fill="white" />
          </g>
          {/* Beak */}
          <path d="M18.5 17.5 L20 20 L21.5 17.5Z" className="fill-accent" />
          {/* Cheeks */}
          <circle cx="14" cy="17" r="2" className="fill-accent" fillOpacity="0.4" />
          <circle cx="26" cy="17" r="2" className="fill-accent" fillOpacity="0.4" />
          {/* Left flipper — reaching toward other penguin */}
          <ellipse cx="6" cy="27" rx="4" ry="8" className="fill-ink" transform="rotate(-18 6 27)" />
          {/* Right flipper */}
          <ellipse cx="34" cy="28" rx="4" ry="8" className="fill-ink" transform="rotate(12 34 28)" />
          {/* Feet */}
          <ellipse cx="14" cy="45" rx="5" ry="2.5" className="fill-accent" />
          <ellipse cx="26" cy="45" rx="5" ry="2.5" className="fill-accent" />
        </svg>
      </div>
    </div>
  );
}
