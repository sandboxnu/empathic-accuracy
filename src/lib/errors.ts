import Rollbar from "rollbar";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

// Rollbar for error logging + notifications
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// Make routes safe by catching and giving sane response + report to rolllbar
export function safe(route: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await route(req, res);
    } catch (err) {
      rollbar.error(err, req);
      console.error(err);
      const msg = `Something broke on our end. Please reach out to us immediately.`;
      res.status(500).send(msg);
    }
    // This probably shouldn't happen but make sure we don't ever leave requests hanging
    if (!res.finished) {
      rollbar.error("Handler did not send response and had to fallback", req);
      res.status(500).send("");
    }
  };
}
