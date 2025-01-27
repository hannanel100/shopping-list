import { NextAuth } from "@repo/auth";
import { authConfig } from "@/lib/auth";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
