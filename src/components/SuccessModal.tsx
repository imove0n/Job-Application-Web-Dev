import type { TripEstimate } from '../types';

interface Props {
  bookingId: number;
  estimate: TripEstimate | null;
  onClose: () => void;
}

export default function SuccessModal({ bookingId, estimate, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center animate-[fadeIn_0.3s_ease]">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-heading text-2xl font-semibold text-navy mb-2">
          Booking Submitted!
        </h2>
        <p className="text-gray-text text-sm mb-4">
          Your reservation (ID: #{bookingId}) has been received.
        </p>
        {estimate && (
          <div className="bg-gray-bg rounded-lg p-4 mb-6">
            <p className="text-sm text-navy font-medium mb-1">Trip Estimate</p>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-gray-text">
                Distance: <strong className="text-navy">{estimate.distance}</strong>
              </span>
              <span className="text-gray-text">
                Duration: <strong className="text-navy">{estimate.duration}</strong>
              </span>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="w-full bg-gold hover:bg-gold-dark text-white font-medium py-3 rounded-md transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
