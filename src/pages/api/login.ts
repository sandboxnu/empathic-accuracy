import { withIronSession } from "next-iron-session";
import bcrypt from "bcrypt";
import { NextApiResponse } from "next";
import { safe } from "../../lib/errors";
import { NextApiRequestWithSess } from "../../lib/types";
import { IRON_SESSION_CONFIG } from "../../lib/ironSession";

async function handler(req: NextApiRequestWithSess, res: NextApiResponse) {
  if (req.method === "POST") {
    const match = await bcrypt.compare(
      req.body.password,
      process.env.ADMIN_PASS_HASH
    );
    if (match) {
      req.session.set("user", {
        admin: true,
      });
      await req.session.save();
      res.status(200).send("Logged in");
    } else {
      res.status(401).send("");
    }
  } else {
    res.status(404).send("");
  }
}

export default safe(withIronSession(handler, IRON_SESSION_CONFIG));
