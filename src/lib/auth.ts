import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dns from "node:dns";

// Fix DNS SRV lookup on local Windows dev where default ISP DNS does not resolve mongodb+srv records
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {
    // Ignore in restricted environments
  }
}

const rawUri = process.env.BETTER_AUTH_DB_URL || process.env.MONGODB_URI || "";
const mongoUri = rawUri.trim().replace(/^["']|["']$/g, "");

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: MongoClient | undefined;
}

if (!global._mongoClientPromise) {
  global._mongoClientPromise = new MongoClient(
    mongoUri || "mongodb://localhost:27017/booknook_db",
    {
      connectTimeoutMS: 8000,
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
      retryWrites: true,
    }
  );
}

const client = global._mongoClientPromise;
const db = client.db("booknook_db");

export { db, client };

const getBaseURL = () => {
  if (process.env.NODE_ENV === "production") {
    if (process.env.BETTER_AUTH_URL && process.env.BETTER_AUTH_URL.startsWith("https://")) {
      return process.env.BETTER_AUTH_URL;
    }
    return "https://cat-ron.vercel.app";
  }
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "booknook_better_auth_secret_key_2026",
  baseURL: getBaseURL(),
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://cat-ron.vercel.app",
    getBaseURL(),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
});
