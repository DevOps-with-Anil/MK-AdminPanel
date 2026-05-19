import { useState, useCallback, useRef, useEffect } from "react";

type MessageType = "success" | "danger";

export const useFeedbackMessage = (autoHideDelay = 2000) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<MessageType>("success");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearMessage = useCallback(() => {
    setMessage("");
    setType("success");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showMessage = useCallback(
    (msg: string, msgType: MessageType = "success") => {
      // clear previous timer if exists
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setMessage(msg);
      setType(msgType);

      timerRef.current = setTimeout(() => {
        clearMessage();
      }, autoHideDelay);
    },
    [autoHideDelay, clearMessage]
  );

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    message,
    type,
    showMessage,
    clearMessage,
  };
};