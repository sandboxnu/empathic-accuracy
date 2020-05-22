import { withIronSession } from "next-iron-session";
import { NextApiResponse } from "next";
import { safe } from "lib/errors";
import { NextApiRequestWithSess, ExperimentConfig } from "lib/types";
import { IRON_SESSION_CONFIG } from "lib/ironSession";
import { getConfig, setConfig } from "lib/db";

async function set(req: NextApiRequestWithSess, res: NextApiResponse) {
  const newConfig = req.body as ExperimentConfig;
  const exId = parseInt(req.query.exId as string);
  await setConfig(exId, newConfig);
  res.status(201).end();
}

async function get(req: NextApiRequestWithSess, res: NextApiResponse) {
  const exId = parseInt(req.query.exId as string);
  const config = await getConfig(exId);
  if (config !== undefined) {
    res.status(200).send(config);
  } else {
    res.status(404).end();
  }
}

async function handler(req: NextApiRequestWithSess, res: NextApiResponse) {
  if (req.method === "POST") {
    const user = req.session.get("user");
    if (user && user.admin) {
      await set(req, res);
    } else {
      res.status(401).send("unauthorized");
    }
  } else if (req.method === "GET") {
    await get(req, res);
  }
}

export default withIronSession(safe(handler), IRON_SESSION_CONFIG);
