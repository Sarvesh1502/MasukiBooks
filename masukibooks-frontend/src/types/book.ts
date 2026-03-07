export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  description: string;
  coverUrl: string;
  language: string;
  pages: number;
  isbn: string;
  publisher: string;
  stock: number;
  ratingAvg: number;
  ratingCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface BookInput {
  title: string;
  author: string;
  category: string;
  price: number;
  description: string;
  coverUrl: string;
  language?: string;
  pages?: number;
  isbn?: string;
  publisher?: string;
  stock?: number;
}

export interface CartItem {
  id: string;
  bookId: string;
  quantity: number;
  book?: Book;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  currency: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingCountry: string;
  shippingPhone: string;
  paymentMethod: string;
  paymentStatus: string;
  promoCode: string | null;
  discount: number;
  notes: string | null;
  createdAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  userName?: string;
}

export interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
}
