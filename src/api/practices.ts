import * as mock from "@/api/mocks/practices";
import { request, USE_MOCK } from "@/api/client";
import { isDemoId, isDemoMode } from "@/api/demo";
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

type Server = typeof server;

export const listPractices: Server["listPractices"] = async (options) => {
  if (USE_MOCK) return mock.listPractices();
  if (!isDemoMode()) return server.listPractices(options);

  const [practices, demoPractices] = await Promise.all([server.listPractices(options), mock.listPractices()]);
  return [...practices, ...demoPractices];
};

export const getPractice: Server["getPractice"] = (practiceId, options) =>
  USE_MOCK || isDemoId(practiceId) ? mock.getPractice(practiceId) : server.getPractice(practiceId, options);

export const createPractice: Server["createPractice"] = (script, options) =>
  USE_MOCK ? mock.createPractice(script) : server.createPractice(script, options);

export const uploadScript: Server["uploadScript"] = (file, options) =>
  USE_MOCK ? mock.uploadScript(file) : server.uploadScript(file, options);

export const uploadRecording: Server["uploadRecording"] = (practiceId, audio, durationMs, options) =>
  USE_MOCK ? mock.uploadRecording(practiceId, audio, durationMs) : server.uploadRecording(practiceId, audio, durationMs, options);
