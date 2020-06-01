import { NextApiRequest } from "next";
import { Session } from "next-iron-session";

export type NextApiRequestWithSess = NextApiRequest & { session: Session };

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
  | ConsensusParadigmTrialBlockConfig
  | ContinuousParadigmTrialBlockConfig;

export type Paradigm = "consensus" | "self" | "continuous";
interface BaseTrialBlockConfig {
  shuffleVideos: boolean;
  paradigm: Paradigm;
  videos: { id: string; timepoints: number[] }[];
  questions?: Question[];
  shuffleQuestions?: boolean;
  instructions: TrialInstructions;
  testTrial: {
    enabled: boolean;
    failMessage?: string;
    tryAgainMessage?: string;
  };
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
  testTrial:
    | {
        enabled: false;
      }
    | {
        enabled: true;
        tryAgainMessage: string;
        failMessage: string;
        minSegments: number;
        maxTries: number;
      };
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
  testTrial:
    | {
        enabled: false;
      }
    | {
        enabled: true;
        tryAgainMessage: string;
        failMessage: string;
        maxSeconds: number;
        maxTries: number;
      };
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
export type GridAnswer = { x: number; y: number };

//================== Frontend Only ====================
export interface QuestionBaseProp {
  id: string;
}
