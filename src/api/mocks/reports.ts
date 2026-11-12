import { ApiError } from "@/api/errors";
import { MOCK_DURATION_MS, MOCK_UTTERANCE } from "@/api/mocks/utterance";
import { wait } from "@/api/mocks/wait";
import type {
  AttemptsResponse,
  AudioUrlResponse,
  FeedbackItem,
  FeedbackResponse,
  Overview,
  RecordingId,
  ReportStatus,
  ReportStatusResponse,
} from "@/api/types";

interface MockRecording {
  attempt_no: number;
  outcome: ReportStatus;
  failure?: { code: string };
  delayed?: boolean;
}

const MOCK_ANALYSIS_MS = 6000;

const MOCK_RECORDINGS: Record<string, MockRecording> = {
  1: { attempt_no: 1, outcome: "COMPLETED" },
  2: { attempt_no: 2, outcome: "COMPLETED", delayed: true },
  3: { attempt_no: 3, outcome: "FAILED", failure: { code: "NO_SPEECH" } },
};

const analysisStartedAt: Record<string, number> = {};

function findRecording(recordingId: RecordingId) {
  const recording = MOCK_RECORDINGS[recordingId];
  if (!recording) throw new ApiError(404, "RECORDING_NOT_FOUND");
  return recording;
}

function statusOf(recordingId: RecordingId): ReportStatus {
  const recording = findRecording(recordingId);
  if (!recording.delayed) return recording.outcome;

  analysisStartedAt[recordingId] ??= Date.now();
  const elapsed = Date.now() - analysisStartedAt[recordingId];
  if (elapsed < MOCK_ANALYSIS_MS / 3) return "PENDING";
  if (elapsed < MOCK_ANALYSIS_MS) return "ANALYZING";
  return recording.outcome;
}

function statusResponse(recordingId: RecordingId): ReportStatusResponse {
  const recording = findRecording(recordingId);
  const status = statusOf(recordingId);

  return {
    recording_id: Number(recordingId),
    status,
    practice_title: "카카오페이가 위챗페이처럼 자리잡지 못한 이유",
    recorded_at: new Date().toISOString(),
    attempt_no: recording.attempt_no,
    duration_ms: MOCK_DURATION_MS,
    failure: status === "FAILED" ? recording.failure : null,
    warnings: [],
  };
}

async function completedReport(recordingId: RecordingId) {
  await wait();
  if (statusOf(recordingId) !== "COMPLETED") throw new ApiError(409, "REPORT_NOT_COMPLETED");
}

function feedbackItem(
  item: Omit<FeedbackItem, "quote" | "start_idx" | "end_idx">,
  [startIdx, endIdx]: [number, number],
): FeedbackItem {
  return {
    ...item,
    quote: MOCK_UTTERANCE.spoken_text.slice(startIdx, endIdx + 1).replace(/\n/g, " "),
    start_idx: startIdx,
    end_idx: endIdx,
  };
}

const MOCK_OVERVIEW: Overview = {
  summary: { headline: "호흡은 안정적이었어요.", footer: "이제 중요한 말을 천천히 전해보세요." },
  speed: { fast: 3, normal: 10, slow: 1, measured: 14 },
  habits: [
    { type: "MID_STRETCH", count: 3 },
    { type: "END_RISE", count: 2 },
  ],
};

const MOCK_FEEDBACK: FeedbackResponse = {
  items: [
    feedbackItem(
      {
        rank: 1,
        title: "근거 부분 천천히 말하기",
        body: "중국 사례를 설명하는 구절이 평소보다 빨랐어요. 쉼표마다 숨을 한 번 고르고 말해 보세요.",
        start_ms: 37200,
        end_ms: 40500,
        kind: "PACE",
      },
      [222, 250],
    ),
    feedbackItem(
      {
        rank: 2,
        title: "중간에 늘이지 않기",
        body: "‘큰’ 소리가 길게 늘어졌어요. 다음 말을 고를 시간이 필요하면 늘이지 말고 잠깐 멈춰 보세요.",
        start_ms: 29760,
        end_ms: 33365,
        kind: "MID_STRETCH",
      },
      [174, 194],
    ),
    feedbackItem(
      {
        rank: 3,
        title: "문장 끝 내려서 맺기",
        body: "‘인데요’에서 끝이 올라가 질문처럼 들렸어요. 마지막 글자를 낮게 내려 말해 보세요.",
        start_ms: 55110,
        end_ms: 56820,
        kind: "END_RISE",
      },
      [340, 349],
    ),
  ],
};

export async function getAttempts(): Promise<AttemptsResponse> {
  await wait();
  return {
    attempts: Object.entries(MOCK_RECORDINGS).map(([recordingId, { attempt_no }]) => ({
      recording_id: Number(recordingId),
      attempt_no,
      recorded_at: new Date().toISOString(),
      status: statusOf(recordingId),
    })),
  };
}

export async function startAnalysis(recordingId: RecordingId) {
  await wait();
  return statusResponse(recordingId);
}

export async function getStatus(recordingId: RecordingId) {
  await wait();
  return statusResponse(recordingId);
}

export async function getOverview(recordingId: RecordingId) {
  await completedReport(recordingId);
  return MOCK_OVERVIEW;
}

export async function getUtterance(recordingId: RecordingId) {
  await completedReport(recordingId);
  return MOCK_UTTERANCE;
}

export async function getFeedback(recordingId: RecordingId) {
  await completedReport(recordingId);
  return MOCK_FEEDBACK;
}

export async function getAudioUrl(): Promise<AudioUrlResponse> {
  await wait();
  throw new ApiError(404, "AUDIO_FILE_NOT_FOUND");
}
