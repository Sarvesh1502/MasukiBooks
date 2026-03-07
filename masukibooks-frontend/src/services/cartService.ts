import type { CartItem, Book } from "../types/book";
import api, { type ApiResponse } from "./api";

// ── Backend response shape ────────────────────────────────────
interface CartItemResponse {
  cartItemId: string;
  productId: string;
  productTitle: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  inStock: boolean;
}

interface CartResponse {
  cartId: string;
  items: CartItemResponse[];
  subtotal: number;
  totalItems: number;
}

// ── Local in-memory cart (fallback when backend unreachable) ──
let localCart: CartItem[] = [];

function mapCartItem(item: CartItemResponse): CartItem {
  return {
    id: item.cartItemId,
    bookId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    lineTotal: item.lineTotal,
    book: {
      id: item.productId,
      title: item.productTitle ?? "",
      author: "",
      category: "General",
      price: item.unitPrice ?? 0,
      description: "",
      coverUrl: item.productImageUrl ?? "",
      language: "English",
      pages: 0,
      isbn: "",
      publisher: "",
      stock: item.inStock ? 999 : 0,
      ratingAvg: 0,
      ratingCount: 0,
      isActive: true,
      createdAt: "",
    },
  };
}

// ── Public API ────────────────────────────────────────────────

export async function fetchCart(_userId: string): Promise<CartItem[]> {
  try {
    const { data } = await api.get<ApiResponse<CartResponse>>("/cart");
    return (data.data.items ?? []).map(mapCartItem);
  } catch (err) {
    console.warn("Cart fetch error, using local:", err);
    return localCart;
  }
}

function addToLocalCart(bookId: string, quantity: number, book?: Book) {
  const existing = localCart.find((item) => item.bookId === bookId);
  if (existing) {
    existing.quantity += quantity;
    if (book) existing.book = book;
  } else {
    localCart.push({ id: `local-${Date.now()}`, bookId, quantity, book });
  }
}

export async function addToCart(
  _userId: string,
  bookId: string,
  quantity: number = 1,
  book?: Book
): Promise<void> {
  try {
    await api.post("/cart/items", { productId: bookId, quantity });
  } catch (err) {
    console.warn("Backend addToCart failed, using local cart:", err);
    addToLocalCart(bookId, quantity, book);
  }
}

export async function updateCartQuantity(
  _userId: string,
  bookId: string,
  quantity: number
): Promise<void> {
  try {
    // Find the cart item ID from current cart
    const { data } = await api.get<ApiResponse<CartResponse>>("/cart");
    const item = data.data.items?.find((i) => i.productId === bookId);
    if (item) {
      await api.put(`/cart/items/${item.cartItemId}`, { quantity });
    }
  } catch (err) {
    console.warn("Backend updateCartQuantity failed, using local:", err);
    const item = localCart.find((i) => i.bookId === bookId);
    if (item) item.quantity = quantity;
  }
}

export async function removeFromCart(
  _userId: string,
  bookId: string
): Promise<void> {
  localCart = localCart.filter((i) => i.bookId !== bookId);
  try {
    const { data } = await api.get<ApiResponse<CartResponse>>("/cart");
    const item = data.data.items?.find((i) => i.productId === bookId);
    if (item) {
      await api.delete(`/cart/items/${item.cartItemId}`);
    }
  } catch (err) {
    console.warn("Backend removeFromCart failed, using local:", err);
  }
}

export async function clearCart(_userId: string): Promise<void> {
  localCart = [];
  try {
    await api.delete("/cart");
  } catch (err) {
    console.warn("Backend clearCart failed:", err);
  }
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => {
    const price = item.unitPrice ?? item.book?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);
}
