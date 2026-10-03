# ULTRON — Autonomous Mission Execution & Conductor

## 1. Asynchronous Background Execution (Section 28)
Long-running missions (such as analyzing 100 competitors or running full test suites) never block synchronous HTTP requests:
1. The user or Gemini triggers `create_mission`.
2. A Directed Acyclic Graph (DAG) of task nodes is compiled.
3. The server immediately returns the `missionId` with initial task state.
4. Execution proceeds in background worker threads.
5. Real-time updates are dispatched via `UltronEventBus` to UI WebSockets/SSE.

## 2. Mission Continuity (Section 27)
When a user asks "Continue the research" or "What is the mission status?":
- The system checks `ConversationSession.activeMissionId`.
- The active mission is located and resumed without duplicate execution.

## 3. Real-Time Events (Section 29)
The UI subscribes to the canonical lifecycle events:
- `MISSION_CREATED`
- `MISSION_STARTED`
- `TASK_STARTED`
- `AGENT_STARTED`
- `TOOL_STARTED`
- `TOOL_COMPLETED`
- `TASK_COMPLETED`
- `MISSION_COMPLETED`
- `MISSION_FAILED`
- `APPROVAL_REQUIRED`
- `VOICE_CONNECTED`
- `VOICE_DISCONNECTED`
