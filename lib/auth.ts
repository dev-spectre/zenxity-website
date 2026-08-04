import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { comparePassword, ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/auth-utils";
import { createUserRecord, findUserByEmail, updateUserRecord } from "@/lib/auth-fallback";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toString();
        const password = credentials.password.toString();

        const user = await findUserByEmail(email);

        if (!user) return null; // No user found
        if (!user.password) return null; // OAuth only account

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profilePicture,
        };
      },
    }),
    Credentials({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Admin Email", type: "email" },
        password: { label: "Admin Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        if (
          credentials.email === ADMIN_EMAIL &&
          credentials.password === ADMIN_PASSWORD
        ) {
          // Ensure admin user exists in DB so foreign keys (like FarmingRequest) work
          let adminUser = await findUserByEmail(ADMIN_EMAIL as string);
          if (!adminUser) {
            adminUser = await createUserRecord({
              name: "Admin",
              email: ADMIN_EMAIL as string,
              isVerified: true,
              role: "admin",
            });
          }
          return { id: adminUser.id, name: "Admin", email: ADMIN_EMAIL, role: "admin" } as any;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const email = user.email!;
          let existingUser = await findUserByEmail(email);

          if (existingUser) {
            if (!existingUser.googleId) {
              await updateUserRecord(existingUser.id, {
                googleId: account.providerAccountId,
                profilePicture: user.image,
              });
            }
          } else {
            existingUser = await createUserRecord({
              name: user.name || "Google User",
              email: email,
              googleId: account.providerAccountId,
              profilePicture: user.image,
              isVerified: true,
            });
          }
          return true;
        } catch (error: any) {
          console.error("Google signin error", error);
          return `/login?error=${encodeURIComponent(error.message || "Failed to sign in via Google")}`;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const email = user.email!;
          const existingUser = await findUserByEmail(email);
          if (existingUser) {
            token.id = existingUser.id;
          } else {
            token.id = user.id;
          }
        } else {
          token.id = user.id;
        }
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
