export const REPORT_POLL_MS = 3000;

export const REPORT_IN_PROGRESS = ["PENDING", "ANALYZING"];

export const ANALYSIS_DONE_MS = 1400;

export const REPORT_TABS = [
  { id: "overview", label: "전체 결과" },
  { id: "utterance", label: "발화 분석" },
  { id: "feedback", label: "AI 피드백" },
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
  END_RISE: { label: "끝 올림", description: "문장 끝에서 음높이가 올라가는 습관이 나타났어요." },
  END_STRETCH: { label: "끝 늘임", description: "문장 끝 글자를 길게 끄는 습관이 나타났어요." },
  END_FADE: { label: "끝 흐림", description: "문장 끝에서 목소리가 작아지는 습관이 나타났어요." },
  MID_STRETCH: { label: "중간 늘임", description: "문장 중간에서 글자를 길게 늘이는 습관이 나타났어요." },
  MID_PAUSE: { label: "중간 쉼", description: "문장 중간에서 길게 쉬는 습관이 나타났어요." },
  LONG_PAUSE: { label: "긴 쉼", description: "숨 고를 자리에서 평소보다 오래 쉬었어요." },
  NO_BREAK: { label: "쉼 없이 잇기", description: "문장이 끝났는데 쉬지 않고 이어 말했어요." },
};

export const HABITS_PREVIEW_COUNT = 2;

export const SPEED_BAR_CELLS = 10;

export const ATTEMPT_ORDINALS = ["첫", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열"];
