import type { CartItem, Book } from "../types/book";
import { isSupabaseConfigured, supabase } from "./supabase";

// In-memory cart for when Supabase isn't available or user isn't logged in
let localCart: CartItem[] = [];

export async function fetchCart(userId: string): Promise<CartItem[]> {
  if (!isSupabaseConfigured || userId.startsWith("demo-")) {
    return localCart;
  }

  let data: Record<string, unknown>[] | null = null;
  try {
    const result = await supabase
      .from("cart_items")
      .select("*, books(*)")
      .eq("user_id", userId);
    if (result.error) throw result.error;
    data = result.data as Record<string, unknown>[] | null;
  } catch (err) {
    console.warn("Cart fetch error, using local:", err);
    return localCart;
  }

  return (data ?? []).map((row: Record<string, unknown>) => {
    const bookData = row.books as Record<string, unknown> | null;
    const book: Book | undefined = bookData
      ? {
          id: String(bookData.id ?? ""),
          title: String(bookData.title ?? ""),
          author: String(bookData.author ?? ""),
          category: String(bookData.category ?? "General"),
          price: Number(bookData.price ?? 0),
          description: String(bookData.description ?? ""),
          coverUrl: String(bookData.cover_url ?? ""),
          language: String(bookData.language ?? "English"),
          pages: Number(bookData.pages ?? 0),
          isbn: String(bookData.isbn ?? ""),
          publisher: String(bookData.publisher ?? ""),
          stock: Number(bookData.stock ?? 999),
          ratingAvg: Number(bookData.rating_avg ?? 0),
          ratingCount: Number(bookData.rating_count ?? 0),
          isActive: bookData.is_active !== false,
          createdAt: String(bookData.created_at ?? ""),
        }
      : undefined;

    return {
      id: String(row.id ?? ""),
      bookId: String(row.book_id ?? ""),
      quantity: Number(row.quantity ?? 1),
      book,
    };
  });
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
  userId: string,
  bookId: string,
  quantity: number = 1,
  book?: Book
): Promise<void> {
  if (!isSupabaseConfigured || userId.startsWith("demo-")) {
    addToLocalCart(bookId, quantity, book);
    return;
  }

  try {
    // Check if item already exists to increment
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: (existing as { quantity: number }).quantity + quantity })
        .eq("user_id", userId)
        .eq("book_id", bookId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("cart_items")
        .insert({ user_id: userId, book_id: bookId, quantity });
      if (error) throw error;
    }
  } catch (err) {
    console.warn("Supabase addToCart failed, using local cart:", err);
    addToLocalCart(bookId, quantity, book);
  }
}

export async function updateCartQuantity(
  userId: string,
  bookId: string,
  quantity: number
): Promise<void> {
  if (!isSupabaseConfigured || userId.startsWith("demo-")) {
    const item = localCart.find((i) => i.bookId === bookId);
    if (item) item.quantity = quantity;
    return;
  }

  try {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", userId)
      .eq("book_id", bookId);
    if (error) throw error;
  } catch (err) {
    console.warn("Supabase updateCartQuantity failed, using local:", err);
    const item = localCart.find((i) => i.bookId === bookId);
    if (item) item.quantity = quantity;
  }
}

export async function removeFromCart(
  userId: string,
  bookId: string
): Promise<void> {
  localCart = localCart.filter((i) => i.bookId !== bookId);
  if (!isSupabaseConfigured || userId.startsWith("demo-")) return;

  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("book_id", bookId);
    if (error) throw error;
  } catch (err) {
    console.warn("Supabase removeFromCart failed, using local:", err);
  }
}

export async function clearCart(userId: string): Promise<void> {
  localCart = [];
  if (!isSupabaseConfigured || userId.startsWith("demo-")) return;

  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);
    if (error) throw error;
  } catch (err) {
    console.warn("Supabase clearCart failed, using local:", err);
  }
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => {
    const price = item.book?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);
}
