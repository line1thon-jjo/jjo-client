export const GUIDE_PITCH = {
  slogan: ["내가 몰랐던", "내 말버릇까지"],
  summary: "jjo는 대본을 읽은 녹음을 분석해 말버릇을 글자 모양으로 보여주는 말투 코치예요.",
  sections: [
    {
      label: "문제",
      text: "녹음을 다시 들어도 어디서 빨라지고 어디서 끝을 끄는지 귀로는 짚어내기 어려워요.",
    },
    {
      label: "해결",
      text: "음절마다 높낮이, 길이, 쉼, 속도를 재서 대본 글자 위에 그대로 그려요.",
    },
    {
      label: "대상",
      text: "발표, 면접, 스피치처럼 정해진 대본을 말로 준비하는 사람",
    },
  ],
};

export const GUIDE_SCREENS = [
  {
    path: "/login",
    label: "로그인",
    title: "구글 계정으로 바로 시작해요",
    description: "따로 입력할 정보 없이 구글 계정 하나로 가입과 로그인을 마쳐요.",
    point: { label: "포인트", text: "로그인과 약관 동의 두 단계면 첫 연습까지 바로 들어가요." },
  },
  {
    path: "/terms",
    label: "약관 동의",
    title: "필수 약관만 확인하면 돼요",
    description: "약관을 누르면 전문을 볼 수 있어요. 필수 항목에 동의하면 가입이 끝나요.",
    point: { label: "포인트", text: "음성은 분석에만 쓰인다는 점을 가입 단계에서 분명히 알려요." },
  },
  {
    path: "/onboarding",
    label: "서비스 소개",
    title: "글자 모양 읽는 법을 먼저 알려줘요",
    description: "높게 말한 글자는 위로, 길게 늘인 음절은 가로로, 쉰 자리는 간격으로 벌어져요.",
    point: { label: "포인트", text: "규칙이 세 가지뿐이라 리포트를 설명 없이 바로 읽을 수 있어요." },
  },
  {
    path: "/",
    label: "홈",
    title: "연습한 대본을 한곳에 모아요",
    description: "대본마다 시도한 횟수와 최근 결과를 보여주고, 연습을 열면 리포트로 이어져요.",
    point: { label: "포인트", text: "같은 대본을 여러 번 말하는 흐름이 중심이라 회차가 쌓일수록 변화가 보여요." },
  },
  {
    path: "/script",
    label: "대본 입력",
    title: "말할 대본을 먼저 넣어요",
    description: "발표나 면접에서 말할 문장을 붙여 넣어요. 연습 제목은 AI가 대본을 읽고 붙여줘요.",
    point: { label: "포인트", text: "대본이 있어서 무엇을 말하려 했는지와 실제로 어떻게 말했는지를 비교할 수 있어요." },
  },
  {
    path: "/record",
    label: "녹음",
    title: "대본을 보며 소리 내어 읽어요",
    description: "녹음을 마치면 음성을 올리고, 서버에서 대본과 맞춰 분석을 시작해요.",
    point: {
      label: "기술",
      text: "Whisper로 음성을 대본과 음절 단위로 맞추고, Praat으로 높낮이와 크기, 쉼을 재요. 더듬어 반복한 말은 wav2vec2로 찾아요.",
    },
  },
  {
    path: "/practices/:practiceId/reports/:recordingId",
    label: "분석 리포트",
    title: "내 말투가 글자 모양으로 그려져요",
    description: "끝 올림, 끝 끌기, 중간 쉼 같은 7가지 습관을 찾고, 총평은 AI가 두 줄로 정리해요.",
    point: {
      label: "포인트",
      text: "속도는 다른 사람이 아니라 그 녹음 안의 내 평균과 비교해요. 이전 회차와 비교해 달라진 점도 보여줘요.",
    },
  },
];
