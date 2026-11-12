import { ApiError } from "@/api/errors";
import { MOCK_UTTERANCE } from "@/api/mocks/utterance";
import { wait } from "@/api/mocks/wait";
import type { Practice, Recording, ScriptUpload } from "@/api/types";

const NOW = new Date().toISOString();

const MOCK_PRACTICES: Practice[] = [
  {
    id: 1,
    title: "카카오페이와 위챗페이 비교",
    script: MOCK_UTTERANCE.spoken_text,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 2,
    title: "동아리 신입 모집 발표",
    script: "안녕하세요. 저희 동아리를 소개하겠습니다.",
    created_at: NOW,
    updated_at: NOW,
  },
];

function findPractice(practiceId: number | string) {
  const practice = MOCK_PRACTICES.find(({ id }) => id === Number(practiceId));
  if (!practice) throw new ApiError(404, "PRACTICE_NOT_FOUND");
  return practice;
}

export async function listPractices() {
  await wait();
  return MOCK_PRACTICES;
}

export async function getPractice(practiceId: number | string) {
  await wait();
  return findPractice(practiceId);
}

export async function createPractice(script: string): Promise<Practice> {
  await wait();
  return { id: MOCK_PRACTICES.length + 1, title: script.split("\n")[0].slice(0, 100), script, created_at: NOW, updated_at: NOW };
}

export async function uploadScript(file: File): Promise<ScriptUpload> {
  await wait();
  return { script: await file.text() };
}

export async function uploadRecording(practiceId: number | string, _audio: Blob, durationMs: number): Promise<Recording> {
  await wait();
  findPractice(practiceId);
  return { recording_id: 3, practice_id: Number(practiceId), attempt_no: 3, duration_ms: durationMs, created_at: NOW };
}
