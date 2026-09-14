import type { DomainEvent } from "@glc/contracts";

/**
 * Minimal agent runtime contract (ADR-0007).
 *
 * The rest of the platform never depends on LangGraph.js directly: it talks
 * to this interface and to the event bus. Swapping the runtime for a
 * Python/LangGraph sidecar later is a deployment decision, not a code change.
 */
export interface AgentTool {
  name: string;
  description: string;
  run(input: unknown): Promise<unknown>;
}

export interface AgentStep {
  stepId: string;
  tool: string;
  input: unknown;
  output: unknown;
}

export interface AgentRunInput {
  goal: string;
  tenantId: string;
  traceId: string;
  tools: AgentTool[];
  context?: Record<string, unknown>;
}

export interface AgentRunOutput {
  runId: string;
  steps: AgentStep[];
  events: DomainEvent[];
  finishedAt: string;
}

export class AgentRunner {
  async run(_input: AgentRunInput): Promise<AgentRunOutput> {
    // Stub: connected to LangGraph.js and LiteLLM in the agent workstream.
    throw new Error("AgentRunner not wired yet");
  }
}