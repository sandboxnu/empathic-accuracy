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

async function put(req: NextApiRequestWithSess, res: NextApiResponse) {
  const newConfig = req.body as ExperimentDataEntry;
  const exId = parseInt(req.query.exId as string);
  await putDataEntry(exId, newConfig);
  res.status(201).end();
}

async function get(
  req: NextApiRequestWithSess,
  res: NextApiResponse<ExperimentData>
) {
  const exId = parseInt(req.query.exId as string);
  const config = await getAllData(exId);
  if (config !== undefined) {
    res.status(200).send(config);
  } else {
    res.status(404).end();
  }
}

async function handler(req: NextApiRequestWithSess, res: NextApiResponse) {
  if (req.method === "POST") {
    await put(req, res);
  } else if (req.method === "GET") {
    const user = req.session.get("user");
    if (user && user.admin) {
      await get(req, res);
    } else {
      res.status(401).send("unauthorized");
    }
  }
}

export default withIronSession(safe(handler), IRON_SESSION_CONFIG);
