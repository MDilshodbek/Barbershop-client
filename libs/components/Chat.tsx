import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Box, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { useRouter } from "next/router";
import ScrollableFeed from "react-scrollable-feed";
import { useReactiveVar } from "@apollo/client";
import {
  AI_BOT_MEMBER,
  CHAT_MAX_LENGTH,
  ChatMessage,
  chatErrorVar,
  chatIsTypingVar,
  chatIsWaitingVar,
  chatLastSentTextVar,
  chatMessagesVar,
} from "../../apollo/chatStore";
import { ChatSocketStatus, chatStatusVar } from "../../apollo/store";
import { SendChatResult, sendChatMessage } from "../../apollo/chatSocket";
import ChatMessageText from "./ChatMessageText";
import { AiBotIcon, AiChatLauncherIcon } from "./AiIcons";
import { Messages } from "../config";
import { sweetErrorAlert } from "../sweetAlert";
import { useTranslation } from "react-i18next";

const COUNTER_WARNING_AT = CHAT_MAX_LENGTH - 50;
const HINT_DURATION = 3000;

// Comment: exact backend error texts; each one is also its i18n key
const KNOWN_SERVER_ERRORS = new Set([
  "Message is empty",
  "Message is too long (max 500 characters)",
  "Please wait for the current answer",
  "You are sending messages too fast",
]);

type SendFailReason = Extract<SendChatResult, { sent: false }>["reason"];

const SEND_HINT_KEYS: Record<Exclude<SendFailReason, "empty">, string> = {
  tooLong: "Message is too long (max 500 characters)",
  waiting: "Waiting for the answer…",
  cooldown: "Please wait a moment before sending again",
  notConnected: "Not connected to Barber AI",
};

const STATUS_LABEL_KEYS: Record<ChatSocketStatus, string> = {
  open: "Online",
  connecting: "Connecting…",
  closed: "Offline",
};

interface BotAvatarProps {
  className?: string;
  animated?: boolean;
}

// Comment: decorative, the "Barber AI" name is always shown next to it
const BotAvatar = memo(function BotAvatar({ className, animated = false }: BotAvatarProps) {
  return (
    <span className={`bot-avatar ${className ?? ""}`} aria-hidden={"true"}>
      <AiBotIcon size={"78%"} animated={animated} />
    </span>
  );
});

// Comment: memoized per message; the store keeps unchanged messages as the same object,
// so during streaming only the row that is growing re-renders
const ChatMessageRow = memo(function ChatMessageRow({ message }: { message: ChatMessage }) {
  const { text, role, memberData, streaming } = message;

  return role === "user" ? (
    <Box
      component={"div"}
      flexDirection={"row"}
      style={{ display: "flex" }}
      alignItems={"flex-end"}
      justifyContent={"flex-end"}
      sx={{ m: "10px 0px" }}
    >
      <div className={"msg-right"}>{text}</div>
    </Box>
  ) : (
    <Box flexDirection={"column"} style={{ display: "flex" }} sx={{ m: "10px 0px" }} component={"div"}>
      <div className="member-nick">{memberData?.memberNick || AI_BOT_MEMBER.memberNick}</div>
      <Box flexDirection={"row"} style={{ display: "flex" }} sx={{ m: "10px 0px" }} component={"div"}>
        <BotAvatar />
        <div className={"msg-left"}>
          <ChatMessageText text={text} streaming={streaming} />
        </div>
      </Box>
    </Box>
  );
});

const TypingIndicator = memo(function TypingIndicator() {
  const { t } = useTranslation("common");

  return (
    <Box flexDirection={"row"} style={{ display: "flex" }} sx={{ m: "10px 0px" }} component={"div"}>
      <BotAvatar />
      <div className={"msg-left typing"} role={"status"}>
        <span className={"typing-dots"} aria-hidden={"true"}>
          <span />
          <span />
          <span />
        </span>
        <span className={"typing-label"}>{t("Barber AI is typing…")}</span>
      </div>
    </Box>
  );
});

// Comment: the only part subscribed to the message list, so streamed chunks don't re-render the header,
// launcher or input. ScrollableFeed re-checks the scroll position whenever this re-renders.
const ChatMessageList = memo(function ChatMessageList() {
  const messagesList = useReactiveVar(chatMessagesVar);
  const isTyping = useReactiveVar(chatIsTypingVar);
  const showTyping = isTyping && !messagesList.some((m) => m.streaming);

  return (
    <ScrollableFeed>
      <Stack className={"chat-main"}>
        {messagesList.map((message) => (
          <ChatMessageRow key={message.id} message={message} />
        ))}
        {showTyping && <TypingIndicator />}
      </Stack>
    </ScrollableFeed>
  );
});

const ChatHeader = memo(function ChatHeader({ status }: { status: ChatSocketStatus }) {
  const { t } = useTranslation("common");

  return (
    <Box className={"chat-top"} component={"div"}>
      <BotAvatar className={"chat-top-avatar"} animated />
      <div className={"chat-top-info"}>
        <div className={"chat-title"}>{t("Barber AI")}</div>
        <div className={`chat-status ${status}`}>
          <span className={"status-dot"} />
          {t(STATUS_LABEL_KEYS[status])}
        </div>
      </div>
    </Box>
  );
});

