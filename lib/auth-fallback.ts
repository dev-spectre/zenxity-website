import fs from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  mobileNumber?: string | null;
  profilePicture?: string | null;
  googleId?: string | null;
  isVerified?: boolean;
  role?: string;
};

const fallbackFilePath = path.join(process.cwd(), ".auth-users.json");
const fallbackUsers = new Map<string, StoredUser>();
let hasLoadedFallbackUsers = false;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function ensureFallbackUsersLoaded() {
  if (hasLoadedFallbackUsers) return;

  try {
    const raw = await fs.readFile(fallbackFilePath, "utf8");
    const parsed = JSON.parse(raw) as Record<string, StoredUser>;
    for (const [email, user] of Object.entries(parsed)) {
      fallbackUsers.set(email, user);
    }
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      console.warn("Failed to read fallback auth store", error);
    }
  }

  hasLoadedFallbackUsers = true;
}

async function persistFallbackUsers() {
  await fs.mkdir(path.dirname(fallbackFilePath), { recursive: true });
  await fs.writeFile(fallbackFilePath, JSON.stringify(Object.fromEntries(fallbackUsers.entries()), null, 2), "utf8");
}

function toStoredUser(user: Partial<StoredUser> & { email: string; name: string }) {
  return {
    id: user.id ?? `fallback-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    name: user.name,
    email: normalizeEmail(user.email),
    password: user.password ?? null,
    mobileNumber: user.mobileNumber ?? null,
    profilePicture: user.profilePicture ?? null,
    googleId: user.googleId ?? null,
    isVerified: user.isVerified ?? false,
    role: user.role ?? "user",
  };
}

export async function findUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  await ensureFallbackUsersLoaded();

  const fallbackUser = fallbackUsers.get(normalizedEmail);
  if (fallbackUser) {
    return fallbackUser;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (user) {
      return user;
    }
  } catch (error) {
    console.warn("Prisma lookup failed, using fallback auth store", error);
  }

  return fallbackUser ?? null;
}

export async function createUserRecord(data: Partial<StoredUser> & { email: string; name: string }) {
  const normalizedEmail = normalizeEmail(data.email);
  const user = toStoredUser({ ...data, email: normalizedEmail });
  await ensureFallbackUsersLoaded();
  fallbackUsers.set(normalizedEmail, user);
  await persistFallbackUsers();

  try {
    const created = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password ?? undefined,
        mobileNumber: user.mobileNumber ?? undefined,
        profilePicture: user.profilePicture ?? undefined,
        googleId: user.googleId ?? undefined,
        isVerified: user.isVerified ?? undefined,
      },
    });
    const storedUser: StoredUser = {
      id: created.id,
      name: created.name,
      email: normalizeEmail(created.email),
      password: created.password ?? null,
      mobileNumber: created.mobileNumber ?? null,
      profilePicture: created.profilePicture ?? null,
      googleId: created.googleId ?? null,
      isVerified: created.isVerified,
      role: user.role ?? "user",
    };
    fallbackUsers.set(normalizedEmail, storedUser);
    await persistFallbackUsers();
    return storedUser;
  } catch (error) {
    console.warn("Prisma create failed, using fallback auth store", error);
    return user;
  }
}

export async function updateUserRecord(id: string, data: Partial<StoredUser>) {
  await ensureFallbackUsersLoaded();

  try {
    const updated = await prisma.user.update({ where: { id }, data });
    return updated;
  } catch (error) {
    console.warn("Prisma update failed, using fallback auth store", error);
    const existing = Array.from(fallbackUsers.values()).find((entry) => entry.id === id);
    if (existing) {
      const updated = {
        ...existing,
        ...data,
        email: normalizeEmail(data.email ?? existing.email),
      };
      fallbackUsers.set(updated.email, updated);
      await persistFallbackUsers();
      return updated;
    }
    return null;
  }
}
