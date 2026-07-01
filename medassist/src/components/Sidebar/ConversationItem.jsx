import { useState } from 'react';
import { ChatIcon, TrashIcon } from '../icons';

export function ConversationItem({ conversation, isActive, onSelect, onDelete }) {
  const [hovered, setHovered] = useState(false);

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(conversation.id);
  }

  return (
    <button
      className={`conv-item ${isActive ? 'conv-item--active' : ''}`}
      onClick={() => onSelect(conversation.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={conversation.title}
    >
      <ChatIcon size={13} />
      <span className="conv-item__title">{conversation.title}</span>
      {hovered && (
        <span
          role="button"
          tabIndex={0}
          className="conv-item__delete"
          onClick={handleDelete}
          onKeyDown={(e) => e.key === 'Enter' && handleDelete(e)}
          title="Delete"
          aria-label={`Delete "${conversation.title}"`}
        >
          <TrashIcon size={13} />
        </span>
      )}
    </button>
  );
}
