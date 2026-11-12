import type { UtteranceAnalysis } from "@/api/types";

export const MOCK_DURATION_MS = 66155;

export const MOCK_UTTERANCE: UtteranceAnalysis = {
  spoken_text:
    "카카오톡은 위챗과 마찬가지로 주요 메신저 어플리케이션이고, 심지어 카카오페이와도 연동되어 있어 위챗페이와도 유사하죠. 하지만, 카카오페이는 위챗페이처럼 주요결제수단으로 자리잡지 못했는데요. 제가 발표를 위해 조사하며 얻은 정보를 토대로 생각해보았을때, 크게 세가지 이유때문이라는 생각이 들었습니다.\n첫번째로는, 가장 큰 이유인 사회문화적 차이입니다. 중국은 전자결제로 대체할 시기에 주요국에 비해 신용카드 보유 수가 낮기도 했으며 은행망이 부족했기에 전자결제가 큰 대안이 되었던 것입니다. 하지만, 앞에서도 말했다시피 한국은 신용카드 보유 수가 높은 편이며 카드 사용 문화에 익숙해져 있습니다.\n두번째로는, 금융규제 측면인데요. 중국은 금융규제가 비교적 자유로우나, 한국은 금융회사의 비금융 산업의 주식을 제한하는 정책을 유지중입니다.",
  marks: [
    {
      idx: 68,
      stretch: 2.6,
    },
    {
      idx: 103,
      pitch: 6,
    },
    {
      idx: 144,
      pitch: 7,
    },
    {
      idx: 145,
      stretch: 2.8,
    },
    {
      idx: 150,
      pitch: 7,
      stretch: 2.4,
    },
    {
      idx: 164,
      pitch: 1,
    },
    {
      idx: 177,
      stretch: 3.4,
    },
    {
      idx: 183,
      pitch: 6,
    },
    {
      idx: 193,
      pitch: 2,
    },
    {
      idx: 271,
      pitch: 1,
    },
    {
      idx: 276,
      stretch: 2.3,
      pitch: 6,
    },
    {
      idx: 322,
      pitch: 6,
    },
    {
      idx: 349,
      pitch: 7,
      stretch: 2.9,
    },
    {
      idx: 409,
      pitch: 1,
    },
  ],
  paces: [
    {
      start_idx: 37,
      end_idx: 51,
      label: "SLOW",
    },
    {
      start_idx: 85,
      end_idx: 104,
      label: "FAST",
    },
    {
      start_idx: 222,
      end_idx: 250,
      label: "FAST",
    },
    {
      start_idx: 377,
      end_idx: 402,
      label: "FAST",
    },
  ],
  pauses: [
    {
      after_idx: 35,
      duration_ms: 600,
    },
    {
      after_idx: 142,
      duration_ms: 900,
    },
    {
      after_idx: 157,
      duration_ms: 800,
    },
    {
      after_idx: 177,
      duration_ms: 500,
    },
    {
      after_idx: 256,
      duration_ms: 1300,
    },
    {
      after_idx: 350,
      duration_ms: 700,
    },
  ],
  segments: [
    {
      start_idx: 0,
      end_idx: 32,
      start_ms: 400,
      end_ms: 5215,
    },
    {
      start_idx: 33,
      end_idx: 35,
      start_ms: 5395,
      end_ms: 5890,
    },
    {
      start_idx: 36,
      end_idx: 65,
      start_ms: 6490,
      end_ms: 11785,
    },
    {
      start_idx: 66,
      end_idx: 70,
      start_ms: 11965,
      end_ms: 12685,
    },
    {
      start_idx: 71,
      end_idx: 105,
      start_ms: 12865,
      end_ms: 17305,
    },
    {
      start_idx: 106,
      end_idx: 140,
      start_ms: 17485,
      end_ms: 22420,
    },
    {
      start_idx: 141,
      end_idx: 142,
      start_ms: 22600,
      end_ms: 22930,
    },
    {
      start_idx: 143,
      end_idx: 157,
      start_ms: 23830,
      end_ms: 25990,
    },
    {
      start_idx: 158,
      end_idx: 165,
      start_ms: 26790,
      end_ms: 28005,
    },
    {
      start_idx: 166,
      end_idx: 166,
      start_ms: 28185,
      end_ms: 28350,
    },
    {
      start_idx: 167,
      end_idx: 173,
      start_ms: 28530,
      end_ms: 29580,
    },
    {
      start_idx: 174,
      end_idx: 177,
      start_ms: 29760,
      end_ms: 30315,
    },
    {
      start_idx: 178,
      end_idx: 195,
      start_ms: 30815,
      end_ms: 33365,
    },
    {
      start_idx: 196,
      end_idx: 256,
      start_ms: 33545,
      end_ms: 41210,
    },
    {
      start_idx: 257,
      end_idx: 273,
      start_ms: 42510,
      end_ms: 44790,
    },
    {
      start_idx: 274,
      end_idx: 278,
      start_ms: 44970,
      end_ms: 45690,
    },
    {
      start_idx: 279,
      end_idx: 331,
      start_ms: 45870,
      end_ms: 53355,
    },
    {
      start_idx: 332,
      end_idx: 332,
      start_ms: 53535,
      end_ms: 53700,
    },
    {
      start_idx: 333,
      end_idx: 339,
      start_ms: 53880,
      end_ms: 54930,
    },
    {
      start_idx: 340,
      end_idx: 350,
      start_ms: 55110,
      end_ms: 56820,
    },
    {
      start_idx: 351,
      end_idx: 351,
      start_ms: 57520,
      end_ms: 57580,
    },
    {
      start_idx: 352,
      end_idx: 372,
      start_ms: 57760,
      end_ms: 60805,
    },
    {
      start_idx: 373,
      end_idx: 410,
      start_ms: 60985,
      end_ms: 65575,
    },
  ],
  replaced: [
    {
      start_idx: 345,
      end_idx: 349,
      spoken: "측면인데요",
      script_text: "특면인데요",
    },
  ],
  added: [],
  skipped: [],
};
