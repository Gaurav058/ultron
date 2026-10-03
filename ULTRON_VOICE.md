# ULTRON — Voice & Gemini Live Architecture

## 1. Real-Time Bidirectional Voice Layer
ULTRON voice is powered by Google's Gemini Live API, delivering low-latency speech input and native audio output over WebSockets.

```
MICROPHONE
    │
    ▼
AUDIO CAPTURE (Web Audio API / AudioWorklet)
    │  (16-bit PCM, 16kHz, little-endian, 20-40ms chunks)
    ▼
ULTRON CLIENT WEBSOCKET (Authenticated with Ephemeral Token)
    │
    ▼
GEMINI LIVE ENGINE
    │  (Server VAD & barge-in detection)
    ▼
AUDIO RESPONSE (24kHz PCM)
    │
    ▼
AUDIO PLAYBACK (AudioContext Buffer Queue)
```

## 2. Audio Specifications (Section 14 & 15)
- **Input Format:** 16-bit Linear PCM, 16,000 Hz, little-endian, mono.
- **Output Format:** 24,000 Hz Linear PCM.
- **Chunk Size:** 20ms to 40ms audio chunks (320–640 samples per packet) to eliminate front-end buffering latency.

## 3. Session State Machine (Section 18)
The client and server strictly synchronize across 11 canonical states:
1. `IDLE`: Microphone inactive, system awaiting wake-word or button tap.
2. `CONNECTING`: Establishing WebSocket with ephemeral token.
3. `CONNECTED`: WebSocket authenticated and ready.
4. `LISTENING`: Microphone streaming PCM audio chunks.
5. `THINKING`: User stopped speaking; model processing tokens.
6. `EXECUTING`: Function call in progress (e.g. `create_mission`).
7. `SPEAKING`: Model returning 24kHz PCM stream.
8. `INTERRUPTED`: User spoke while model was outputting (barge-in triggered; audio queue cleared immediately).
9. `RECONNECTING`: Network blip; attempting session resumption.
10. `ERROR`: Diagnostic failure or auth error.
11. `DISCONNECTED`: Session cleanly terminated.

## 4. Barge-In & Interruption Handling (Section 17)
When the user speaks while ULTRON is speaking:
1. Gemini Live issues an interruption event.
2. The client immediately stops audio playback, purges all buffered 24kHz PCM frames, and resets the playback pointer.
3. The UI state updates from `SPEAKING` to `INTERRUPTED` then `LISTENING`.

## 5. Session Resumption (Section 19)
If the WebSocket terminates:
- The provider preserves the latest valid `resumptionHandle`.
- On reconnect, the client submits the handle to restore context without replaying full conversational history.
