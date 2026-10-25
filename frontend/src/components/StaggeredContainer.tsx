import React, { createContext, useContext } from 'react';

interface StaggerContextType {
  baseDelayMs: number;
  itemStaggerMs: number;
}

const StaggerContext = createContext<StaggerContextType>({
  baseDelayMs: 280, // Default to 280ms so heading words have animated first
  itemStaggerMs: 100, // 100ms stagger between adjacent boxes
});

interface StaggeredContainerProps {
  children: React.ReactNode;
  baseDelayMs?: number;
  itemStaggerMs?: number;
  className?: string;
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
  children,
  baseDelayMs = 280,
  itemStaggerMs = 100,
  className = '',
}) => {
  return (
    <StaggerContext.Provider value={{ baseDelayMs, itemStaggerMs }}>
      <div className={className}>{children}</div>
    </StaggerContext.Provider>
  );
};

interface StaggeredItemProps {
  index: number;
  children: React.ReactNode;
  className?: string;
  delayOffsetMs?: number;
}

export const StaggeredItem: React.FC<StaggeredItemProps> = ({
  index,
  children,
  className = '',
  delayOffsetMs = 0,
}) => {
  const { baseDelayMs, itemStaggerMs } = useContext(StaggerContext);
  const calculatedDelay = baseDelayMs + delayOffsetMs + index * itemStaggerMs;

  return (
    <div
      className={`animate-box-rise ${className}`}
      style={{
        animationDelay: `${calculatedDelay}ms`,
      }}
    >
      {children}
    </div>
  );
};
