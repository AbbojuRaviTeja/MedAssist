import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/Chat/ChatWindow';
import { MenuIcon, PlusIcon } from './components/icons';
import { useChat } from './hooks/useChat';
import './styles/variables.css';
import './styles/sidebar.css';
import './styles/chat.css';
import './App.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    groupedConversations,
    activeConversation,
    activeId,
    isStreaming,
    streamingContent,
    newChat,
    selectConversation,
    deleteConversation,
    sendMessage,
  } = useChat();

  function handleNewChat() {
    newChat();
    setSidebarOpen(false);
  }

  function handleSelectConversation(id) {
    selectConversation(id);
    setSidebarOpen(false);
  }

  return (
    <div className="app-shell">
      <Sidebar
        groupedConversations={groupedConversations}
        activeId={activeId}
        onNewChat={handleNewChat}
        onSelect={handleSelectConversation}
        onDelete={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-shell__main">
        {/* Mobile-only top bar */}
        <header className="mobile-header">
          <button
            className="mobile-header__btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            title="Conversations"
          >
            <MenuIcon size={18} />
          </button>

          <span className="mobile-header__title">MedAssist</span>

          <button
            className="mobile-header__btn"
            onClick={handleNewChat}
            aria-label="New conversation"
            title="New conversation"
          >
            <PlusIcon size={18} />
          </button>
        </header>

        <ChatWindow
          activeConversation={activeConversation}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}
