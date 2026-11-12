import "./AddButton.css";
import "@/lib/transition/revealFrom.css";

export default function AddButton({ onClick }) {
  return (
    <button type="button" className="add-button" onClick={onClick} aria-label="새 연습 추가">
      <svg className="add-button__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
