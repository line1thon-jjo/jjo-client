import type { components } from "@/api/schema";

type Schemas = components["schemas"];

export type ReportStatus = Schemas["ReportStatus"];
export type ReportStatusResponse = Schemas["ReportStatusResponse"];
export type AttemptsResponse = Schemas["AttemptsResponse"];
export type Overview = Schemas["Overview"];
export type UtteranceAnalysis = Schemas["UtteranceAnalysis"];
export type FeedbackResponse = Schemas["FeedbackResponse"];
export type FeedbackItem = Schemas["FeedbackItem"];
export type AudioUrlResponse = Schemas["AudioUrlResponse"];
export type Agreements = Schemas["Agreements"];
export type Practice = Schemas["PracticeResponse"];
export type Recording = Schemas["RecordingResponse"];
export type ScriptUpload = Schemas["ScriptUploadResponse"];

export type NextStep = "terms" | "onboarding" | "practices";

export interface User {
  id: number;
  name: string;
  email: string;
  profile_image_url: string | null;
  onboarding_completed: boolean;
}

export interface Session {
  user: User;
  next_step: NextStep;
}

export interface AuthenticatedResponse extends Session {
  status: "authenticated";
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}

export interface SignupRequiredResponse {
  status: "signup_required";
  next_step: "terms";
  signup_token: string;
  signup_token_expires_in: number;
}

export type GoogleLoginResponse = AuthenticatedResponse | SignupRequiredResponse;

export interface RequestOptions {
  signal?: AbortSignal;
}

export type RecordingId = number | string;
