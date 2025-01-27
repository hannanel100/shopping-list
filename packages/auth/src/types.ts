import 'next-auth';
import { User } from '@repo/database';

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

export interface AuthConfig {
  providers: any[];
  secret?: string;
  debug?: boolean;
}
