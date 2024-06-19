import NextAuth, { NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";
import KeycloakProvider from "next-auth/providers/keycloak";

const KEYCLOAK_CLIENT_ID = "only-store-001";
const KEYCLOAK_CLIENT_SECRET = "2czaN3m5aMI8N6OWmUR50KOrvKqW3kFs";
const KEYCLOAK_REALM = "admin";
const KEYCLOAK_URL = "http://localhost:8080/auth";

const KEYCLOAK_ISSUER = "http://localhost:8080/auth/realms/admin";

const keycloakConfig = {
    clientId: KEYCLOAK_CLIENT_ID,
    clientSecret: KEYCLOAK_CLIENT_SECRET,
    issuer: KEYCLOAK_ISSUER,
    } as const;

const providers: Provider[] = [
    KeycloakProvider(keycloakConfig),
];

const authOptions: NextAuthOptions = { providers };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
