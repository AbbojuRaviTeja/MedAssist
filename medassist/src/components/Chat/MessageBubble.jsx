import { ROLES } from '../../constants';
import { MarkdownContent } from '../../utils/markdown';
import { TypingIndicator } from './TypingIndicator';
import { MedCrossIcon, UserIcon } from '../icons';
import { formatTime } from '../../utils/helpers';

/**
 * Renders a single chat message.
 *
 * @param {object}  message   - { id, role, content, timestamp }
 * @param {boolean} streaming - True while this bubble is being streamed in.
 */
export function MessageBubble({ message, streaming = false }) {
  const isUser = message.role === ROLES.USER;

  return (
    <div className={`message ${isUser ? 'message--user' : 'message--assistant'}`}>
      {!isUser && (
        <div className="message__avatar" aria-hidden="true">
          <MedCrossIcon size={16} />
        </div>
      )}

      <div className="message__body">
        {!isUser && <div className="message__author">MedAssist AI</div>}

        <div className="message__content">
          {isUser ? (
            /* User text: plain, inside a bubble */
            <p>{message.content}</p>
          ) : message.content ? (
            /* Assistant text: rendered markdown */
            <>
              <MarkdownContent content={message.content} />
              {streaming && <span className="cursor-blink" aria-hidden="true" />}
            </>
          ) : (
            /* Empty content during the initial delay before streaming begins */
            <TypingIndicator />
          )}
        </div>

        {!streaming && (
          <time
            className="message__time"
            dateTime={new Date(message.timestamp).toISOString()}
          >
            {formatTime(message.timestamp)}
          </time>
        )}
      </div>

      {isUser && (
        <div className="message__avatar message__avatar--user" aria-hidden="true">
          <UserIcon size={14} />
        </div>
      )}
    </div>
  );
}
