import React, { ReactNode, memo } from "react";
import Link from "next/link";

// Comment: only paths that are real pages in this app become links
const KNOWN_ROUTES = new Set([
  "/",
  "/service",
  "/appointment",
  "/barber",
  "/barber/detail",
  "/community",
  "/community/detail",
  "/faq",
  "/notification",
  "/mypage",
  "/account",
]);

// Comment: matches [label](/path), (/path) and `/path` as the AI writes them
const PATH_PATTERN = /\[([^\]\n]+)\]\((\/[^\s)]*)\)|\((\/[^\s)]*)\)|`(\/[^\s`]*)`/g;

const isKnownRoute = (path: string) => KNOWN_ROUTES.has(path.split(/[?#]/)[0]);

interface ChatMessageTextProps {
  text: string;
  streaming?: boolean;
}

/** Renders bot text, turning internal page paths into clickable links */
const ChatMessageText = ({ text, streaming = false }: ChatMessageTextProps) => {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of Array.from(text.matchAll(PATH_PATTERN))) {
    const [full, label, mdPath, parenPath, codePath] = match;
    const path = mdPath ?? parenPath ?? codePath;
    if (!isKnownRoute(path)) continue;

    const start = match.index ?? 0;
    if (start > lastIndex) parts.push(text.slice(lastIndex, start));

    const link = (
      <Link key={start} href={path} className={"chat-link"}>
        {label ?? path}
      </Link>
    );
    // Comment: keep the parentheses around a bare (/path) so the sentence reads the same
    parts.push(parenPath ? <React.Fragment key={start}>({link})</React.Fragment> : link);
    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return (
    <span className={"msg-text"}>
      {parts}
      {streaming && <span className={"stream-cursor"} aria-hidden={"true"} />}
    </span>
  );
};

// Comment: memoized so links are only re-parsed for the message whose text changed
export default memo(ChatMessageText);
