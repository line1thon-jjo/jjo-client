import "./GreenButton.css";
import arrowRight from "../../assets/icons/arrow-right.svg";

export default function GreenButton({
  text,
  onClick,
  disabled = false,
  showArrow = true,
  type = "button",
}) {
  return (
    <button
      type={type}
      className="green-button"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="green-button__text">
        {text}
      </span>

      {showArrow && (
        <img
          src={arrowRight}
          alt=""
          className="green-button__icon"
        />
      )}
    </button>
  );
}
