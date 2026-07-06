import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

// Email + password auth (self-contained; no external OAuth secrets).
// `name` is collected at sign-up so proof decisions can be attributed to a
// real reviewer, per the PRD requirement for attributable actors.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          name: (params.name as string) ?? (params.email as string),
        };
      },
    }),
  ],
});
