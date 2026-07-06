import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Registers Convex Auth's HTTP routes (token exchange, sign-in callbacks).
auth.addHttpRoutes(http);

export default http;