const ChatLauncher = memo(function ChatLauncher({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { t } = useTranslation("common");

  return (
    <button
      className="chat-button"
      onClick={onToggle}
      aria-label={open ? t("Close AI chat") : t("Open AI chat")}
      aria-expanded={open}
    >
      <span className={"launcher-glow"} aria-hidden={"true"} />
      <span className={"launcher-ring"} aria-hidden={"true"} />
      <span className={"launcher-icon"} aria-hidden={"true"}>
        {open ? (
          <CloseFullscreenIcon sx={{ color: "var(--ai-grad-end) !important" }} />
        ) : (
          <AiChatLauncherIcon size={36} animated />
        )}
      </span>
      {!open && <span className={"launcher-badge"} aria-hidden={"true"} />}
    </button>
  );
});

const Chat = () => {
  const { t } = useTranslation("common");
  const chatContentRef = useRef<HTMLDivElement>(null);
  const textInput = useRef<HTMLInputElement>(null);
  const isWaiting = useReactiveVar(chatIsWaitingVar);
  const status = useReactiveVar(chatStatusVar);
  const chatError = useReactiveVar(chatErrorVar);
  const [messageInput, setMessageInput] = useState<string>("");
  const [sendHint, setSendHint] = useState<{ key: string; at: number } | null>(null);
  // Comment: an error that already existed before this mount was handled by a previous Chat instance
  const handledErrorId = useRef<string | null>(chatErrorVar()?.id ?? null);
  const [open, setOpen] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const router = useRouter();

  const canSend = status === "open" && !isWaiting;

  /** LIFECYCLES **/
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOpenButton(true);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setOpenButton(false);
  }, [router.pathname]);

  useEffect(() => {
    if (!sendHint) return;
    const timeoutId = setTimeout(() => setSendHint(null), HINT_DURATION);
    return () => clearTimeout(timeoutId);
  }, [sendHint]);

  useEffect(() => {
    if (!chatError || chatError.id === handledErrorId.current) return;
    handledErrorId.current = chatError.id;

    const message = KNOWN_SERVER_ERRORS.has(chatError.text)
      ? t(chatError.text)
      : chatError.text || Messages.error1;
    // Comment: give the rejected message back so the user doesn't have to retype it
    setMessageInput((prev) => prev || chatLastSentTextVar());
    sweetErrorAlert(message);
  }, [chatError, t]);

  /** HANDLERS **/
  const handleOpenChat = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const getInputMessageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value.slice(0, CHAT_MAX_LENGTH));
  };

  const getKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Comment: ignore Enter while an IME (Korean/Chinese) is still composing
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    e.preventDefault();
    onClickHandler();
  };

  const onClickHandler = () => {
    if (!canSend) return;
    const result = sendChatMessage(messageInput);
    if (result.sent) {
      setMessageInput("");
      setSendHint(null);
    } else if (result.reason === "empty") {
      sweetErrorAlert(Messages.error4);
    } else {
      setSendHint({ key: SEND_HINT_KEYS[result.reason], at: Date.now() });
    }
  };

  const charsLeft = CHAT_MAX_LENGTH - messageInput.length;
  const nearLimit = messageInput.length >= COUNTER_WARNING_AT;
  const stateHintKey =
    status === "connecting"
      ? "Connecting to Barber AI…"
      : status === "closed"
      ? "Not connected to Barber AI"
      : isWaiting
      ? "Waiting for the answer…"
      : null;
  const hintText = sendHint
    ? t(sendHint.key)
    : stateHintKey
    ? t(stateHintKey)
    : nearLimit
    ? t("{{left}} characters left", { left: charsLeft })
    : "";
  const counterClass = charsLeft === 0 ? "limit" : nearLimit ? "warn" : "";

  return (
    <Stack className="chatting">
      {openButton ? <ChatLauncher open={open} onToggle={handleOpenChat} /> : null}
      <Stack className={`chat-frame ${open ? "open" : ""}`}>
        <ChatHeader status={status} />
        <Box
          className={"chat-content"}
          id="chat-content"
          ref={chatContentRef}
          component={"div"}
        >
          <ChatMessageList />
        </Box>
        <Box className={"chat-bott"} component={"div"}>
          <div className={"chat-input-row"}>
            <input
              ref={textInput}
              type={"text"}
              name={"message"}
              className={"msg-input"}
              placeholder={t("Ask about services, prices, booking…")}
              aria-label={t("Ask about services, prices, booking…")}
              maxLength={CHAT_MAX_LENGTH}
              value={messageInput}
              onChange={getInputMessageHandler}
              onKeyDown={getKeyHandler}
            />
            <button
              className={"send-msg-btn"}
              onClick={onClickHandler}
              disabled={!canSend}
              aria-label={t("Send message")}
            >
              <SendIcon style={{ color: "#004034" }} />
            </button>
          </div>
          <div className={"chat-meta"}>
            <span className={"chat-hint"} aria-live={"polite"}>
              {hintText}
            </span>
            <span className={`chat-counter ${counterClass}`}>
              {messageInput.length}/{CHAT_MAX_LENGTH}
            </span>
          </div>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Chat;
