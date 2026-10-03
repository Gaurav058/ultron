/**
 * ULTRON ISOLATED DEMO DATA ADAPTER
 * Label: DEMO (Directive Section 38)
 *
 * This provides strictly typed reference fixtures matching input_file_0.png.
 * Connects directly to backend API/event bus where available.
 */

import { MissionItem, ChatMessage } from "@/types/mission";
import { WorkflowNode } from "@/types/workflow";
import { NewsStory } from "@/types/news";
import { SelectedLocation } from "@/types/location";
import { SystemStatus, SystemInfoMetadata } from "@/types/system";

export const DEMO_MISSIONS: MissionItem[] = [
  {
    id: "mission-1",
    title: "AI SaaS Market Research",
    description: "Analyzing top competitors and market trends...",
    status: "running",
    progress: 68,
    createdAt: "2026-05-21T08:30:00Z",
    updatedAt: "2026-05-21T10:42:00Z",
    timeAgo: "2h 12m ago",
  },
  {
    id: "mission-2",
    title: "UAE Real Estate Analysis",
    description: "Collecting and analyzing property market data...",
    status: "running",
    progress: 42,
    createdAt: "2026-05-21T06:57:00Z",
    updatedAt: "2026-05-21T10:42:00Z",
    timeAgo: "3h 45m ago",
  },
  {
    id: "mission-3",
    title: "Website Development",
    description: "Building modern website for Ultron OS...",
    status: "queued",
    createdAt: "2026-05-21T05:21:00Z",
    updatedAt: "2026-05-21T05:21:00Z",
    timeAgo: "5h 21m ago",
  },
  {
    id: "mission-4",
    title: "Competitor Intelligence",
    description: "Final report generated and saved...",
    status: "completed",
    progress: 100,
    createdAt: "2026-05-20T10:42:00Z",
    updatedAt: "2026-05-20T14:15:00Z",
    timeAgo: "1d ago",
  },
  {
    id: "mission-5",
    title: "Social Media Analysis",
    description: "API rate limit exceeded. Retrying...",
    status: "failed",
    createdAt: "2026-05-20T09:12:00Z",
    updatedAt: "2026-05-20T09:15:00Z",
    timeAgo: "1d ago",
  },
];

export const DEMO_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "chat-1",
    sender: "user",
    text: "Research AI SaaS platforms in the UAE",
    timestamp: "10:32 AM",
  },
  {
    id: "chat-2",
    sender: "ultron",
    text: "I've started a mission to research AI SaaS platforms in the UAE. I'll analyze top companies, competitors, pricing and opportunities.",
    timestamp: "10:32 AM",
    badge: "Mission Created",
    missionId: "mission-1",
  },
  {
    id: "chat-3",
    sender: "user",
    text: "Show me the latest news",
    timestamp: "10:21 AM",
  },
  {
    id: "chat-4",
    sender: "ultron",
    text: "Here are the top global news updates...",
    timestamp: "10:21 AM",
  },
];

