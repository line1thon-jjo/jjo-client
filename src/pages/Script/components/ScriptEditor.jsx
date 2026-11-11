import "./ScriptEditor.css";

export default function ScriptEditor({
  value,
  onChange,
  maxLength = 1500,
}) {
  return (
    <div className="script-editor">
      <textarea
        className="script-editor__textarea"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        maxLength={maxLength}
        placeholder="발표 대본을 입력해주세요."
        aria-label="발표 대본"
      />

      <div className="script-editor__counter">
        <span>최대 {maxLength.toLocaleString()}자</span>

        <span>
          {value.length.toLocaleString()} /{" "}
          {maxLength.toLocaleString()}자
        </span>
      </div>
    </div>
  );
}