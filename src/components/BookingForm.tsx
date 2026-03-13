import { useState, useCallback, useEffect } from 'react';
import type { BookingFormData, TripEstimate, ValidationErrors } from '../types';
import { lookupPhone } from '../utils/mockData';
import { validateForm } from '../utils/validation';
import { submitBooking, calculateRoute } from '../utils/api';
import TripTypeToggle from './TripTypeToggle';
import LocationTypeToggle from './LocationTypeToggle';
import PlacesAutocomplete from './PlacesAutocomplete';
import PhoneInput from './PhoneInput';
import FloatingInput from './FloatingInput';
import SuccessModal from './SuccessModal';

const initialForm: BookingFormData = {
  tripType: 'one-way',
  pickup: { date: '', time: '', locationType: 'location', address: '', placeId: '' },
  stops: [],
  dropoff: { locationType: 'location', address: '', placeId: '' },
  contact: { phone: '', firstName: '', lastName: '', email: '', isRecognized: false },
  passengers: 1,
};

export default function BookingForm() {
  const [form, setForm] = useState<BookingFormData>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [phoneChecked, setPhoneChecked] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: number; estimate: TripEstimate | null } | null>(null);

  // Phone lookup with debounce
  useEffect(() => {
    if (!form.contact.phone || form.contact.phone.length < 10) {
      setPhoneChecked(false);
      setGreeting('');
      setForm((f) => ({
        ...f,
        contact: { ...f.contact, isRecognized: false, firstName: '', lastName: '', email: '' },
      }));
      return;
    }

    const timer = setTimeout(() => {
      const customer = lookupPhone(form.contact.phone);
      setPhoneChecked(true);
      if (customer) {
        setGreeting(customer.firstName);
        setForm((f) => ({
          ...f,
          contact: {
            ...f.contact,
            isRecognized: true,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
          },
        }));
      } else {
        setGreeting('');
        setForm((f) => ({
          ...f,
          contact: { ...f.contact, isRecognized: false },
        }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.contact.phone]);

  const addStop = useCallback(() => {
    setForm((f) => ({
      ...f,
      stops: [...f.stops, { locationType: 'location', address: '', placeId: '' }],
    }));
  }, []);

  const removeStop = useCallback((index: number) => {
    setForm((f) => ({
      ...f,
      stops: f.stops.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.querySelector(`[data-field="${firstErrorKey}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      // Calculate route using coordinates if available, fallback to address geocoding
      const originCoords = form.pickup.lat && form.pickup.lon
        ? { lat: form.pickup.lat, lon: form.pickup.lon }
        : null;
      const destCoords = form.dropoff.lat && form.dropoff.lon
        ? { lat: form.dropoff.lat, lon: form.dropoff.lon }
        : null;
      const estimate = await calculateRoute(
        originCoords,
        destCoords,
        form.pickup.address,
        form.dropoff.address
      );

      // Submit to mock API
      const result = await submitBooking(form, estimate);
      setSuccess({ id: result.id, estimate });
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ submit: 'Failed to submit booking. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
    setForm(initialForm);
    setPhoneChecked(false);
    setGreeting('');
    setErrors({});
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* Trip Type Toggle */}
        <TripTypeToggle
          value={form.tripType}
          onChange={(type) => setForm((f) => ({ ...f, tripType: type }))}
        />

        {/* ── Pickup Section ── */}
        <section>
          <h3 className="text-sm font-semibold text-navy mb-3 tracking-wide">Pickup</h3>

          {/* Date + Time row */}
          <div className="flex gap-3 mb-4" data-field="pickup.date">
            <FloatingInput
              label="Date"
              type="date"
              value={form.pickup.date}
              onChange={(e) =>
                setForm((f) => ({ ...f, pickup: { ...f.pickup, date: e.target.value } }))
              }
              error={errors['pickup.date']}
              className="flex-1"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <FloatingInput
              label="Time"
              type="time"
              value={form.pickup.time}
              onChange={(e) =>
                setForm((f) => ({ ...f, pickup: { ...f.pickup, time: e.target.value } }))
              }
              error={errors['pickup.time']}
              className="flex-1"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Location Type */}
          <LocationTypeToggle
            value={form.pickup.locationType}
            onChange={(type) =>
              setForm((f) => ({
                ...f,
                pickup: { ...f.pickup, locationType: type, address: '', placeId: '' },
              }))
            }
          />

          {/* Pickup Location */}
          <div data-field="pickup.address">
            <PlacesAutocomplete
              value={form.pickup.address}
              onChange={(address, placeId, lat, lon) =>
                setForm((f) => ({ ...f, pickup: { ...f.pickup, address, placeId, lat, lon } }))
              }
              locationType={form.pickup.locationType}
              placeholder="Enter pickup location"
              error={errors['pickup.address']}
            />
          </div>

          {/* Stops */}
          {form.stops.map((stop, index) => (
            <div key={index} className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-text font-medium">
                  Stop {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeStop(index)}
                  className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <LocationTypeToggle
                value={stop.locationType}
                onChange={(type) =>
                  setForm((f) => ({
                    ...f,
                    stops: f.stops.map((s, i) =>
                      i === index ? { ...s, locationType: type, address: '', placeId: '' } : s
                    ),
                  }))
                }
              />
              <PlacesAutocomplete
                value={stop.address}
                onChange={(address, placeId, lat, lon) =>
                  setForm((f) => ({
                    ...f,
                    stops: f.stops.map((s, i) =>
                      i === index ? { ...s, address, placeId, lat, lon } : s
                    ),
                  }))
                }
                locationType={stop.locationType}
                placeholder="Enter stop location"
              />
            </div>
          ))}

          {/* Add a stop */}
          <button
            type="button"
            onClick={addStop}
            className="mt-3 text-sm text-gold hover:text-gold-dark font-medium cursor-pointer flex items-center gap-1"
          >
            <span className="text-lg leading-none">+</span> Add a stop
          </button>
        </section>

        {/* ── Drop Off Section ── */}
        <section>
          <h3 className="text-sm font-semibold text-navy mb-3 tracking-wide">Drop off</h3>

          <LocationTypeToggle
            value={form.dropoff.locationType}
            onChange={(type) =>
              setForm((f) => ({
                ...f,
                dropoff: { ...f.dropoff, locationType: type, address: '', placeId: '' },
              }))
            }
          />

          <div data-field="dropoff.address">
            <PlacesAutocomplete
              value={form.dropoff.address}
              onChange={(address, placeId, lat, lon) =>
                setForm((f) => ({ ...f, dropoff: { ...f.dropoff, address, placeId, lat, lon } }))
              }
              locationType={form.dropoff.locationType}
              placeholder="Enter drop off location"
              error={errors['dropoff.address']}
            />
          </div>
        </section>

        {/* ── Contact Section ── */}
        <section>
          <h3 className="text-sm font-semibold text-navy mb-3 tracking-wide">
            Contact Information
          </h3>

          <div data-field="contact.phone">
            <PhoneInput
              value={form.contact.phone}
              onChange={(val) =>
                setForm((f) => ({ ...f, contact: { ...f.contact, phone: val } }))
              }
              error={errors['contact.phone']}
            />
          </div>

          {/* Greeting for recognized customer */}
          {phoneChecked && greeting && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                Welcome back, <strong>{greeting}</strong>!
              </p>
            </div>
          )}

          {/* Unrecognized phone — show additional fields */}
          {phoneChecked && !greeting && (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-gray-text italic">
                We don't have that phone number on file. Please provide additional contact
                information.
              </p>
              <div className="flex gap-3">
                <div data-field="contact.firstName" className="flex-1">
                  <FloatingInput
                    label="First name"
                    type="text"
                    value={form.contact.firstName}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        contact: { ...f.contact, firstName: e.target.value },
                      }))
                    }
                    placeholder="First name"
                    error={errors['contact.firstName']}
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  />
                </div>
                <div data-field="contact.lastName" className="flex-1">
                  <FloatingInput
                    label="Last name"
                    type="text"
                    value={form.contact.lastName}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        contact: { ...f.contact, lastName: e.target.value },
                      }))
                    }
                    placeholder="Last name"
                    error={errors['contact.lastName']}
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  />
                </div>
              </div>
              <div data-field="contact.email">
                <FloatingInput
                  label="Email"
                  type="email"
                  value={form.contact.email}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      contact: { ...f.contact, email: e.target.value },
                    }))
                  }
                  placeholder="name@example.com"
                  error={errors['contact.email']}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
              </div>
            </div>
          )}
        </section>

        {/* ── Passengers ── */}
        <section>
          <p className="text-sm text-navy mb-3">
            How many passengers are expected for the trip?
          </p>
          <div data-field="passengers">
            <FloatingInput
              label="# Passengers"
              type="number"
              min={1}
              max={20}
              value={form.passengers || ''}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  passengers: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="#"
              error={errors['passengers']}
              className="w-36"
              icon={<span className="text-xs font-bold text-gray-text">#</span>}
            />
          </div>
        </section>

        {/* Submit error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* ── Submit Button ── */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold hover:bg-gold-dark disabled:opacity-60 text-white font-semibold py-3.5 rounded-md transition-all duration-200 cursor-pointer text-base tracking-wide"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Continue'
          )}
        </button>
      </form>

      {/* Success Modal */}
      {success && (
        <SuccessModal
          bookingId={success.id}
          estimate={success.estimate}
          onClose={handleCloseSuccess}
        />
      )}
    </>
  );
}
