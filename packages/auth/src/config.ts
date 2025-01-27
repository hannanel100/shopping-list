import { AuthOptions } from 'next-auth';
import { AuthConfig } from './types';

export const createAuthConfig = (config: AuthConfig): AuthOptions => {
  return {
    providers: config.providers,
    secret: config.secret,
    debug: config.debug,
    session: {
      strategy: 'jwt',
    },
    callbacks: {
      session: async ({ session, token }) => {
        if (session.user) {
          session.user.id = token.sub!;
        }
        return session;
      },
    },
  };
};
