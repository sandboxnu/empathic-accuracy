import { AnswerSetWithMetadata } from "lib/types";

type SaveData = (
  a: AnswerSetWithMetadata[],
  d: { videoWidth: number; videoHeight: number }
) => void;

export type OnDone = SaveData;
export type SavePartialData = SaveData;
