import type { Review } from "../types/book";
import { isSupabaseConfigured, supabase } from "./supabase";

export async function fetchReviewsForBook(
  bookId: string
): Promise<Review[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("book_id", bookId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Reviews fetch error:", error.message);
    return [];
  }

  return (data ?? []).map(mapReview);
}

export async function fetchAllReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("All reviews fetch error:", error.message);
    return [];
  }

  return (data ?? []).map(mapReview);
}

export async function createReview(
  userId: string,
  bookId: string,
  rating: number,
  comment: string
): Promise<Review> {
  if (!isSupabaseConfigured) {
    return {
      id: `rev-${Date.now()}`,
      userId,
      bookId,
      rating,
      comment,
      isApproved: true,
      createdAt: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      user_id: userId,
      book_id: bookId,
      rating,
      comment,
      is_approved: true,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create review");
  }

  return mapReview(data);
}

export async function deleteReview(reviewId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function toggleReviewApproval(
  reviewId: string,
  isApproved: boolean
): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: isApproved })
    .eq("id", reviewId);

  if (error) {
    throw new Error(error.message);
  }
}

function mapReview(row: Record<string, unknown>): Review {
  const profile = row.profiles as Record<string, unknown> | null;
  return {
    id: String(row.id ?? ""),
    userId: String(row.user_id ?? ""),
    bookId: String(row.book_id ?? ""),
    rating: Number(row.rating ?? 0),
    comment: String(row.comment ?? ""),
    isApproved: row.is_approved !== false,
    createdAt: String(row.created_at ?? ""),
    userName: profile ? String(profile.full_name ?? "Anonymous") : "Anonymous",
  };
}
