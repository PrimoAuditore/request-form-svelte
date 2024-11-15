export interface Vehicle {
  brand: string;
  model: string;
  year: string;
  version: string;
}

export interface Part {
  category: string;
  subcategory: string;
  additionalInfo: string;
  images: string[];
}

export interface Contact {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  coordinates: [number, number];
}

export interface FormData {
  vehicle: Vehicle;
  part: Part;
  contact: Contact;
}
