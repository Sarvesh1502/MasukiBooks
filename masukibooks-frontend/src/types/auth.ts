export type AppRole = "user" | "admin";

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
  phone?: string;
  avatarUrl?: string;
}
