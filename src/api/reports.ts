import * as mock from "@/api/mocks/reports";
import { request, resolveUrl, USE_MOCK } from "@/api/client";
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

export const {
  getAttempts,
  startAnalysis,
  getStatus,
  getOverview,
  getUtterance,
  getFeedback,
  getAudioUrl,
}: typeof server = USE_MOCK ? mock : server;
