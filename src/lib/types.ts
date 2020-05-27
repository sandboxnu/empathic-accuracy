import { NextApiRequest } from "next";
import { Session } from "next-iron-session";

export type NextApiRequestWithSess = NextApiRequest & { session: Session };

// ================ Experiment Config ======================
export type ExperimentMetadata = {
  id: string;
  nickname: string;
};

export type ExperimentConfig = TrialBlockConfig;

export type TrialBlockConfig =
  | SelfParadigmTrialBlockConfig
  | ConsensusParadigmTrialBlockConfig
  | ContinuousParadigmTrialBlockConfig;

interface BaseTrialBlockConfig {
  shuffleVideos: boolean;
  paradigm: "consensus" | "self" | "continuous";
  videos: { id: string; timepoints: number[] }[];
  questions?: Question[];
  shuffleQuestions?: boolean;
  instructions: TrialInstructions;
}

export interface TrialInstructions {
  instructionScreens: string[];
  instructionsOverlay: string;
  pauseInstructions?: string;
}

export interface SelfParadigmTrialBlockConfig extends BaseTrialBlockConfig {
  paradigm: "self";
  questions: Question[];
  shuffleQuestions: boolean;
}

export interface ConsensusParadigmTrialBlockConfig
  extends BaseTrialBlockConfig {
  paradigm: "consensus";
  questions: Question[];
  shuffleQuestions: boolean;
}

export interface ContinuousParadigmTrialBlockConfig
  extends BaseTrialBlockConfig {
  paradigm: "continuous";
}

export type Question = MCQuestion | ScaleQuestion | OpenQuestion | GridQuestion;

interface BaseQuestion {
  label: string;
}
export interface MCQuestion extends BaseQuestion {
  type: "mc";
  choices: string[];
}
export interface ScaleQuestion extends BaseQuestion {
  type: "scale";
  choices: string[];
}
export interface OpenQuestion extends BaseQuestion {
  type: "open";
}
export interface GridQuestion extends BaseQuestion {
  type: "grid";
}

// ================ Experiment Collected Data ======================

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

export type Answer = GridAnswer | string;
export type GridAnswer = { x: number; y: number };

//================== Frontend Only ====================
export interface QuestionBaseProp {
  id: string;
}
