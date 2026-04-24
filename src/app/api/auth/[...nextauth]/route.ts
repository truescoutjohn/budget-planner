import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

const providers = []

const GITHUB_ID = process.env.GITHUB_ID
const GITHUB_SECRET = process.env.GITHUB_SECRET
if (GITHUB_ID && GITHUB_SECRET) {
  providers.push(
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  )
}

const GOOGLE_ID = process.env.GOOGLE_ID
const GOOGLE_SECRET = process.env.GOOGLE_SECRET
if (GOOGLE_ID && GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  )
}

export const authOptions = {
  providers,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
