import "./AgreementCheckbox.css";

export default function AgreementCheckbox({ label, checked, onChange, emphasized = false }) {
  return (
    <label className="agreement-checkbox">
      <input
        type="checkbox"
        className="agreement-checkbox__input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      <span className="agreement-checkbox__box" aria-hidden="true">
        <svg className="agreement-checkbox__check" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M5.25 7.75L8.16667 11.5L12.75 6.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="square"
            pathLength="1"
          />
        </svg>
      </span>

      <span className={emphasized ? "font-15-semibold" : "font-15-medium"}>{label}</span>
    </label>
  );
}
