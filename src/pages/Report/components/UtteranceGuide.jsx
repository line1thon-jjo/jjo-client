import "./UtteranceGuide.css";

const ITEMS = [
  {
    id: "pitch",
    label: "높낮이",
    sample: "높",
    description: "평소보다 높게 말한 글자는 위로, 낮게 말한 글자는 아래로 움직여요.",
  },
  { id: "stretch", label: "늘임", sample: "길", description: "평소보다 길게 끈 글자는 가로로 늘어나요." },
  {
    id: "fast",
    label: "빠름",
    sample: "빠른말",
    description: "평소보다 빠른 구절은 글자가 촘촘하고 빨간 밑줄이 그어져요.",
  },
  {
    id: "slow",
    label: "느림",
    sample: "느린말",
    description: "평소보다 느린 구절은 글자가 넓게 퍼지고 파란 밑줄이 그어져요.",
  },
  { id: "pause", label: "쉼", sample: "0.8초", description: "문장 중간에서 쉰 곳은 간격이 벌어지고 쉰 시간이 보여요." },
];

export default function UtteranceGuide() {
  return (
    <ul className="utterance-guide">
      {ITEMS.map(({ id, label, sample, description }) => (
        <li key={id} className="utterance-guide__item">
          <span className="utterance-guide__sample" data-kind={id} aria-hidden="true">
            <span className="utterance-guide__glyph">{sample}</span>
          </span>
          <div>
            <p className="utterance-guide__label font-15-semibold">{label}</p>
            <p className="utterance-guide__description font-14-regular line-height-150">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
