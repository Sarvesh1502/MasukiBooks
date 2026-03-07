import type { Book, BookInput } from "../types/book";
import { isSupabaseConfigured, supabase } from "./supabase";

type BookRow = Record<string, unknown>;

const fallbackBooks: Book[] = [
  {
    id: "sample-1",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Growth",
    price: 499,
    description: "Build small habits that compound into remarkable results.",
    coverUrl: "",
    language: "English",
    pages: 320,
    isbn: "978-0735211292",
    publisher: "Avery",
    stock: 50,
    ratingAvg: 4.5,
    ratingCount: 120,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    price: 459,
    description: "Train your focus to produce high-value work.",
    coverUrl: "",
    language: "English",
    pages: 296,
    isbn: "978-1455586691",
    publisher: "Grand Central",
    stock: 35,
    ratingAvg: 4.3,
    ratingCount: 85,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

function getFirstString(row: BookRow, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return "";
}

function getFirstNumber(row: BookRow, keys: string[]): number {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
}

function getFirstBoolean(row: BookRow, keys: string[], fallback: boolean): boolean {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "boolean") return value;
  }
  return fallback;
}

function mapBook(row: BookRow): Book {
  return {
    id: getFirstString(row, ["id", "book_id", "uuid"]),
    title: getFirstString(row, ["title", "name", "book_title"]),
    author: getFirstString(row, ["author", "writer", "author_name"]),
    category: getFirstString(row, ["category", "genre", "book_category"]) || "General",
    price: getFirstNumber(row, ["price", "amount", "book_price"]),
    description: getFirstString(row, ["description", "summary", "book_description"]),
    coverUrl: getFirstString(row, ["cover_url", "coverUrl", "image_url", "image", "thumbnail"]),
    language: getFirstString(row, ["language", "lang"]) || "English",
    pages: getFirstNumber(row, ["pages", "page_count"]),
    isbn: getFirstString(row, ["isbn", "isbn_13"]),
    publisher: getFirstString(row, ["publisher", "publishing_house"]),
    stock: getFirstNumber(row, ["stock", "inventory", "quantity"]) || 999,
    ratingAvg: getFirstNumber(row, ["rating_avg", "ratingAvg", "average_rating"]),
    ratingCount: getFirstNumber(row, ["rating_count", "ratingCount", "total_ratings"]),
    isActive: getFirstBoolean(row, ["is_active", "isActive", "active"], true),
    createdAt: getFirstString(row, ["created_at", "createdAt", "published_at"]),
  };
}

export async function fetchBooks(): Promise<Book[]> {
  if (!isSupabaseConfigured) {
    return fallbackBooks;
  }

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    const fallbackQuery = await supabase.from("books").select("*");

    if (fallbackQuery.error || !fallbackQuery.data) {
      return fallbackBooks;
    }

    return fallbackQuery.data.map((row) => mapBook(row as BookRow));
  }

  if (!data) {
    return fallbackBooks;
  }

  return data.map((row) => mapBook(row as BookRow));
}

async function insertBookWithFallback(payload: BookInput): Promise<void> {
  const candidates = [
    {
      title: payload.title,
      author: payload.author,
      category: payload.category,
      price: payload.price,
      description: payload.description,
      cover_url: payload.coverUrl,
      language: payload.language ?? "English",
      pages: payload.pages ?? 0,
      isbn: payload.isbn ?? "",
      publisher: payload.publisher ?? "",
      stock: payload.stock ?? 999,
    },
    {
      name: payload.title,
      writer: payload.author,
      genre: payload.category,
      amount: payload.price,
      summary: payload.description,
      image_url: payload.coverUrl,
    },
  ];

  let lastError = "Unable to create book.";

  for (const candidate of candidates) {
    const { error } = await supabase.from("books").insert(candidate);
    if (!error) {
      return;
    }
    lastError = error.message;
  }

  throw new Error(lastError);
}

export async function createBook(payload: BookInput): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  await insertBookWithFallback(payload);
}

async function updateBookWithFallback(id: string, payload: BookInput): Promise<void> {
  const candidates = [
    {
      matchKey: "id",
      values: {
        title: payload.title,
        author: payload.author,
        category: payload.category,
        price: payload.price,
        description: payload.description,
        cover_url: payload.coverUrl,
        language: payload.language ?? "English",
        pages: payload.pages ?? 0,
        isbn: payload.isbn ?? "",
        publisher: payload.publisher ?? "",
        stock: payload.stock ?? 999,
      },
    },
    {
      matchKey: "book_id",
      values: {
        name: payload.title,
        writer: payload.author,
        genre: payload.category,
        amount: payload.price,
        summary: payload.description,
        image_url: payload.coverUrl,
      },
    },
  ];

  let lastError = "Unable to update book.";

  for (const candidate of candidates) {
    const { error } = await supabase
      .from("books")
      .update(candidate.values)
      .eq(candidate.matchKey, id);

    if (!error) {
      return;
    }

    lastError = error.message;
  }

  throw new Error(lastError);
}

export async function updateBook(
  id: string,
  payload: BookInput
): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  await updateBookWithFallback(id, payload);
}

async function deleteBookWithFallback(id: string): Promise<void> {
  const keys = ["id", "book_id"];
  let lastError = "Unable to delete book.";

  for (const key of keys) {
    const { error } = await supabase.from("books").delete().eq(key, id);
    if (!error) {
      return;
    }
    lastError = error.message;
  }

  throw new Error(lastError);
}

export async function deleteBook(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  await deleteBookWithFallback(id);
}
