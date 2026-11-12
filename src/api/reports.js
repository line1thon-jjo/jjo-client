import { wait } from "./mock";
import { MOCK_DURATION_MS, MOCK_UTTERANCE } from "@/mocks/utterance";

export class ReportError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

async function findMockReport(recordingId) {
  await wait();
  if (recordingId !== "mock") throw new ReportError(404, "REPORT_NOT_FOUND");
}

export async function getOverview(recordingId) {
  await findMockReport(recordingId);

  return {
    practice_title: "카카오페이 발표",
    recorded_at: new Date().toISOString(),
    attempt_no: 1,
    duration_ms: MOCK_DURATION_MS,
    headline: { lead: "호흡은 안정적이었어요.", focus: "이제 중요한 말을 천천히 전해보세요." },
    summary: "후반부 속도와 강조 구절만 다듬어 보세요.",
    feedback_count: 3,
  };
}

export async function getUtterance(recordingId) {
  await findMockReport(recordingId);
  return MOCK_UTTERANCE;
}
