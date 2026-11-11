import "./PageIndicator.css";

export default function PageIndicator({ count, current, onSelect }) {
  return (
    <div className="page-indicator">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          className="page-indicator__dot"
          data-active={index === current}
          onClick={() => onSelect(index)}
          aria-label={`${index + 1}번째 안내`}
          aria-current={index === current ? "step" : undefined}
        />
      ))}
    </div>
  );
}
