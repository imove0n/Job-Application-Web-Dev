import { useRef, useState, useEffect, useCallback } from 'react';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
}

interface Props {
  value: string;
  onChange: (address: string, placeId: string, lat?: string, lon?: string) => void;
  locationType: 'location' | 'airport';
  placeholder?: string;
  error?: string;
}

export default function PlacesAutocomplete({
  value,
  onChange,
  locationType,
  placeholder = 'Enter a location',
  error,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync external value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchNominatim = useCallback(
    async (query: string) => {
      if (query.length < 3) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        // Build Nominatim search URL
        const params = new URLSearchParams({
          q: locationType === 'airport' ? `${query} airport` : query,
          format: 'json',
          addressdetails: '1',
          limit: '5',
          countrycodes: 'us',
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          {
            headers: {
              'Accept-Language': 'en',
            },
          }
        );

        if (!response.ok) throw new Error('Nominatim request failed');

        const results: NominatimResult[] = await response.json();

        // Filter for airports if airport mode
        const filtered =
          locationType === 'airport'
            ? results.filter(
                (r) =>
                  r.type === 'aerodrome' ||
                  r.class === 'aeroway' ||
                  r.display_name.toLowerCase().includes('airport') ||
                  r.display_name.toLowerCase().includes('terminal')
              )
            : results;

        setSuggestions(filtered.length > 0 ? filtered : results.slice(0, 5));
        setShowDropdown(true);
      } catch (err) {
        console.error('Nominatim search error:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [locationType]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (!val) {
      onChange('', '');
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Debounce Nominatim requests (respect 1 req/sec policy)
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchNominatim(val), 400);
  };

  const handleSelect = (result: NominatimResult) => {
    setInputValue(result.display_name);
    onChange(result.display_name, String(result.place_id), result.lat, result.lon);
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <div
        className={`relative border rounded-md transition-colors ${
          error ? 'border-red-400' : 'border-gray-border focus-within:border-gold'
        }`}
      >
        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-text">
          Location
        </label>
        <div className="flex items-center px-3 py-3">
          <svg
            className="w-4 h-4 text-gold mr-2 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            placeholder={
              locationType === 'airport' ? 'Search for an airport...' : placeholder
            }
            className="w-full text-sm text-navy outline-none bg-transparent placeholder:text-gray-text/60"
          />
          {loading && (
            <svg className="animate-spin w-4 h-4 text-gold ml-2 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {inputValue && !loading && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                onChange('', '');
                setSuggestions([]);
                setShowDropdown(false);
                inputRef.current?.focus();
              }}
              className="ml-2 text-gray-text hover:text-navy cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((result) => (
            <button
              key={result.place_id}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full text-left px-3 py-2.5 text-sm text-navy hover:bg-gold/5 cursor-pointer border-b border-gray-border/50 last:border-b-0 transition-colors"
            >
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-gold mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="leading-snug">{result.display_name}</span>
              </div>
            </button>
          ))}
          <div className="px-3 py-1.5 text-[10px] text-gray-text/60 bg-gray-bg/50">
            Powered by OpenStreetMap Nominatim
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}
