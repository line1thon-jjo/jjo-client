import "./ScriptTitle.css";
import editIcon from "../../../assets/icons/edit-icon.svg";

export default function ScriptTitle({
  value,
  onChange,
}) {
  return (
    <div className="script-title">
      <input
        type="text"
        className="script-title__input"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="연습 제목"
        aria-label="연습 제목"
      />

      <button
        type="button"
        className="script-title__edit"
        onClick={() =>
          document.querySelector(
            ".script-title__input"
          )?.focus()
        }
        aria-label="연습 제목 수정"
      >
        <img src={editIcon} alt="" />
      </button>
    </div>
  );
}
