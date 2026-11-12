import { ANALYSIS_FAILURE_MESSAGES, ERROR_MESSAGES, FALLBACK_ERROR_MESSAGE } from "@/constants/messages";

function pick(messages: Record<string, string>, code: string | undefined, fallback: string) {
  return (code && messages[code]) || fallback;
}

export function getErrorMessage(error: unknown, fallback = FALLBACK_ERROR_MESSAGE) {
  const code = error instanceof Error && "code" in error ? String(error.code) : undefined;
  return pick(ERROR_MESSAGES, code, fallback);
}

export function getFailureMessage(failure?: { code: string } | null) {
  return pick(ANALYSIS_FAILURE_MESSAGES, failure?.code, FALLBACK_ERROR_MESSAGE);
}
