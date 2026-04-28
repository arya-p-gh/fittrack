# Execution Sequence (AI Fallback Path)

This diagram tracks the execution flow of the AI module in `src/application/chat`. It reflects the current codebase, where the frontend calls `/api/chat` but `backend/server.js` does not implement that route—so the primary strategy fails and fallback returns a mock reply.

```mermaid
sequenceDiagram
  actor User
  participant UI as ChatWindow.tsx
  participant Factory as createChatStrategy.ts
  participant Fallback as FallbackChatStrategy
  participant Primary as GeminiStrategy
  participant Backend as Express API
  participant Mock as MockStrategy

  Note over UI,Factory: App startup (module init)
  UI->>Factory: createChatStrategy()
  Factory-->>UI: returns Fallback(Gemini("/api/chat"), Mock)

  User->>UI: Types message + Send
  UI->>Fallback: sendMessage(userMessage)

  Fallback->>Primary: sendMessage(userMessage)
  Primary->>Backend: POST /api/chat (expects {reply})

  Note over Backend: Route /api/chat is NOT implemented in backend/server.js
  Backend-->>Primary: 404 Not Found (or network error)

  Primary--xFallback: throws Error
  Fallback->>Mock: sendMessage(userMessage)
  Mock-->>Fallback: returns stub reply
  Fallback-->>UI: stub reply
  UI-->>User: Renders assistant message
```
