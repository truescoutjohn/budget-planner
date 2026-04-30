import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prismaRepository from "@/utils/prismaRepository";

const providers = [];

providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await prismaRepository.findUser(credentials.email);

      if (!user) return null;

      const passwordsMatch = await bcrypt.compare(
        credentials.password,
        user.password,
      );

      if (!passwordsMatch) return null;

      return {
        id: credentials.email,
        email: credentials.email,
        name: credentials.email.split("@")[0] ?? credentials.email,
      };
    },
  }),
);

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
if (GITHUB_ID && GITHUB_SECRET) {
  providers.push(
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  );
}

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
if (GOOGLE_ID && GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  );
}

export const authOptions = {
  providers,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
