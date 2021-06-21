import { getByKey, getExperiments, putDataEntry } from "lib/db";
import { safe } from "lib/errors";
import { IRON_SESSION_CONFIG } from "lib/ironSession";
import { ExperimentData, NextApiRequestWithSess } from "lib/types";
import { NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";

type OldDBData = {
  id: string;
  subjectData: ExperimentData;
};

async function convertExperimentData(id: string) {
  console.log(`converting ${id}`);
  const data = await getByKey<OldDBData>(`DATA-${id}`);
  if (data) {
    await Promise.all(
      data.subjectData.map(async (d) => await putDataEntry(id, d))
    );
  }
}

async function handler(req: NextApiRequestWithSess, res: NextApiResponse) {
  if (req.method === "GET") {
    const user = req.session.get("user");
    if (user && user.admin) {
      const experiments = await getExperiments();
      for (const experiment of experiments) {
        await convertExperimentData(experiment.id);
      }
      res.status(200).end();
    } else {
      res.status(401).send("unauthorized");
    }
  }
}

export default safe(withIronSession(handler, IRON_SESSION_CONFIG));
