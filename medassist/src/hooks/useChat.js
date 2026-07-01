import { useState, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { streamResponse } from '../services/chatService';
import { generateId, titleFromMessage, groupByDate } from '../utils/helpers';
import { ROLES, STORAGE_KEYS } from '../constants';

/**
 * Central chat state manager.
 *
 * Owns: conversation list, active conversation, streaming state.
 * Exposes: CRUD actions + sendMessage with streaming simulation.
 */
export function useChat() {
  const [conversations, setConversations] = useLocalStorage(STORAGE_KEYS.CONVERSATIONS, []);
  const [activeId, setActiveId] = useLocalStorage(STORAGE_KEYS.ACTIVE_ID, null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const cancelStreamRef = useRef(null);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;
  const groupedConversations = groupByDate(conversations);

  function newChat() {
    if (isStreaming) return;
    setActiveId(null);
  }

  function selectConversation(id) {
    if (isStreaming) return;
    setActiveId(id);
  }

  function deleteConversation(id) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveId((prev) => (prev === id ? null : prev));
  }

  function sendMessage(content) {
    const text = content.trim();
    if (!text || isStreaming) return;

    // Resolve or lazily create the target conversation.
    let convId = activeId;
    const convExists = conversations.some((c) => c.id === convId);

    if (!convId || !convExists) {
      convId = generateId();
      const newConv = {
        id: convId,
        title: titleFromMessage(text),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      // Both setters are batched by React — functional update in the next
      // setConversations call will see this new conversation in `prev`.
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(convId);
    }

    const userMsg = {
      id: generateId(),
      role: ROLES.USER,
      content: text,
      timestamp: Date.now(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              // Only auto-title from the first message.
              title: c.messages.length === 0 ? titleFromMessage(text) : c.title,
              messages: [...c.messages, userMsg],
              updatedAt: Date.now(),
            }
          : c
      )
    );

    setIsStreaming(true);
    setStreamingContent('');

    cancelStreamRef.current = streamResponse(
      text,
      (chunk) => setStreamingContent(chunk),
      (fullContent) => {
        const assistantMsg = {
          id: generateId(),
          role: ROLES.ASSISTANT,
          content: fullContent,
          timestamp: Date.now(),
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() }
              : c
          )
        );

        setIsStreaming(false);
        setStreamingContent('');
        cancelStreamRef.current = null;
      }
    );
  }

  return {
    conversations,
    groupedConversations,
    activeConversation,
    activeId,
    isStreaming,
    streamingContent,
    newChat,
    selectConversation,
    deleteConversation,
    sendMessage,
  };
}
