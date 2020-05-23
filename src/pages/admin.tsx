import { withIronSession } from "next-iron-session";
import { IRON_SESSION_CONFIG } from "../lib/ironSession";
import ExperimentConfigurator from "../components/admin/ExperimentConfigurator";

export default function Admin() {
  return (
    <div className="App">
      <ExperimentConfigurator experimentId={1} />
    </div>
  );
}
export const getServerSideProps = withIronSession(async function ({
  req,
  res,
}) {
  const user = req.session.get("user");
  if (user && user.admin) {
    return { props: {} };
  } else {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
},
IRON_SESSION_CONFIG);
