export const REPORT_POLL_MS = 3000;

export const REPORT_IN_PROGRESS = ["PENDING", "ANALYZING"];

export const ANALYSIS_DONE_MS = 1400;

export const REPORT_TABS = [
  { id: "summary", label: "요약" },
  { id: "detail", label: "상세 분석" },
];

export const ATTEMPT_STATUS_LABELS = {
  PENDING: "분석 중",
  ANALYZING: "분석 중",
  COMPLETED: "완료",
  FAILED: "실패",
};

export const REPORT_WARNINGS = {
  PITCH_UNAVAILABLE: "높낮이를 정확히 잡지 못했어요. 글자 높낮이 표시가 없거나 적을 수 있어요.",
  PARTIAL_ALIGNMENT: "대본과 맞춰 보지 못한 부분이 있어요. 일부 구절만 분석했어요.",
  SCRIPT_DEVIATION: "대본과 다르게 말한 부분이 많아요. 결과가 정확하지 않을 수 있어요.",
};

export const HABITS = {
  END_RISE: "끝 올림",
  END_STRETCH: "끝 끌기",
  END_FADE: "끝 흐림",
  MID_STRETCH: "중간 늘임",
  MID_PAUSE: "중간 쉼",
  LONG_PAUSE: "긴 쉼",
  NO_BREAK: "이어 말하기",
};
