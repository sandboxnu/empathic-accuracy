import { NextApiRequest } from "next";
import { IronSession } from "iron-session";

interface User {
  admin: boolean;
}
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
export type NextApiRequestWithSess = NextApiRequest & { session: IronSession };

// ================ Experiment Config ======================
export type ExperimentMetadata = {
  id: string;
  nickname: string;
};

export type ExperimentConfig = {
  trialBlocks: TrialBlockConfig[];
  shuffleTrialBlocks: boolean;
};

export type TrialBlockConfig =
  | SelfParadigmTrialBlockConfig
  | TimestampParadigmTrialBlockConfig
  | ConsensusParadigmTrialBlockConfig
  | ContinuousParadigmTrialBlockConfig;

export type Paradigm = "consensus" | "self" | "continuous" | "timestamp";
interface BaseTrialBlockConfig<T extends BaseTestTrial = BaseTestTrial> {
  shuffleVideos: boolean;
  paradigm: Paradigm;
  videos: { id: string; timepoints: number[] }[];
  questions?: Question[];
  shuffleQuestions?: boolean;
  instructions: TrialInstructions;
  testTrial: T | { enabled: false };
}

type BaseTestTrial = {
  enabled: true;
  video: { id: string; timepoints: number[] };
  successMessage: string;
  failMessage: string;
  tryAgainMessage: string;
};

export interface TrialInstructions {
  instructionScreens: string[];
  instructionsOverlay: string;
  pauseInstructions?: string;
}

export interface SelfParadigmTrialBlockConfig
  extends BaseTrialBlockConfig<SelfTestTrial> {
  paradigm: "self";
  questions: Question[];
  shuffleQuestions: boolean;
}

export interface TimestampParadigmTrialBlockConfig
  extends BaseTrialBlockConfig<SelfTestTrial> {
  paradigm: "timestamp";
  timestampPrompt: TimestampPrompt;
}

export interface TimestampPrompt {
  buttonInstructions: string;
  buttonText: string;
 }

interface SelfTestTrial extends BaseTestTrial {
  minSegments: number;
  maxTries: number;
}

export interface ConsensusParadigmTrialBlockConfig
  extends BaseTrialBlockConfig {
  paradigm: "consensus";
  questions: Question[];
  shuffleQuestions: boolean;
}

export interface ContinuousParadigmTrialBlockConfig
  extends BaseTrialBlockConfig<ContinuousTestTrial> {
  paradigm: "continuous";
  grid: ContinuousGridConfig;
}

export type ContinuousGridConfig =
  | {
    label: string;
    dimensions: 1;
    axis: GridAxisLabel;
  }
  | {
    label: string;
    dimensions: 2;
    xAxis: GridAxisLabel;
    yAxis: GridAxisLabel;
  };

interface ContinuousTestTrial extends BaseTestTrial {
  maxSeconds: number;
  maxTries: number;
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

export interface GridAxisLabel {
  high: string;
  low: string;
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
  trialBlocks: ExperimentDataTrialBlock[];
}

export interface ExperimentDataTrialBlock {
  answers: VideoToAnswerSet;
  paradigm: Paradigm;
}
export interface VideoToAnswerSet {
  [vidId: string]: AnswerSetWithMetadata[];
}
export interface AnswerSetWithMetadata extends AnswerSet {
  questionTime?: number;
  timestamp: number;
}

export interface AnswerSet {
  [questionId: number]: Answer;
}

export type Answer = GridAnswer | string;
export type GridAnswer = { x: number; y?: number };

//================== Frontend Only ====================
export interface QuestionBaseProp {
  id: string;
}
