import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DUMMY_CREDENTIALS } from "@/constants";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        if (
          email === DUMMY_CREDENTIALS.email &&
          password === DUMMY_CREDENTIALS.password
        ) {
          return {
            id: DUMMY_CREDENTIALS.userId,
            email: DUMMY_CREDENTIALS.email,
            name: DUMMY_CREDENTIALS.name,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If url is relative (starts with /), keep it relative
      if (url.startsWith("/")) return url;
      // If url is on the same origin as the deployment, allow it
      try {
        const parsedUrl = new URL(url);
        const parsedBase = new URL(baseUrl);
        if (parsedUrl.origin === parsedBase.origin) return url;
        // Otherwise, return just the pathname to avoid cross-origin redirects
        // (e.g., prevents redirect to localhost when NEXTAUTH_URL is misconfigured)
        return parsedUrl.pathname || "/";
      } catch {
        return "/";
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
