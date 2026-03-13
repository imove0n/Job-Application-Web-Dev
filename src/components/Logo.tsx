export default function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 pt-8 pb-2">
      {/* Speedometer icon */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-navy"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M18 6 C10 6 4 12 4 20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M32 20 C32 12 26 6 18 6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Tick marks */}
        <line x1="8" y1="12" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="8" x2="18" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="28" y1="12" x2="26" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="20" x2="27" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6" y1="20" x2="9" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Needle */}
        <line
          x1="18"
          y1="20"
          x2="24"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="18" cy="20" r="2.5" fill="currentColor" />
      </svg>
      <span className="font-heading text-2xl font-semibold tracking-tight text-navy">
        ExampleIQ
      </span>
    </div>
  );
}
