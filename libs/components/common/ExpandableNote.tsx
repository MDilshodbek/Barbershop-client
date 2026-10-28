import React, { FC, ReactNode, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface ExpandableNoteProps {
  note: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  /** COMMENT: lines shown before "Show more" */
  lines?: number;
}

/**
 * A note panel with a label, clamped to a few lines with a "Show more / Show less" toggle.
 * The note is rendered as plain text (user content). Styling is done by the parent's CSS
 * through the classes: client-note, note-header, note-text (+ is-clamped), note-toggle.
 */
const ExpandableNote: FC<ExpandableNoteProps> = ({ note, label, icon, className = "", lines = 2 }) => {
  const { t } = useTranslation("common");
  const textId = useId();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);

  /** COMMENT: measure the full text height; re-measure when the width changes */
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 22;
      setFullHeight(el.scrollHeight);
      setCanExpand(el.scrollHeight > lineHeight * lines + 1);
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [note, lines]);

  const isClamped = canExpand && !expanded;

  // COMMENT: max-height animates between the clamped CSS value and the measured height
  const textStyle: React.CSSProperties | undefined = !canExpand
    ? { maxHeight: "none" }
    : expanded
    ? { maxHeight: `${fullHeight}px` }
    : undefined;

  return (
    <div className={`client-note ${className}`}>
      <div className="note-header">
        {icon}
        <span>{label}</span>
      </div>

      <p
        id={textId}
        ref={textRef}
        className={`note-text ${isClamped ? "is-clamped" : ""}`}
        style={textStyle}
      >
        {note}
      </p>

      {canExpand && (
        <button
          type="button"
          className="note-toggle"
          aria-expanded={expanded}
          aria-controls={textId}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? t("Show less") : t("Show more")}
        </button>
      )}
    </div>
  );
};

export default ExpandableNote;
