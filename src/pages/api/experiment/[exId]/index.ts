import { withIronSession } from "next-iron-session";
import { NextApiResponse } from "next";
import { safe } from "lib/errors";
import { NextApiRequestWithSess, ExperimentConfig } from "lib/types";
import { IRON_SESSION_CONFIG } from "lib/ironSession";
import { getExperiment, setExperiment } from "lib/db";

export interface SetExperimentParams {
  nickname: string;
  config: ExperimentConfig;
}
// Overwrite the config for an experiment
async function set(req: NextApiRequestWithSess, res: NextApiResponse) {
  const newExp = req.body as SetExperimentParams;
  const exId = req.query.exId as string;
  await setExperiment(exId, newExp.nickname, newExp.config);
  res.status(201).end();
}

export interface GetExperimentResponse {
  id: string;
  nickname: string;
  config: ExperimentConfig;
}
// Get the config for an experiment
async function get(req: NextApiRequestWithSess, res: NextApiResponse) {
  const exId = req.query.exId as string;
  const config: GetExperimentResponse | undefined = await getExperiment(exId);
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

export default safe(withIronSession(handler, IRON_SESSION_CONFIG));
