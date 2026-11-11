import "./PracticeCard.css";

export default function PracticeCard({
  title,
  content,
  time,
  onClick,
}) {
  return (
    <article
      className="practice-card"
      onClick={onClick}
    >
      <h3 className="practice-card__title">
        {title}
      </h3>

      <p className="practice-card__content">
        {content}
      </p>

      <span className="practice-card__time">
        {time}
      </span>
    </article>
  );
}