export interface Address {
  _id: string;
  name: string;

  street: string;
  area: string;

  city: string;
  state: string;
  country: string;
  pinCode: string;

  latitude: number;
  longitude: number;

  isPrimary: boolean;
}

export interface StoreForm {
  email: string;
  // Email contact document ID
  emailId: string;
  mailContactId: string;

  storeName: string;
  category: string;
  gstNumber: string;

  address: {
    addressId: string;
    area: string;
    city: string;
  };

  workingDays: {
    from: string;
    to: string;
  };

  openingHours: {
    from: string;
    to: string;
  };

  document1: File | null;
  document2: File | null;
}