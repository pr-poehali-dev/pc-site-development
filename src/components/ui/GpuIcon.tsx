const GpuIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`shrink-0 ${className}`}
    aria-hidden
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M2 15h20" />
    <circle cx="8" cy="12" r="2.5" />
    <circle cx="16" cy="12" r="2.5" />
    <path d="M22 9h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1" />
  </svg>
);

export default GpuIcon;
