import { NextApiRequest } from "next";
import { Session } from "next-iron-session";

export type NextApiRequestWithSess = NextApiRequest & { session: Session };

export type ExperimentConfig = TrialBlockConfig;

export interface TrialBlockConfig {
  questions: any[];
  shuffleVideos: boolean;
  shuffleQuestions: boolean;
  instructionScreens: string[];
  instructionsOverlay: string;
  paradigm: "consensus" | "self" | "continuous";
  videos: { id: string; timepoints: number[] }[];
}

export type ExperimentData = ExperimentDataEntry[];
export interface ExperimentDataEntry {
  videoWidth: number;
  videoHeight: number;
  browserWidth: number;
  browserHeight: number;
  totalDuration: number;
  subjectID: string;
  answers: VideoToAnswerSet;
}
export interface VideoToAnswerSet {
  [vidId: string]: AnswerSetWithMetadata[];
}
export interface AnswerSetWithMetadata extends AnswerSet {
  questionTime?: number;
  timestamp?: number;
}

export interface AnswerSet {
  [questionId: number]: Answer;
}

export type Answer = { x: number; y: number } | string;
