import FeedbackList from "@/pages/Report/components/FeedbackList";
import HabitRows from "@/pages/Report/components/HabitRows";

import "./SummaryPanel.css";

export default function SummaryPanel({ overview, previous, feedback, playing, onPlay, onFocusPace }) {
  return (
    <div className="summary-panel">
      <section className="summary-panel__section" aria-labelledby="summary-next-title">
        <h2 id="summary-next-title" className="summary-panel__heading font-17-semibold">
          연습 포인트
        </h2>
        <FeedbackList items={feedback.items} playing={playing} onPlay={onPlay} />
      </section>

      <section className="summary-panel__section" aria-labelledby="summary-habits-title">
        <div className="summary-panel__heading-row">
          <h2 id="summary-habits-title" className="summary-panel__heading font-17-semibold">
            말하기 습관
          </h2>
          {previous && <span className="summary-panel__caption font-14-regular">지난 연습 대비</span>}
        </div>

        <HabitRows overview={overview} previous={previous} onFocusPace={onFocusPace} />
      </section>
    </div>
  );
}
