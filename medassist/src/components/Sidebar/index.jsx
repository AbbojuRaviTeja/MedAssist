import { MedCrossIcon, PlusIcon } from '../icons';
import { ConversationItem } from './ConversationItem';

/**
 * @param {object[]} groupedConversations  [[label, convs[]], ...]
 * @param {string|null} activeId
 * @param {boolean} isOpen   Mobile visibility toggle
 */
export function Sidebar({ groupedConversations, activeId, onNewChat, onSelect, onDelete, isOpen, onClose }) {
  return (
    <>
      {/* Backdrop — mobile only */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} aria-label="Conversations">
        {/* Brand + new-chat */}
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <MedCrossIcon size={17} />
            <span>MedAssist</span>
          </div>
          <button className="sidebar__new-btn" onClick={onNewChat} title="New conversation" aria-label="New conversation">
            <PlusIcon size={15} />
          </button>
        </div>

        {/* Conversation list */}
        <nav className="sidebar__nav">
          {groupedConversations.length === 0 ? (
            <p className="sidebar__empty">No conversations yet.<br />Ask your first question!</p>
          ) : (
            groupedConversations.map(([label, convs]) => (
              <div key={label} className="sidebar__group">
                <p className="sidebar__group-label">{label}</p>
                {convs.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeId}
                    onSelect={onSelect}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            ))
          )}
        </nav>

        {/* Footer user badge */}
        <div className="sidebar__footer">
          <div className="user-badge">
            <div className="user-badge__avatar">U</div>
            <div className="user-badge__info">
              <span className="user-badge__name">User</span>
              <span className="user-badge__plan">MedAssist Free</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
