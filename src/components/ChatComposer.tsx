import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Search, Sparkles } from "lucide-react";

type ChatComposerProps = {
  placeholder?: string;
  onSend?: (value: string) => void;
};

export default function ChatComposer({ placeholder = "Ask anything here", onSend }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(180, el.scrollHeight) + "px";
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setValue("");
  }

  return (
    <div className="composer">
      <div className="composer-inner">
        <label htmlFor="composer" className="composer-label">{placeholder}</label>
        <div className="composer-controls">
          <div className="tool-group">
            <div className="circle bg"><Sparkles width={14} height={14} color="var(--muted)" /></div>
            <button type="button" className="circle" aria-label="Open search"><Search width={16} height={16} color="var(--muted)" /></button>
          </div>
          <button type="button" aria-label="Send" onClick={submit} className="send-btn"><ArrowUp width={16} height={16} /></button>
        </div>
        <textarea id="composer" ref={textareaRef} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} className="sr-only" />
      </div>
    </div>
  );
}


