import { ApiError } from "@/api/errors";
import { MOCK_UTTERANCE } from "@/api/mocks/utterance";
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
  practice_id: number;
  attempt_no: number;
  recorded_at: string;
  duration_ms: number;
  outcome: ReportStatus;
  delayed?: boolean;
  failure?: { code: string };
  warnings?: string[];
  overview?: Overview;
  feedback?: FeedbackResponse;
}

const MOCK_ANALYSIS_MS = 6000;
const HOUR_MS = 60 * 60 * 1000;

const MOCK_PRACTICE_TITLES: Record<number, string> = {
  1: "카카오페이와 위챗페이 비교",
  2: "동아리 신입 모집 발표",
};

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * HOUR_MS).toISOString();
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

const PACE_FEEDBACK = feedbackItem(
  {
    rank: 1,
    title: "근거 부분 천천히 말하기",
    body: "중국 사례를 설명하는 구절이 평소보다 빨랐어요. 쉼표마다 숨을 한 번 고르고 말해 보세요.",
    start_ms: 37200,
    end_ms: 40500,
    kind: "PACE",
  },
  [222, 250],
);

const STRETCH_FEEDBACK = feedbackItem(
  {
    rank: 2,
    title: "중간에 늘이지 않기",
    body: "‘큰’ 소리가 길게 늘어졌어요. 다음 말을 고를 시간이 필요하면 늘이지 말고 잠깐 멈춰 보세요.",
    start_ms: 29760,
    end_ms: 33365,
    kind: "MID_STRETCH",
  },
  [174, 194],
);

const RISE_FEEDBACK = feedbackItem(
  {
    rank: 3,
    title: "문장 끝 내려서 맺기",
    body: "‘인데요’에서 끝이 올라가 질문처럼 들렸어요. 마지막 글자를 낮게 내려 말해 보세요.",
    start_ms: 55110,
    end_ms: 56820,
    kind: "END_RISE",
  },
  [340, 349],
);

function ranked(items: FeedbackItem[]): FeedbackResponse {
  return { items: items.map((item, index) => ({ ...item, rank: index + 1 })) };
}

const MOCK_RECORDINGS: Record<string, MockRecording> = {
  1: {
    practice_id: 1,
    attempt_no: 1,
    recorded_at: hoursAgo(26),
    duration_ms: 53000,
    outcome: "COMPLETED",
    overview: {
      summary: { headline: "끝맺음이 자주 올라갔어요.", footer: "문장 끝을 낮게 내려 말해 보세요." },
      speed: { fast: 5, normal: 7, slow: 2, measured: 14 },
      habits: [
        { type: "END_RISE", count: 4 },
        { type: "MID_STRETCH", count: 3 },
        { type: "MID_PAUSE", count: 2 },
      ],
    },
    feedback: ranked([RISE_FEEDBACK, PACE_FEEDBACK, STRETCH_FEEDBACK]),
  },
  2: {
    practice_id: 1,
    attempt_no: 2,
    recorded_at: hoursAgo(2),
    duration_ms: 61000,
    outcome: "COMPLETED",
    warnings: ["PITCH_UNAVAILABLE"],
    overview: {
      summary: { headline: "호흡은 안정적이었어요.", footer: "이제 중요한 말을 천천히 전해보세요." },
      speed: { fast: 3, normal: 10, slow: 1, measured: 14 },
      habits: [
        { type: "MID_STRETCH", count: 3 },
        { type: "END_RISE", count: 2 },
      ],
    },
    feedback: ranked([PACE_FEEDBACK, STRETCH_FEEDBACK]),
  },
  3: {
    practice_id: 1,
    attempt_no: 3,
    recorded_at: hoursAgo(0.05),
    duration_ms: 58000,
    outcome: "COMPLETED",
    delayed: true,
    overview: {
      summary: { headline: "속도가 고르게 잡혔어요.", footer: "‘큰’처럼 늘어지는 소리만 다듬어 보세요." },
      speed: { fast: 1, normal: 12, slow: 1, measured: 14 },
      habits: [{ type: "MID_STRETCH", count: 2 }],
    },
    feedback: ranked([STRETCH_FEEDBACK]),
  },
  4: {
    practice_id: 2,
    attempt_no: 1,
    recorded_at: hoursAgo(5),
    duration_ms: 4000,
    outcome: "FAILED",
    failure: { code: "NO_SPEECH" },
  },
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
    practice_title: MOCK_PRACTICE_TITLES[recording.practice_id],
    recorded_at: recording.recorded_at,
    attempt_no: recording.attempt_no,
    duration_ms: recording.duration_ms,
    failure: status === "FAILED" ? recording.failure : null,
    warnings: status === "COMPLETED" ? (recording.warnings ?? []) : [],
  };
}

async function completedRecording(recordingId: RecordingId) {
  await wait();
  if (statusOf(recordingId) !== "COMPLETED") throw new ApiError(409, "REPORT_NOT_COMPLETED");
  return findRecording(recordingId);
}

export async function getAttempts(practiceId: number | string): Promise<AttemptsResponse> {
  await wait();
  if (!MOCK_PRACTICE_TITLES[Number(practiceId)]) throw new ApiError(404, "PRACTICE_NOT_FOUND");

  return {
    attempts: Object.entries(MOCK_RECORDINGS)
      .filter(([, recording]) => recording.practice_id === Number(practiceId))
      .map(([recordingId, recording]) => ({
        recording_id: Number(recordingId),
        attempt_no: recording.attempt_no,
        recorded_at: recording.recorded_at,
        status: recordingId in analysisStartedAt || !recording.delayed ? statusOf(recordingId) : "PENDING",
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
  const recording = await completedRecording(recordingId);
  return recording.overview as Overview;
}

export async function getUtterance(recordingId: RecordingId) {
  await completedRecording(recordingId);
  return MOCK_UTTERANCE;
}

export async function getFeedback(recordingId: RecordingId) {
  const recording = await completedRecording(recordingId);
  return recording.feedback as FeedbackResponse;
}

export async function getAudioUrl(): Promise<AudioUrlResponse> {
  await wait();
  throw new ApiError(404, "AUDIO_FILE_NOT_FOUND");
}
