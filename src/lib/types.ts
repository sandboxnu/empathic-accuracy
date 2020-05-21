import { NextApiRequest } from "next";
import { Session } from "next-iron-session";

export type NextApiRequestWithSess = NextApiRequest & { session: Session };
