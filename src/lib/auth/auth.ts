import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // In a real app, you would query your database here
          // This is just a mock implementation

          // User credentials
          if (
            credentials?.email === "user@medicova.com" &&
            credentials?.password === "user123"
          ) {
            return {
              id: "1",
              name: "Regular User",
              email: "user@medicova.com",
              role: "user",
              image:
                "https://img.freepik.com/premium-photo/female-entrepreneur-wearing-suit-white-background_1029679-97782.jpg",
              phone: "01024243243",
            };
          }

          // Seller credentials
          if (
            credentials?.email === "seller@medicova.com" &&
            credentials?.password === "seller123"
          ) {
            return {
              id: "2",
              name: "Seller Account",
              email: "seller@medicova.com",
              role: "seller",
              image:
                "https://img.freepik.com/free-photo/young-beautiful-woman-looking-camera-trendy-girl-casual-summer-white-t-shirt-jeans-shorts-positive-female-shows-facial-emotions-funny-model-isolated-yellow_158538-15796.jpg?t=st=1756648911~exp=1756652511~hmac=d6a21ff899cc4ed8378cd493fa5a66ec94c6b0544472c0fe7d5088becdadcc67&w=1480",
              phone: "01024243243",
            };
          }
          // Admin credentials
          if (
            credentials?.email === "admin@medicova.com" &&
            credentials?.password === "admin123"
          ) {
            return {
              id: "3",
              name: "admin Account",
              email: "admin@medicova.com",
              role: "admin",
              image:
                "https://img.freepik.com/free-photo/man-wearing-t-shirt-gesturing_23-2149393645.jpg",
              phone: "01024243243",
            };
          }

          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role; // Using 'role' instead of 'type' for better semantics
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