export const DEMO_WORKFLOW_NODES: WorkflowNode[] = [
  {
    id: "node-user",
    agentId: "user",
    name: "User Request",
    type: "trigger",
    status: "completed",
    progress: 100,
    details: {
      task: "Research AI SaaS platforms in UAE",
    },
  },
  {
    id: "node-conductor",
    agentId: "conductor",
    name: "Conductor",
    type: "orchestrator",
    status: "planning",
    progress: 88,
    details: {
      task: "Decompose mission into parallel research threads and validation checks",
      tools: ["DAG Compiler", "Constraint Solver"],
    },
  },
  {
    id: "node-researcher",
    agentId: "researcher",
    name: "Researcher",
    type: "agent",
    status: "running",
    progress: 70,
    startedAt: "10:32:14",
    details: {
      task: "Research AI SaaS platforms",
      tools: ["Web Search", "URL Extraction"],
      summary: "Queried 12 regional market sources and indexed pricing tables",
    },
  },
  {
    id: "node-analyst",
    agentId: "analyst",
    name: "Analyst",
    type: "agent",
    status: "running",
    progress: 50,
    startedAt: "10:34:00",
    details: {
      task: "Synthesize competitive moat and unit economics",
      tools: ["Data Synthesis", "Financial Models"],
    },
  },
  {
    id: "node-websearch",
    agentId: "websearch",
    name: "Web Search",
    type: "tool",
    status: "completed",
    progress: 100,
    completedAt: "10:18:22",
    details: {
      task: "Extract top 20 SaaS startups in Dubai Internet City",
      tools: ["Search API", "Google Serper"],
    },
  },
  {
    id: "node-verifier",
    agentId: "verifier",
    name: "Verifier",
    type: "gate",
    status: "waiting",
    progress: 0,
    details: {
      task: "Validate revenue claims and domain certificates",
      tools: ["Reality Checker", "Source Consensus"],
    },
  },
  {
    id: "node-memory",
    agentId: "memory",
    name: "Memory",
    type: "storage",
    status: "waiting",
    progress: 0,
    details: {
      task: "Store key findings into durable vector graph",
      tools: ["Vector Embeddings", "Episodic Log"],
    },
  },
  {
    id: "node-mission",
    agentId: "mission",
    name: "Mission",
    type: "outcome",
    status: "running",
    progress: 68,
    details: {
      task: "Composite output delivery to operator",
    },
  },
];

export const DEMO_NEWS_STORIES: NewsStory[] = [
  {
    id: "news-1",
    title: "OpenAI unveils new reasoning model",
    source: "Reuters Tech",
    publishedAt: "2h ago",
    category: "AI",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    latitude: 37.7749,
    longitude: -122.4194,
    location: "San Francisco, USA",
  },
  {
    id: "news-2",
    title: "UAE announces $1B AI infrastructure",
    source: "Gulf Business",
    publishedAt: "4h ago",
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=150&auto=format&fit=crop&q=80",
    latitude: 25.2048,
    longitude: 55.2708,
    location: "Dubai, UAE",
  },
  {
    id: "news-3",
    title: "Google Gemini 1.5 gains new features",
    source: "The Verge",
    publishedAt: "6h ago",
    category: "AI",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&auto=format&fit=crop&q=80",
    latitude: 37.422,
    longitude: -122.0841,
    location: "Mountain View, USA",
  },
  {
    id: "news-4",
    title: "Global AI market to reach $1.8T by 2030",
    source: "Bloomberg",
    publishedAt: "8h ago",
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80",
    latitude: 51.5074,
    longitude: -0.1278,
    location: "London, UK",
  },
  {
    id: "news-5",
    title: "New breakthroughs in quantum computing",
    source: "Nature Physics",
    publishedAt: "10h ago",
    category: "Science",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=150&auto=format&fit=crop&q=80",
    latitude: 46.2044,
    longitude: 6.1432,
    location: "Geneva, Switzerland",
  },
];

export const DEMO_LOCATION_DUBAI: SelectedLocation = {
  latitude: 25.2048,
  longitude: 55.2708,
  country: "United Arab Emirates",
  region: "Middle East",
  city: "Dubai",
  weather: {
    temperature: "32°C",
    condition: "Partly Cloudy",
  },
  insights: [
    "UAE AI Investment up 42%",
    "New data center announced",
    "Regional tech summit next week",
  ],
  cameraStatus: "NO_AUTHORIZED_SOURCES",
  cameraSources: [],
  newsHeadlines: [
    "UAE announces $1B AI infrastructure initiative",
    "Dubai Future Foundation launches autonomous agent sandboxes",
  ],
};

export const DEMO_SYSTEM_STATUS: SystemStatus = {
  core: "online",
  api: "online",
  database: "online",
  memory: "online",
  agentRuntime: "online",
  toolFabric: "online",
  eventBus: "online",
  webSocket: "online",
};

export const DEMO_SYSTEM_INFO: SystemInfoMetadata = {
  model: "Gemini 1.5 Pro",
  contextWindow: "2M tokens",
  voiceModel: "Gemini Live",
  uptime: "99.8%",
  environment: "Production",
};
