# Execution Sequence (AI Fallback Path)

This diagram tracks the literal execution flow of the AI module built in `src/application/chat`, demonstrating how `FallbackChatStrategy.ts` prevents system crashes when `GeminiStrategy.ts` fails.

```mermaid
sequenceDiagram
    actor User
    participant UI as ChatWindow
    participant Factory as createChatStrategy
    participant Fallback as FallbackChatStrategy
    participant Primary as GeminiStrategy
    participant API as LLM Network Endpoint
    participant Mock as MockStrategy

    Note over User, Factory: Environment Initialization
    Factory-->>Fallback: returns instance wrapped around Gemini & Mock
    
    User->>UI: Types "Hello" (clicks send)
    UI->>Fallback: .sendMessage("Hello")
    
    Fallback->>Primary: .sendMessage("Hello")
    Primary->>API: HTTP POST /api/chat
    
    Note over API: External Vendor Outage
    API-->>Primary: 503 Service Unavailable / Timeout
    
    Primary--xFallback: throws Error("API Unreachable")
    Note over Fallback: Catches error (swallows crash)
    
    Fallback->>Mock: .sendMessage("Hello")
    Mock-->>Fallback: returns "(Mock) Service degraded. Stubbed reply."
    Fallback-->>UI: returns "(Mock) Service degraded..."
    UI-->>User: Renders text gracefully
```
