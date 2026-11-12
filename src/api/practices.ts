import * as mock from "@/api/mocks/practices";
import { request, USE_MOCK } from "@/api/client";
import type { Practice, Recording, RequestOptions, ScriptUpload } from "@/api/types";

const server = {
  listPractices({ signal }: RequestOptions = {}) {
    return request<Practice[]>("/practices", { signal });
  },

  getPractice(practiceId: number | string, { signal }: RequestOptions = {}) {
    return request<Practice>(`/practices/${practiceId}`, { signal });
  },

  createPractice(script: string, { signal }: RequestOptions = {}) {
    return request<Practice>("/practices", { method: "POST", body: { script }, signal });
  },

  uploadScript(file: File, { signal }: RequestOptions = {}) {
    const body = new FormData();
    body.append("file", file);
    return request<ScriptUpload>("/practices/script-upload", { method: "POST", body, signal });
  },

  uploadRecording(practiceId: number | string, audio: Blob, durationMs: number, { signal }: RequestOptions = {}) {
    const body = new FormData();
    body.append("file", audio);
    body.append("duration_ms", String(Math.max(1, Math.round(durationMs))));
    return request<Recording>(`/practices/${practiceId}/recordings`, { method: "POST", body, signal });
  },
};

export const { listPractices, getPractice, createPractice, uploadScript, uploadRecording }: typeof server = USE_MOCK
  ? mock
  : server;
