# ExampleIQ - Chauffeur Booking Form

A responsive booking form for airport transportation and limousine services, built with React, TypeScript, and Tailwind CSS.

## Features

- **Trip Type Selection** — One-way or Hourly booking
- **Location Autocomplete** — Powered by OpenStreetMap Nominatim (free, no API key)
- **Distance & Travel Time** — Calculated via OSRM routing engine (free, no API key)
- **Smart Phone Lookup** — Recognizes returning customers by phone number; greets them by name. Prompts new customers for contact details.
- **Form Validation** — All fields validated with clear error messages
- **Multi-stop Support** — Add intermediate stops between pickup and drop-off
- **Mock API Submission** — POSTs booking data to JSONPlaceholder
- **Responsive Design** — Mobile-first, works on all screen sizes

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- OpenStreetMap Nominatim (geocoding/autocomplete — free, no key)
- OSRM (routing/distance — free, no key)
- Optional: OpenRouteService (enhanced routing — free key, email signup only)
- `react-phone-number-input` for international phone formatting

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

That's it — **no API keys required**. Everything works out of the box.

### Optional: OpenRouteService Key

For enhanced routing, you can optionally add a free OpenRouteService key (email signup at [openrouteservice.org](https://openrouteservice.org)):

```bash
cp .env.example .env
# Edit .env and add: VITE_ORS_API_KEY=your_key
```

Without this key, the app uses OSRM for routing — also completely free.

## Mock Phone Numbers (for testing)

| Phone | Customer |
|-------|----------|
| +1 774 415 3244 | James Mitchell |
| +1 617 555 1234 | Sarah Chen |
| +1 508 555 9876 | Michael Rodriguez |
| +1 781 555 4321 | Emily Thompson |

Enter any other number to see the "new customer" contact fields.

## Project Structure

```
src/
├── components/
│   ├── BookingForm.tsx        # Main form with all logic
│   ├── FloatingInput.tsx      # Reusable floating-label input
│   ├── LocationTypeToggle.tsx # Location/Airport toggle
│   ├── Logo.tsx               # ExampleIQ brand logo
│   ├── PhoneInput.tsx         # International phone input
│   ├── PlacesAutocomplete.tsx # Nominatim autocomplete
│   ├── SuccessModal.tsx       # Post-submission confirmation
│   └── TripTypeToggle.tsx     # One-way/Hourly selector
├── utils/
│   ├── api.ts                 # Mock API + OSRM/ORS routing
│   ├── mockData.ts            # Known customers database
│   └── validation.ts          # Form validation rules
├── types.ts                   # TypeScript interfaces
├── App.tsx                    # Root component
└── main.tsx                   # Entry point
```

## Build

```bash
npm run build    # Production build → dist/
npm run preview  # Preview production build
```
