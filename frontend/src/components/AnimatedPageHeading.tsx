import React from 'react';
import { Sparkles } from 'lucide-react';

interface AnimatedPageHeadingProps {
  title?: string;
  text?: string;
  italicSubtitle?: string;
  tag?: string;
  className?: string;
  baseDelayMs?: number;
  wordStaggerMs?: number;
}

export const AnimatedPageHeading: React.FC<AnimatedPageHeadingProps> = ({
  title,
  text,
  italicSubtitle,
  tag,
  className = '',
  baseDelayMs = 60,
  wordStaggerMs = 110,
}) => {
  const content = text || title || '';
  const words = content.split(' ');

  return (
    <div className="space-y-1.5">
      {/* Category Pill Tag */}
      {tag && (
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163D2B]/85 border border-[#79A786]/35 text-[11px] font-bold tracking-wider text-[#DCE9DE] uppercase mb-1 shadow-xs animate-word-fade-up"
          style={{ animationDelay: `${baseDelayMs}ms` }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#79A786]" />
          <span>{tag}</span>
        </div>
      )}

      {/* Word-by-Word Main Heading */}
      <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight flex flex-wrap gap-x-2 gap-y-1 ${className}`}>
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-block animate-word-fade-up will-change-transform"
            style={{
              animationDelay: `${baseDelayMs + 80 + index * wordStaggerMs}ms`,
            }}
          >
            {word}
          </span>
        ))}
      </h1>

      {/* Editorial Italic Subtitle */}
      {italicSubtitle && (
        <p
          className="text-base sm:text-lg lg:text-xl font-serif italic text-[#DCE9DE]/95 font-medium tracking-wide animate-word-fade-up"
          style={{
            animationDelay: `${baseDelayMs + 100 + words.length * wordStaggerMs}ms`,
          }}
        >
          {italicSubtitle}
        </p>
      )}
    </div>
  );
};
