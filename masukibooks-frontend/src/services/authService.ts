import type { Session } from "@supabase/supabase-js";
import type { AppRole, AppUser } from "../types/auth";
import { isSupabaseConfigured, supabase } from "./supabase";

type ProfileRow = Record<string, unknown>;

function parseRole(value: string | null | undefined): AppRole {
  return value === "admin" ? "admin" : "user";
}

function getMetadataString(
  metadata: Record<string, unknown>,
  key: string
): string {
  const value = metadata[key];

  return typeof value === "string" ? value : "";
}

function getStringFromAny(
  source: Record<string, unknown> | undefined,
  keys: string[]
): string {
  if (!source) {
    return "";
  }

  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return "";
}

function getRoleFromAny(source: Record<string, unknown> | undefined): AppRole {
  if (!source) {
    return "user";
  }

  const roleText = getStringFromAny(source, ["role", "user_role", "type"]);

  if (roleText.toLowerCase() === "admin") {
    return "admin";
  }

  const isAdmin = source.is_admin;
  if (typeof isAdmin === "boolean") {
    return isAdmin ? "admin" : "user";
  }

  return "user";
}

async function getProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function mapSessionToAppUser(
  session: Session | null
): Promise<AppUser | null> {
  if (!session?.user) {
    return null;
  }

  const metadata = session.user.user_metadata;
  const profile = await getProfile(session.user.id);

  return {
    id: session.user.id,
    email: session.user.email ?? "",
    fullName:
      getStringFromAny(profile ?? undefined, ["full_name", "name", "username"]) ||
      getMetadataString(metadata, "full_name") ||
      getMetadataString(metadata, "name") ||
      "",
    role: parseRole(
      getRoleFromAny(profile ?? undefined) === "admin"
        ? "admin"
        : getRoleFromAny(metadata) === "admin"
        ? "admin"
        : "user"
    ),
  };
}

async function upsertProfileWithPhone(
  userId: string,
  fullName: string,
  phone: string
): Promise<void> {
  const payloadCandidates: Array<Record<string, unknown>> = [
    { id: userId, full_name: fullName, role: "user", phone },
    { id: userId, full_name: fullName, role: "user", phone_number: phone },
    { id: userId, name: fullName, user_role: "user", phone },
    { id: userId, name: fullName, user_role: "user", phone_number: phone },
    { id: userId, full_name: fullName, phone },
    { id: userId, name: fullName, phone },
  ];

  for (const payload of payloadCandidates) {
    const { error } = await supabase.from("profiles").upsert(payload);
    if (!error) {
      return;
    }
  }
}

export async function getCurrentUser(): Promise<AppUser | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return mapSessionToAppUser(data.session);
}

export async function signIn(email: string, password: string): Promise<AppUser> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env."
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const appUser = await mapSessionToAppUser(data.session);

  if (!appUser) {
    throw new Error("Unable to resolve logged in user.");
  }

  return appUser;
}

export async function signUp(
  fullName: string,
  email: string,
  password: string,
  phone: string
): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env."
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "user",
        phone,
      },
      emailRedirectTo: window.location.origin + "/login",
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.user) {
    await upsertProfileWithPhone(data.user.id, fullName, phone);
  }
}

/** Sends a 6-digit OTP to the email via Supabase. Silently ignores errors for demo mode. */
export async function sendEmailOtpSupabase(email: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
  } catch {
    // ignore – demo mode will show code on screen
  }
}

/** Verifies a Supabase email OTP. Returns true on success. */
export async function verifyEmailOtpSupabase(
  email: string,
  token: string
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    return !error;
  } catch {
    return false;
  }
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export function subscribeToAuthChanges(
  callback: (user: AppUser | null) => void
): () => void {
  if (!isSupabaseConfigured) {
    return () => undefined;
  }

  const { data } = supabase.auth.onAuthStateChange((_, session) => {
    void mapSessionToAppUser(session).then((user) => {
      callback(user);
    });
  });

  return () => {
    data.subscription.unsubscribe();
  };
}
