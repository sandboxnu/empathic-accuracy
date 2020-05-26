import dotenv from "dotenv";
dotenv.config();
import { SessionOptions } from "next-iron-session";

if (process.env.ADMIN_KEY === undefined) {
  console.error("ENV: ADMIN_KEY is not defined");
}
export const IRON_SESSION_CONFIG: SessionOptions = {
  password: process.env.ADMIN_KEY,
  cookieName: "sandbox/challenge-admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
