import { ApiError } from "@/api/errors";
import { MOCK_UTTERANCE } from "@/api/mocks/utterance";
import { wait } from "@/api/mocks/wait";
import type { Practice, Recording, ScriptUpload } from "@/api/types";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(days: number) {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

const NOW = daysAgo(0);

function practice(id: number, title: string, script: string, days: number): Practice {
  return { id, title, script, created_at: daysAgo(days), updated_at: daysAgo(days) };
}

export const MOCK_PRACTICES: Practice[] = [
  practice(1, "카카오페이와 위챗페이 비교", MOCK_UTTERANCE.spoken_text, 2),
  practice(
    2,
    "동아리 신입 모집 발표",
    "안녕하세요. 저희 동아리를 소개하겠습니다. 저희는 매주 목요일에 모여 사진을 찍고, 한 달에 한 번 작은 전시를 엽니다. 카메라가 없어도 괜찮습니다. 휴대폰 하나면 충분합니다.",
    1,
  ),
  practice(
    3,
    "면접 1분 자기소개",
    "안녕하세요. 사용자의 문제를 끝까지 파고드는 개발자 지원자입니다. 학부 시절 교내 식당 주문 앱을 만들면서, 점심시간마다 줄이 길어지는 이유를 직접 관찰했습니다. 그 결과 주문보다 결제 단계에서 시간이 오래 걸린다는 것을 알게 되었고, 결제 화면을 단순하게 바꿔 대기 시간을 절반으로 줄였습니다. 이 경험으로 숫자보다 사람을 먼저 보는 습관이 생겼습니다. 입사하게 된다면 이 습관으로 사용자가 정말 불편해하는 지점을 찾아내겠습니다.",
    3,
  ),
  practice(
    4,
    "졸업 작품 중간 발표",
    "저희 팀은 발표 연습을 돕는 서비스를 만들고 있습니다. 사용자가 대본을 넣고 녹음하면 말의 빠르기와 높낮이, 쉼을 글자 모양으로 보여줍니다. 지금까지 녹음 업로드와 분석 화면을 완성했고, 남은 기간에는 회차별 비교와 피드백 정확도를 높이는 데 집중하겠습니다. 특히 실제 사용자 다섯 명과 진행한 테스트에서 가장 많이 나온 의견은 결과를 한눈에 보기 어렵다는 점이었습니다. 그래서 요약 화면을 새로 설계했고, 다음 주까지 두 번째 테스트를 진행할 예정입니다.",
    5,
  ),
  practice(5, "건배사", "다들 한 해 동안 정말 고생 많으셨습니다. 내년에도 함께 웃으며 일할 수 있기를 바랍니다. 위하여!", 3),
  practice(
    6,
    "신제품 런칭 피치",
    "아침마다 물을 얼마나 마셨는지 기억하시나요? 저희가 만든 텀블러는 마신 양을 자동으로 기록합니다. 따로 앱을 켤 필요도 없습니다. 뚜껑의 불빛이 오늘 목표까지 남은 양을 알려줍니다. 지금 사전 예약을 하시면 첫 달 구독료를 받지 않습니다.",
    6,
  ),
  practice(
    7,
    "결혼식 축사",
    "신랑 친구 대표로 축사를 맡게 되어 영광입니다. 저는 신랑과 고등학교 때부터 십오 년을 함께했습니다. 늘 약속 시간보다 일찍 나와 기다리던 친구였는데, 오늘 보니 그 기다림이 이 자리를 위한 연습이었나 봅니다. 두 분, 서로를 기다려 주는 마음 잊지 말고 행복하게 사세요.",
    6,
  ),
  practice(
    8,
    "운영체제 스터디 발표",
    "오늘은 CPU 스케줄링 중 라운드 로빈 방식을 설명하겠습니다. 라운드 로빈은 각 프로세스에 같은 길이의 시간 조각을 나눠 주고, 그 시간이 끝나면 다음 프로세스로 넘어갑니다. 시간 조각이 너무 짧으면 문맥 교환 비용이 커지고, 너무 길면 선입선출 방식과 다를 바가 없어집니다. 그래서 실제 시스템에서는 응답 시간과 처리량 사이의 균형을 보고 값을 정합니다.",
    9,
  ),
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
