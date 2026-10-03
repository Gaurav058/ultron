# ULTRON — Persistent Memory & Retrieval Architecture

## 1. Multi-Tier Memory Hierarchy
ULTRON separates working conversational context from persistent knowledge to maximize response speed and minimize token costs:

```
Tier 1: Active Turn Context (RAM - Ingress messages, prompt tokens)
Tier 2: Session Working Memory (Recent turns, active entities, last mission ID)
Tier 3: Episodic Memory (Structured facts, mission outcomes, user preferences)
Tier 4: Vector & Semantic Memory (Long-term embeddings, repository index)
```

## 2. Fast Retrieval Pipeline (Section 7)
- Queries are filtered by category (`PREFERENCE`, `PROJECT`, `SYSTEM`, `MISSION`).
- Queries are bounded to top-k (default: 3) highest relevance items.
- In-memory cache handles hot entity lookups.
- Raw history is never fed wholesale into the prompt.

## 3. Preference Persistence (Section 26)
Persistent user preferences are captured via the `remember` tool:
- Preferred language & response style
- Primary tech stacks & project targets
- Sensitive credentials and keys are explicitly rejected from memory storage.
