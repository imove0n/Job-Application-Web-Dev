interface Props {
  value: 'location' | 'airport';
  onChange: (type: 'location' | 'airport') => void;
}

export default function LocationTypeToggle({ value, onChange }: Props) {
  return (
    <div className="flex gap-0 mb-3">
      <button
        type="button"
        onClick={() => onChange('location')}
        className={`px-4 py-1.5 text-xs font-medium rounded-l border transition-all duration-150 cursor-pointer ${
          value === 'location'
            ? 'bg-gold/10 text-gold border-gold'
            : 'bg-white text-gray-text border-gray-border hover:border-gold/50'
        }`}
      >
        Location
      </button>
      <button
        type="button"
        onClick={() => onChange('airport')}
        className={`px-4 py-1.5 text-xs font-medium rounded-r border border-l-0 transition-all duration-150 cursor-pointer ${
          value === 'airport'
            ? 'bg-gold/10 text-gold border-gold'
            : 'bg-white text-gray-text border-gray-border hover:border-gold/50'
        }`}
      >
        Airport
      </button>
    </div>
  );
}
