import * as mock from "@/api/mocks/reports";
import { request, resolveUrl, USE_MOCK } from "@/api/client";
import { isDemoId } from "@/api/demo";
import type {
  AttemptsResponse,
  AudioUrlResponse,
  FeedbackResponse,
  Overview,
  RecordingId,
  ReportStatusResponse,
  RequestOptions,
  UtteranceAnalysis,
} from "@/api/types";

const server = {
  getAttempts(practiceId: number | string, { signal }: RequestOptions = {}) {
    return request<AttemptsResponse>(`/reports/practices/${practiceId}/attempts`, { signal });
  },

  startAnalysis(recordingId: RecordingId, { signal }: RequestOptions = {}) {
    return request<ReportStatusResponse>("/reports", {
      method: "POST",
      body: { recording_id: Number(recordingId) },
      signal,
    });
  },

  getStatus(recordingId: RecordingId, { signal }: RequestOptions = {}) {
    return request<ReportStatusResponse>(`/reports/${recordingId}`, { signal });
  },

  getOverview(recordingId: RecordingId, { signal }: RequestOptions = {}) {
    return request<Overview>(`/reports/${recordingId}/overview`, { signal });
  },

  getUtterance(recordingId: RecordingId, { signal }: RequestOptions = {}) {
    return request<UtteranceAnalysis>(`/reports/${recordingId}/utterance`, { signal });
  },

  getFeedback(recordingId: RecordingId, { signal }: RequestOptions = {}) {
    return request<FeedbackResponse>(`/reports/${recordingId}/feedback`, { signal });
  },

  async getAudioUrl(recordingId: RecordingId, { signal }: RequestOptions = {}) {
    const result = await request<AudioUrlResponse>(`/reports/${recordingId}/audio-url`, { signal });
    return { ...result, audio_url: resolveUrl(result.audio_url) };
  },
};

type Server = typeof server;

function source(id: number | string) {
  return USE_MOCK || isDemoId(id) ? mock : server;
}

export const getAttempts: Server["getAttempts"] = (practiceId, options) => source(practiceId).getAttempts(practiceId, options);
export const startAnalysis: Server["startAnalysis"] = (recordingId, options) =>
  source(recordingId).startAnalysis(recordingId, options);
export const getStatus: Server["getStatus"] = (recordingId, options) => source(recordingId).getStatus(recordingId, options);
export const getOverview: Server["getOverview"] = (recordingId, options) => source(recordingId).getOverview(recordingId, options);
export const getUtterance: Server["getUtterance"] = (recordingId, options) =>
  source(recordingId).getUtterance(recordingId, options);
export const getFeedback: Server["getFeedback"] = (recordingId, options) => source(recordingId).getFeedback(recordingId, options);
export const getAudioUrl: Server["getAudioUrl"] = (recordingId, options) =>
  source(recordingId).getAudioUrl(recordingId, options);
