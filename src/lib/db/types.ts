export type Role = "USER" | "VENDOR" | "ADMIN";
export type ReservationStatus = "NEW" | "CONFIRMED" | "DELIVERED";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
  technicalNo?: string;
  imageUrl?: string;
  vendorId: string;
  vendorName?: string;
  vendorCity?: string;
  vehicleIds: string[];
}

export interface Vendor {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface Reservation {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  phone: string;
  quantity: number;
  status: ReservationStatus;
  createdAt: string;
}

export interface SearchSuggestion {
  text: string;
  type: "product" | "category" | "vehicle";
}
