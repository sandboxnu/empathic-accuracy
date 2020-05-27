import { withIronSession } from "next-iron-session";
import { NextApiResponse } from "next";
import { safe } from "lib/errors";
import { NextApiRequestWithSess } from "lib/types";
import { IRON_SESSION_CONFIG } from "lib/ironSession";
import { getExperiments, createExperiment } from "lib/db";

// Create a new template experiment with placeholder name and config
// Send back the id
async function post(req: NextApiRequestWithSess, res: NextApiResponse) {
  const id = await createExperiment();
  res.status(201).send(id);
}

// get all the experiments' metadata
async function get(req: NextApiRequestWithSess, res: NextApiResponse) {
  const experiments = await getExperiments();
  res.status(200).send(experiments);
}

async function handler(req: NextApiRequestWithSess, res: NextApiResponse) {
  const user = req.session.get("user");
  if (user && user.admin) {
    if (req.method === "POST") {
      await post(req, res);
    } else if (req.method === "GET") {
      await get(req, res);
    }
  } else {
    res.status(401).send("unauthorized");
  }
}

export default safe(withIronSession(handler, IRON_SESSION_CONFIG));
