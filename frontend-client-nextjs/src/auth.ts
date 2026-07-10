import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const getKeycloakIssuer = () => {
  const envIssuer = process.env.KEYCLOAK_ISSUER || process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
  if (envIssuer && !envIssuer.includes(':8080')) {
    return envIssuer.replace(/\/+$/, '');
  }
  return 'http://localhost:8088/realms/super-petmark-3d';
};

const getKeycloakClientSecret = () => {
  const envSecret = process.env.KEYCLOAK_CLIENT_SECRET;
  if (envSecret && envSecret !== 'user-service-secret') {
    return envSecret;
  }
  return 'FGMD5FRv6U68WA9yOYSAqaTTBquZHoGC';
};

async function refreshAccessToken(token: any) {
  try {
    const issuer = getKeycloakIssuer();

    const bodyParams: Record<string, string> = {
      client_id: process.env.KEYCLOAK_CLIENT_ID || 'user-service',
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
      client_secret: getKeycloakClientSecret(),
    };

    const response = await fetch(`${issuer}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(bodyParams),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.warn('Keycloak session expired or refresh token inactive:', error);
    return {
      ...token,
      accessToken: undefined,
      refreshToken: undefined,
      expiresAt: 0,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || 'petzone_super_secret_session_token_key_2026_dev_keycloak',
  trustHost: true,
  providers: [
    Credentials({
      id: 'keycloak-credentials',
      name: 'Keycloak OIDC Direct',
      credentials: {
        username: { label: 'Tên đăng nhập hoặc Email', type: 'text' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const issuer = getKeycloakIssuer();
        const clientId = process.env.KEYCLOAK_CLIENT_ID || 'user-service';
        const clientSecret = getKeycloakClientSecret();

        try {
          // Send Direct Grant OIDC request to Keycloak token endpoint
          const bodyParams: Record<string, string> = {
            grant_type: 'password',
            client_id: clientId,
            username: credentials.username as string,
            password: credentials.password as string,
            scope: 'openid profile email',
            client_secret: clientSecret,
          };

          const response = await fetch(`${issuer}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(bodyParams),
          });

          const data = await response.json();

          if (!response.ok || !data.access_token) {
            console.warn('Keycloak Direct Grant authentication failed:', data);
            return null;
          }

          // Fetch user profile from Keycloak userinfo endpoint via OIDC
          let userInfo = {
            id: 'user-' + Date.now(),
            name: credentials.username as string,
            email: (credentials.username as string).includes('@')
              ? (credentials.username as string)
              : `${credentials.username}@petzone.local`,
          };

          try {
            const userinfoRes = await fetch(
              `${issuer}/protocol/openid-connect/userinfo`,
              {
                headers: {
                  Authorization: `Bearer ${data.access_token}`,
                },
              }
            );

            if (userinfoRes.ok) {
              const kcUser = await userinfoRes.json();
              userInfo = {
                id: kcUser.sub || userInfo.id,
                name:
                  kcUser.name ||
                  kcUser.preferred_username ||
                  (credentials.username as string),
                email: kcUser.email || userInfo.email,
              };
            }
          } catch (e) {
            // Use fallback userInfo if userinfo endpoint fails
          }

          return {
            ...userInfo,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: Math.floor(Date.now() / 1000 + (data.expires_in || 300)),
          };
        } catch (err: any) {
          console.error('Keycloak OIDC login error:', err?.message || err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.expiresAt = (user as any).expiresAt;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        token.error = undefined;
        return token;
      }

      // If already encountered a refresh error, do not call Keycloak again
      if (token.error === 'RefreshAccessTokenError') {
        return token;
      }

      // Check if access token is still valid
      if (token.expiresAt && Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // Access token expired, rotate with refresh token
      if (token.refreshToken) {
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error === 'RefreshAccessTokenError') {
        return {
          ...session,
          user: undefined,
          accessToken: undefined,
          error: 'RefreshAccessTokenError',
        } as any;
      }

      (session as any).accessToken = token.accessToken as string;
      if (token.user) {
        session.user = {
          ...session.user,
          ...(token.user as any),
        };
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
