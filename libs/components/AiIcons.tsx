import React, { memo, useId } from "react";

// Comment: colors come from CSS variables (see .chatting in scss/pc/main.scss) so the icons follow light/dark themes.
// Each icon is a stack of same-size SVG layers. Animated parts (eyes, antenna glow, sparkle) live in their own
// layer, so their transform/opacity animations run on the compositor instead of forcing style recalc, layout
// and repaint on the main thread every frame. The static drawing is identical to a single SVG.

interface AiIconProps {
  size?: number | string;
  /** Enables blinking eyes, glowing antenna and twinkling sparkle */
  animated?: boolean;
  className?: string;
}

const VIEW_BOX = "0 0 64 64";

// Comment: useId keeps gradient ids unique when several icons are on the page
const useGradientId = (prefix: string) => `${prefix}-${useId().replace(/:/g, "")}`;

const GradientStops = () => (
  <>
    <stop offset="0%" style={{ stopColor: "var(--ai-grad-start)" }} />
    <stop offset="100%" style={{ stopColor: "var(--ai-grad-end)" }} />
  </>
);

// Comment: the layer is an HTML span (not the <svg> itself) because Chrome only composites
// transform/opacity animations on HTML elements, never on SVG elements
const Layer = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span className={`ai-layer ${className ?? ""}`}>
    <svg viewBox={VIEW_BOX} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      {children}
    </svg>
  </span>
);

const iconStyle = (size: number | string) => ({ width: size, height: size });

/** Cute rounded robot head: the Barber AI avatar */
export const AiBotIcon = memo(function AiBotIcon({ size = 40, animated = false, className }: AiIconProps) {
  const gradientId = useGradientId("ai-bot-grad");
  const fill = `url(#${gradientId})`;

  return (
    <span
      className={`ai-icon ai-bot ${animated ? "ai-animated" : ""} ${className ?? ""}`}
      style={iconStyle(size)}
      aria-hidden="true"
    >
      <Layer>
        <defs>
          <linearGradient id={gradientId} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
            <GradientStops />
          </linearGradient>
        </defs>

        {/* antenna */}
        <rect x="30.5" y="7" width="3" height="9" rx="1.5" fill={fill} />
        <circle cx="32" cy="7" r="3.6" style={{ fill: "var(--ai-accent)" }} />

        {/* ears */}
        <rect x="5" y="29" width="7" height="13" rx="3.5" fill={fill} />
        <rect x="52" y="29" width="7" height="13" rx="3.5" fill={fill} />

        {/* head */}
        <rect x="9" y="15" width="46" height="41" rx="17" fill={fill} />
        <ellipse cx="22" cy="21" rx="8" ry="3.5" fill="#fff" opacity="0.2" />

        {/* face screen */}
        <rect x="15" y="23" width="34" height="26" rx="12" style={{ fill: "var(--ai-face)" }} />

        {/* cheeks */}
        <circle cx="20.5" cy="41" r="2.3" style={{ fill: "var(--ai-cheek)" }} opacity="0.6" />
        <circle cx="43.5" cy="41" r="2.3" style={{ fill: "var(--ai-cheek)" }} opacity="0.6" />

        {/* smile */}
        <path
          d="M27.5 41 Q32 44.5 36.5 41"
          strokeWidth="2.6"
          strokeLinecap="round"
          style={{ stroke: "var(--ai-eye)" }}
        />
      </Layer>

      {/* antenna glow */}
      <Layer className="ai-layer-glow">
        <circle cx="32" cy="7" r="6" style={{ fill: "var(--ai-accent)" }} />
      </Layer>

      {/* eyes */}
      <Layer className="ai-layer-eyes">
        <ellipse cx="25" cy="34" rx="3.3" ry="4.3" style={{ fill: "var(--ai-eye)" }} />
        <ellipse cx="39" cy="34" rx="3.3" ry="4.3" style={{ fill: "var(--ai-eye)" }} />
      </Layer>
    </span>
  );
});

/** Rounded speech bubble with the same AI face and a sparkle: the chat launcher */
export const AiChatLauncherIcon = memo(function AiChatLauncherIcon({
  size = 36,
  animated = false,
  className,
}: AiIconProps) {
  const gradientId = useGradientId("ai-chat-grad");
  const fill = `url(#${gradientId})`;

  return (
    <span
      className={`ai-icon ai-launcher ${animated ? "ai-animated" : ""} ${className ?? ""}`}
      style={iconStyle(size)}
      aria-hidden="true"
    >
      <Layer>
        <defs>
          <linearGradient id={gradientId} x1="6" y1="8" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <GradientStops />
          </linearGradient>
        </defs>

        {/* bubble + tail */}
        <rect x="5" y="9" width="50" height="40" rx="18" fill={fill} />
        <path
          d="M17 44 L12.5 56.5 L29 47.5 Z"
          fill={fill}
          stroke={fill}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <ellipse cx="18" cy="16" rx="8" ry="3.3" fill="#fff" opacity="0.2" />

        {/* smile */}
        <path
          d="M25 36 Q30 40 35 36"
          strokeWidth="2.6"
          strokeLinecap="round"
          style={{ stroke: "var(--ai-face)" }}
        />
      </Layer>

      {/* eyes */}
      <Layer className="ai-layer-eyes">
        <ellipse cx="23" cy="28" rx="3.4" ry="4.4" style={{ fill: "var(--ai-face)" }} />
        <ellipse cx="37" cy="28" rx="3.4" ry="4.4" style={{ fill: "var(--ai-face)" }} />
      </Layer>

      {/* sparkle */}
      <Layer className="ai-layer-sparkle">
        <path
          d="M52 4 Q53.2 10.8 60 12 Q53.2 13.2 52 20 Q50.8 13.2 44 12 Q50.8 10.8 52 4 Z"
          style={{ fill: "var(--ai-accent)" }}
        />
      </Layer>
    </span>
  );
});
