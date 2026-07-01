import { MedCrossIcon } from '../icons';
import { APP_NAME, APP_TAGLINE, WELCOME_PROMPTS } from '../../constants';

/**
 * Shown when there are no messages in the active conversation.
 * @param {function} onSuggestionClick - Called with the suggestion text.
 */
export function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="welcome">
      <div className="welcome__icon">
        <MedCrossIcon size={34} />
      </div>
      <h1 className="welcome__title">{APP_NAME}</h1>
      <p className="welcome__subtitle">{APP_TAGLINE}</p>

      <div className="welcome__suggestions">
        {WELCOME_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            className="suggestion-btn"
            onClick={() => onSuggestionClick(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
