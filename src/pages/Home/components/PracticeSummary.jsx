import HabitRows from "@/pages/Report/components/HabitRows";
import { useOverviews } from "@/pages/Home/hooks/useOverviews";

export default function PracticeSummary({ latestCompleted, previousCompleted }) {
  const { overview, previous } = useOverviews(latestCompleted.recording_id, previousCompleted?.recording_id);

  if (!overview) {
    return (
      <div className="practice-row__summary" aria-busy="true">
        <span className="practice-row__skeleton" style={{ width: "64%" }} />
        <span className="practice-row__skeleton" style={{ width: "88%" }} />
        <span className="practice-row__skeleton" style={{ height: 96 }} />
      </div>
    );
  }

  return (
    <div className="practice-row__summary">
      <p className="practice-row__headline font-17-regular">
        {overview.summary.headline}
        <strong className="font-17-bold">{overview.summary.footer}</strong>
      </p>
      <HabitRows overview={overview} previous={previous} />
    </div>
  );
}
