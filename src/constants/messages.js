export const FALLBACK_ERROR_MESSAGE = "문제가 생겼어요. 잠시 후 다시 시도해 주세요.";

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "인터넷 연결을 확인해 주세요.",
  ACCESS_CREDENTIAL_INVALID: "로그인이 만료됐어요. 다시 로그인해 주세요.",
  GOOGLE_CREDENTIAL_INVALID: "구글 로그인에 실패했어요. 다시 시도해 주세요.",
  GOOGLE_IDENTITY_UNAVAILABLE: "구글 로그인을 불러오지 못했어요. 새로고침해 주세요.",
  GOOGLE_VERIFICATION_UNAVAILABLE: "구글에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.",
  SIGNUP_CREDENTIAL_INVALID: "가입 시간이 지났어요. 다시 로그인해 주세요.",
  SIGNUP_ALREADY_COMPLETED: "이미 가입한 계정이에요. 다시 로그인해 주세요.",
  ACCOUNT_DELETION_UNCONFIRMED: "탈퇴를 마치지 못했어요. 잠시 후 다시 시도해 주세요.",
  REQUIRED_AGREEMENT_MISSING: "필수 약관에 동의해 주세요.",
  PRACTICE_NOT_FOUND: "연습을 찾을 수 없어요.",
  RECORDING_NOT_FOUND: "녹음을 찾을 수 없어요.",
  REPORT_NOT_FOUND: "아직 분석하지 않은 녹음이에요.",
  REPORT_NOT_COMPLETED: "아직 분석 중이에요.",
  AUDIO_FILE_TOO_LARGE: "녹음 파일은 20MB까지 올릴 수 있어요.",
  UNSUPPORTED_AUDIO_FORMAT: "지원하지 않는 녹음 형식이에요.",
  EMPTY_AUDIO_FILE: "녹음된 소리가 없어요.",
  SCRIPT_FILE_TOO_LARGE: "대본 파일은 1MB까지 올릴 수 있어요.",
  SCRIPT_FILE_TYPE_UNSUPPORTED: "TXT 파일만 올릴 수 있어요.",
  SCRIPT_FILE_INVALID_ENCODING: "UTF-8로 저장한 파일만 읽을 수 있어요.",
  SCRIPT_FILE_TEXT_EMPTY: "대본 파일이 비어 있어요.",
};

export const ANALYSIS_FAILURE_MESSAGES = {
  EMPTY_SCRIPT: "대본이 너무 짧아요. 세 글자 이상 적어 주세요.",
  AUDIO_NOT_FOUND: "녹음 파일을 찾지 못했어요. 다시 녹음해 주세요.",
  AUDIO_DECODE_FAILED: "녹음 파일을 읽지 못했어요. 다시 녹음해 주세요.",
  AUDIO_TOO_SHORT: "녹음이 너무 짧아요. 1.5초 이상 녹음해 주세요.",
  AUDIO_TOO_LONG: "녹음이 너무 길어요. 10분 안으로 녹음해 주세요.",
  NO_SPEECH: "목소리가 들리지 않았어요. 마이크를 확인하고 다시 녹음해 주세요.",
  ALIGNMENT_LOW_COVERAGE: "대본과 녹음이 많이 달라요. 대본을 보며 다시 읽어 주세요.",
};
