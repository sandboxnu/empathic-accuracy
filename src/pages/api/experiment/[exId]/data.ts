import { withIronSession } from "next-iron-session";
import { NextApiResponse } from "next";
import { safe } from "lib/errors";
import {
  NextApiRequestWithSess,
  ExperimentDataEntry,
  ExperimentData,
} from "lib/types";
import { IRON_SESSION_CONFIG } from "lib/ironSession";
import { putDataEntry, getAllData } from "lib/db";

// Submit a new data entry for a participant
async function post(req: NextApiRequestWithSess, res: NextApiResponse) {
  const newConfig = req.body as ExperimentDataEntry;
  const exId = parseInt(req.query.exId as string);
  await putDataEntry(exId, newConfig);
  res.status(201).end();
}

// Get all the data from an experiment
async function get(
  req: NextApiRequestWithSess,
  res: NextApiResponse<ExperimentData>
) {
  const exId = parseInt(req.query.exId as string);
  const config = await getAllData(exId);
  if (config !== undefined) {
    res.status(200).json(config);
  } else {
    res.status(200).json([]);
  }
}

async function handler(req: NextApiRequestWithSess, res: NextApiResponse) {
  if (req.method === "POST") {
    await post(req, res);
  } else if (req.method === "GET") {
    const user = req.session.get("user");
    if (user && user.admin) {
      await get(req, res);
    } else {
      res.status(401).send("unauthorized");
    }
  }
}

export default safe(withIronSession(handler, IRON_SESSION_CONFIG));
