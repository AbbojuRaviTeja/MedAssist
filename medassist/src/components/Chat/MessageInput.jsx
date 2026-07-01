import { useState, useRef, useEffect } from 'react';
import { SendIcon, StopIcon } from '../icons';

const MAX_TEXTAREA_HEIGHT = 200; // px

/**
 * Chat input bar: auto-growing textarea + send/stop button.
 * Enter sends; Shift+Enter inserts a newline.
 *
 * @param {function} onSend       - Called with the trimmed message string.
 * @param {boolean}  isStreaming  - Disables send and shows stop icon while true.
 */
export function MessageInput({ onSend, isStreaming }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Re-focus after streaming ends.
  useEffect(() => {
    if (!isStreaming) textareaRef.current?.focus();
  }, [isStreaming]);

  function resizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }

  function handleChange(e) {
    setValue(e.target.value);
    resizeTextarea();
  }

  function submit() {
    if (!value.trim() || isStreaming) return;
    onSend(value);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const canSend = value.trim().length > 0 && !isStreaming;

  return (
    <div className="input-area">
      <div className="input-area__wrapper">
        <textarea
          ref={textareaRef}
          className="input-area__textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask MedAssist anything about your health…"
          rows={1}
          disabled={isStreaming}
          aria-label="Message input"
        />
        <button
          className={`input-area__send-btn ${canSend || isStreaming ? 'input-area__send-btn--active' : ''}`}
          onClick={submit}
          disabled={!canSend && !isStreaming}
          title={isStreaming ? 'Stop' : 'Send message'}
          aria-label={isStreaming ? 'Stop generation' : 'Send message'}
        >
          {isStreaming ? <StopIcon size={13} /> : <SendIcon size={14} />}
        </button>
      </div>
      <p className="input-area__disclaimer">
        MedAssist provides general health information — not a substitute for professional medical advice.
      </p>
    </div>
  );
}
