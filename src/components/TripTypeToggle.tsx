interface Props {
  value: 'one-way' | 'hourly';
  onChange: (type: 'one-way' | 'hourly') => void;
}

export default function TripTypeToggle({ value, onChange }: Props) {
  return (
    <div className="flex rounded-md border border-gray-border overflow-hidden">
      <button
        type="button"
        onClick={() => onChange('one-way')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium transition-all duration-200 cursor-pointer ${
          value === 'one-way'
            ? 'bg-gold text-white border-gold'
            : 'bg-white text-gray-text hover:bg-gray-50'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1l2 3H9v4H7V4H6l2-3zM3 10h10v1H3v-1zm1 2h8v1H4v-1zm2 2h4v1H6v-1z" />
        </svg>
        One-way
      </button>
      <button
        type="button"
        onClick={() => onChange('hourly')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium transition-all duration-200 cursor-pointer ${
          value === 'hourly'
            ? 'bg-gold text-white border-gold'
            : 'bg-white text-gray-text hover:bg-gray-50'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zM8.5 4H7v5l4 2.4.75-1.2-3.25-1.95V4z" />
        </svg>
        Hourly
      </button>
    </div>
  );
}
