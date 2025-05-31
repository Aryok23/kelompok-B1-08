import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
const BACKEND_URL = process.env.BACKEND_URL 
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
  async signIn({ user, account }) {
    if (account?.provider === "google") {
      await fetch(`${BACKEND_URL}/api/auth/register_google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          nama: user.name,
          oauth_id: account.providerAccountId, // penting untuk identifikasi user
          oauth_provider: "google",
          role_users: "kandidat", // sesuaikan tergantung use case kamu
        }),
      });
    }
    
    return true;
  }, 
  async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard` // ← redirect ke dashboard setelah login
    }
},

  pages: {
    signIn: "/login", // custom login page kamu
  },
})

export { handler as GET, handler as POST }
