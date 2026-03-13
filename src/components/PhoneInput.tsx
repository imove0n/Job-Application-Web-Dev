import PhoneNumberInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function PhoneInput({ value, onChange, error }: Props) {
  return (
    <div>
      <div
        className={`border rounded-md px-3 py-3 transition-colors ${
          error ? 'border-red-400' : 'border-gray-border focus-within:border-gold'
        }`}
      >
        <PhoneNumberInput
          international
          defaultCountry="US"
          value={value}
          onChange={(val) => onChange(val || '')}
          placeholder="+1 000 000 0000"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}
