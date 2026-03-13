import type { KnownCustomer } from '../types';

// Mock database of known phone numbers
export const knownCustomers: KnownCustomer[] = [
  {
    phone: '+17744153244',
    firstName: 'James',
    lastName: 'Mitchell',
    email: 'james.mitchell@email.com',
  },
  {
    phone: '+16175551234',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@email.com',
  },
  {
    phone: '+15085559876',
    firstName: 'Michael',
    lastName: 'Rodriguez',
    email: 'm.rodriguez@email.com',
  },
  {
    phone: '+17815554321',
    firstName: 'Emily',
    lastName: 'Thompson',
    email: 'emily.t@email.com',
  },
];

export function lookupPhone(phone: string): KnownCustomer | null {
  // Normalize: strip spaces, dashes, parens
  const normalized = phone.replace(/[\s\-()]/g, '');
  return knownCustomers.find((c) => c.phone === normalized) ?? null;
}
