import { useState } from "react";

import chevronIcon from "@/assets/icons/chevron-right.svg";

import "./FeedbackList.css";

function FeedbackItem({ item, onPlay }) {
  const [isOpen, setIsOpen] = useState(item.rank === 1);
  const bodyId = `feedback-body-${item.rank}`;
  const toggle = () => setIsOpen((open) => !open);

  const handleItemClick = (event) => {
    if (event.target.closest("button")) return;
    if (window.getSelection()?.toString()) return;
    toggle();
  };

  return (
    <li
      className="feedback-list__item"
      data-open={isOpen || undefined}
      style={{ "--i": item.rank - 1 }}
      onClick={handleItemClick}
    >
      <h3 className="feedback-list__heading">
        <button
          type="button"
          className="feedback-list__toggle"
          aria-expanded={isOpen}
          aria-controls={bodyId}
          onClick={toggle}
        >
          <span className="feedback-list__rank font-16-semibold">{String(item.rank).padStart(2, "0")}</span>
          <span className="feedback-list__title font-17-semibold">{item.title}</span>
          <img src={chevronIcon} alt="" className="feedback-list__chevron" />
        </button>
      </h3>

      <div id={bodyId} className="feedback-list__body">
        <div className="feedback-list__body-inner">
          <p className="feedback-list__quote font-16-medium">“{item.quote}”</p>
          <p className="feedback-list__description font-15-regular line-height-150">{item.body}</p>
          <button
            type="button"
            className="feedback-list__play font-14-medium"
            onClick={() => onPlay?.(item)}
            disabled={!onPlay}
          >
            <span className="feedback-list__play-icon" aria-hidden="true" />
            해당 부분 듣기
          </button>
        </div>
      </div>
    </li>
  );
}

export default function FeedbackList({ items, onPlay }) {
  if (items.length === 0) {
    return (
      <p className="feedback-list__empty font-15-medium line-height-150">
        이번 연습에서는 고칠 점을 찾지 못했어요.
        <br />
        지금처럼 연습해 보세요.
      </p>
    );
  }

  return (
    <ol className="feedback-list">
      {items.map((item) => (
        <FeedbackItem key={item.rank} item={item} onPlay={onPlay} />
      ))}
    </ol>
  );
}
