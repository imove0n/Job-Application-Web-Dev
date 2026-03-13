export interface BookingFormData {
  tripType: 'one-way' | 'hourly';
  pickup: {
    date: string;
    time: string;
    locationType: 'location' | 'airport';
    address: string;
    placeId: string;
    lat?: string;
    lon?: string;
  };
  stops: {
    locationType: 'location' | 'airport';
    address: string;
    placeId: string;
    lat?: string;
    lon?: string;
  }[];
  dropoff: {
    locationType: 'location' | 'airport';
    address: string;
    placeId: string;
    lat?: string;
    lon?: string;
  };
  contact: {
    phone: string;
    firstName: string;
    lastName: string;
    email: string;
    isRecognized: boolean;
  };
  passengers: number;
}

export interface KnownCustomer {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface TripEstimate {
  distance: string;
  duration: string;
}
