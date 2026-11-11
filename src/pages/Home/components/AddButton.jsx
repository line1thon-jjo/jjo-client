import plusIcon from "../../../assets/icons/plus-icon.svg";
import "./AddButton.css";

export default function AddButton({ onClick }) {
  return (
    <button
      type="button"
      className="add-button"
      onClick={onClick}
      aria-label="새 연습 추가"
    >
      <span className="add-button__circle">
        <img
          src={plusIcon}
          alt=""
          className="add-button__icon"
        />
      </span>
    </button>
  );
}
