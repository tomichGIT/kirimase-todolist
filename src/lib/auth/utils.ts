/* eslint-disable */

import { db } from "@/lib/db/index";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { redirect } from "next/navigation";
import { env } from "@/lib/env.mjs";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
   interface Session {
      user: DefaultSession["user"] & {
         id: string;
      };
   }
}

export type AuthSession = {
   session: {
      user: {
         id: string;
         name?: string;
         email?: string;
      };
   } | null;
};

export const authOptions: NextAuthOptions = {
   adapter: PrismaAdapter(db) as any,
   callbacks: {
      session: ({ session, user }) => {
         session.user.id = user.id;
         return session;
      },
   },
   providers: [
      GoogleProvider({
         clientId: env.GOOGLE_CLIENT_ID,
         clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
      GithubProvider({
         clientId: env.GITHUB_CLIENT_ID,
         clientSecret: env.GITHUB_CLIENT_SECRET,
      }),
   ],
};

/*
desde un server component, puedo obtener los datos de sessión y enviarselo a un clien componente
ej: src/app/(app)/mascotas/page.tsx
uso:
  const { session } = await getUserAuth();
  <UserSettings session={session} />
 */

export const getUserAuth = async () => {
   const session = await getServerSession(authOptions);
   return { session } as AuthSession;
};

// comprueba si estoy logueado , si no te manda a login!
export const checkAuth = async () => {
   const { session } = await getUserAuth();
   if (!session) redirect("/api/auth/signin");
};
