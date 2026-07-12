"use client";

export function DuckIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <ellipse cx="28" cy="28" rx="14" ry="12" fill="currentColor" opacity="0.15" />
      <path d="M14 28c0-3 1-5 3-7l2 3c-1 1-2 3-2 4h-3z" fill="currentColor" opacity="0.6" />
      <ellipse cx="24" cy="26" rx="10" ry="8" fill="currentColor" />
      <circle cx="24" cy="18" r="9" fill="currentColor" />
      <circle cx="21" cy="16" r="1.8" fill="#0a0a0a" />
      <circle cx="21.8" cy="15.5" r="0.6" fill="white" />
      <circle cx="28" cy="16" r="1.8" fill="#0a0a0a" />
      <circle cx="28.8" cy="15.5" r="0.6" fill="white" />
      <path d="M22 21c0 3 2 4 4 4s4-1 4-4" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M34 20l4-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <circle cx="38" cy="16" r="2" fill="currentColor" opacity="0.4" />
      <path d="M34 28c4-1 8-2 11-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M18 34c2 4 6 7 10 7s8-3 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function DuckIconSmall({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="14" cy="15" rx="7" ry="6" fill="currentColor" opacity="0.12" />
      <path d="M7 15c0-1.5.5-2.5 1.5-3.5l1 1.5c-.5.5-1 1.5-1 2h-1.5z" fill="currentColor" opacity="0.5" />
      <ellipse cx="12" cy="14" rx="5" ry="4" fill="currentColor" />
      <circle cx="12" cy="10" r="4.5" fill="currentColor" />
      <circle cx="10.5" cy="9" r="0.9" fill="#0a0a0a" />
      <circle cx="11" cy="8.8" r="0.3" fill="white" />
      <circle cx="14" cy="9" r="0.9" fill="#0a0a0a" />
      <circle cx="14.5" cy="8.8" r="0.3" fill="white" />
      <path d="M11 11.5c0 1.5 1 2 2 2s2-.5 2-2" stroke="#0a0a0a" strokeWidth="0.75" strokeLinecap="round" fill="none" />
      <path d="M18 10.5l2-1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
      <circle cx="20" cy="8.5" r="1" fill="currentColor" opacity="0.3" />
      <path d="M18 15c2-.5 4-1 5.5-.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M9 17.5c1 2 3 3.5 5 3.5s4-1.5 5-3.5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}
