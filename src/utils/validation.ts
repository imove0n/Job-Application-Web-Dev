import type { BookingFormData, ValidationErrors } from '../types';
import { isValidPhoneNumber } from 'react-phone-number-input';

export function validateForm(data: BookingFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Pickup date
  if (!data.pickup.date) {
    errors['pickup.date'] = 'Pickup date is required';
  } else {
    const selected = new Date(data.pickup.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      errors['pickup.date'] = 'Date cannot be in the past';
    }
  }

  // Pickup time
  if (!data.pickup.time) {
    errors['pickup.time'] = 'Pickup time is required';
  }

  // Pickup address
  if (!data.pickup.address) {
    errors['pickup.address'] = 'Pickup location is required';
  }

  // Dropoff address
  if (!data.dropoff.address) {
    errors['dropoff.address'] = 'Drop off location is required';
  }

  // Phone
  if (!data.contact.phone) {
    errors['contact.phone'] = 'Phone number is required';
  } else if (!isValidPhoneNumber(data.contact.phone)) {
    errors['contact.phone'] = 'Please enter a valid phone number';
  }

  // If phone not recognized, require name + email
  if (!data.contact.isRecognized) {
    if (!data.contact.firstName.trim()) {
      errors['contact.firstName'] = 'First name is required';
    }
    if (!data.contact.lastName.trim()) {
      errors['contact.lastName'] = 'Last name is required';
    }
    if (!data.contact.email.trim()) {
      errors['contact.email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) {
      errors['contact.email'] = 'Please enter a valid email';
    }
  }

  // Passengers
  if (!data.passengers || data.passengers < 1) {
    errors['passengers'] = 'At least 1 passenger is required';
  } else if (data.passengers > 20) {
    errors['passengers'] = 'Maximum 20 passengers';
  }

  return errors;
}
