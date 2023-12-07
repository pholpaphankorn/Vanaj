import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"


const authOptions = {
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    }),
  ],

callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
        const isAllowedToSignIn = profile.email === process.env.ADMIN_EMAIL
        if (isAllowedToSignIn) {
            return true
        } else {
            // Return false to display a default error message
            return false
        }
    }
}
}
const handler=NextAuth(authOptions)
export { handler as GET, handler as POST};



