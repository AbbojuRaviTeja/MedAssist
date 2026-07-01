import { useEffect, useRef } from 'react';
import { ROLES } from '../../constants';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { WelcomeScreen } from './WelcomeScreen';

const STREAMING_ID = '__streaming__';

/**
 * Main chat pane: message list + input bar.
 *
 * @param {object|null} activeConversation
 * @param {boolean}     isStreaming
 * @param {string}      streamingContent   Growing response text during streaming.
 * @param {function}    onSend
 */
export function ChatWindow({ activeConversation, isStreaming, streamingContent, onSend }) {
  const listRef = useRef(null);
  const messages = activeConversation?.messages ?? [];

  // Append a virtual message while the response streams in.
  const streamingMsg = isStreaming
    ? { id: STREAMING_ID, role: ROLES.ASSISTANT, content: streamingContent, timestamp: Date.now() }
    : null;

  const displayMessages = streamingMsg ? [...messages, streamingMsg] : messages;

  // Scroll to bottom on new messages (smooth) and during streaming (instant).
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    if (streamingContent) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'instant' });
    }
  }, [streamingContent]);

  return (
    <main className="chat-window">
      <div className="chat-window__messages" ref={listRef}>
        {displayMessages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={onSend} />
        ) : (
          displayMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              streaming={msg.id === STREAMING_ID}
            />
          ))
        )}
      </div>

      <MessageInput onSend={onSend} isStreaming={isStreaming} />
    </main>
  );
}
