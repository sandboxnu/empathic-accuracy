import React from "react";
import { useRouter } from "next/router";
import ExperimentConfigurator from "components/admin/ExperimentConfigurator";

export default function ExperimentPage() {
  const router = useRouter();
  const experimentId = router.query.exId as string | undefined;

  return (
    <>
      {experimentId !== undefined && (
        <ExperimentConfigurator experimentId={experimentId} />
      )}
    </>
  );
}
