// Generates the RS256 keypair Convex Auth needs and writes the two values to
// the scratch files passed as argv. Mirrors @convex-dev/auth's own CLI:
// JWT_PRIVATE_KEY is PKCS8 PEM with newlines collapsed to spaces; JWKS is the
// public JWK set. One-shot helper; not part of the app runtime.
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";
import { writeFileSync } from "node:fs";

const [privOut, jwksOut] = process.argv.slice(2);
const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = (await exportPKCS8(keys.privateKey)).trimEnd().replace(/\n/g, " ");
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

writeFileSync(privOut, privateKey);
writeFileSync(jwksOut, jwks);
console.log("wrote", privOut, "and", jwksOut);
