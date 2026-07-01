export const APP_NAME = 'MedAssist';
export const APP_TAGLINE = 'Your AI-powered medical assistant';

export const ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
};

export const STORAGE_KEYS = {
  CONVERSATIONS: 'medassist_conversations',
  ACTIVE_ID: 'medassist_active_id',
};

export const STREAM_INITIAL_DELAY_MS = 500;
export const STREAM_TICK_MS = 12;

export const WELCOME_PROMPTS = [
  'What are common symptoms of type 2 diabetes?',
  'How can I lower my blood pressure naturally?',
  'Explain the difference between an MRI and a CT scan.',
  'What should I know about taking antibiotics?',
];
