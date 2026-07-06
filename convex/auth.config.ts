// Convex Auth issues its own JWTs signed with JWT_PRIVATE_KEY; the application
// id is "convex" and the issuer domain is the deployment's own site URL.
const authConfig = {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
