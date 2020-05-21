import dotenv from "dotenv";
dotenv.config();
import { SessionOptions } from "next-iron-session";

export const IRON_SESSION_CONFIG: SessionOptions = {
  password: process.env.ADMIN_KEY,
  cookieName: "sandbox/challenge-admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
