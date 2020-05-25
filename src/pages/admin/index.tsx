import { withIronSession } from "next-iron-session";
import Link from "next/link";
import { IRON_SESSION_CONFIG } from "lib/ironSession";
import { Container, Toast, Button, Table } from "react-bootstrap";
import { useState } from "react";
import { ExperimentMetadata } from "lib/types";
import { useAxios } from "lib/useAxios";
import { downloadExperimentData } from "lib/downloadData";
import Axios from "axios";
import { useRouter } from "next/router";

export default function Admin() {
  const [showSaved, setShowSaved] = useState(false);
  const [experiments, setExperiments] = useState<ExperimentMetadata[]>([]);

  useAxios("/api/experiment", setExperiments, [setExperiments]);
  const router = useRouter();

  return (
    <>
      <Container className="mt-3">
        <Button
          className="mb-3"
          variant="success"
          onClick={async () => {
            const res = await Axios.post("/api/experiment");
            const id = res.data;
            router.push("/admin/experiment/[exId]", `/admin/experiment/${id}`);
          }}
        >
          <i className="fas fa-plus mr-2" />
          New Experiment
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nickname</th>
              <th>Participant Link</th>
              <th>Edit</th>
              <th>Download Data</th>
            </tr>
          </thead>
          <tbody>
            {experiments.map((e) => (
              <tr key={e.id}>
                <td>{e.nickname}</td>
                <td>
                  <Link href="/experiment/[exId]" as={`/experiment/${e.id}`}>
                    <a>Copy This Link Location</a>
                  </Link>
                </td>
                <td>
                  <Link
                    href="/admin/experiment/[exId]"
                    as={`/admin/experiment/${e.id}`}
                  >
                    <Button variant="primary">
                      <i className="fas fa-edit" />
                    </Button>
                  </Link>
                </td>
                <td>
                  <Button
                    variant="secondary"
                    onClick={() => downloadExperimentData(e.id)}
                  >
                    <i className="fas fa-download" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <Toast
        autohide
        delay={1500}
        onClose={() => setShowSaved(false)}
        show={showSaved}
        style={{ position: "fixed", right: 20, bottom: 20 }}
      >
        <Toast.Body>Saved experiment configuration!</Toast.Body>
      </Toast>
    </>
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
