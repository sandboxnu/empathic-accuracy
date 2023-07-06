import Rollbar from "rollbar";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

// Rollbar for error logging + notifications
export const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_TOKEN,
  environment: process.env.VERCEL_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
});
export function rollbarWait() {
  return new Promise<void>((resolve) => {
    rollbar.wait(resolve);
  });
}

// Make routes safe by catching and giving sane response + report to rolllbar
export function safe(route: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await route(req, res);
    } catch (err: any) {
      rollbar.error(err, req);
      await rollbarWait();
      console.error(err);
      const msg = `Something broke on our end. Please reach out to us immediately.`;
      res.status(500).send(msg);
    }
    await rollbarWait();
  };
}
