export interface HealthInput {
  tenantId: string;
}

export interface HealthOutput {
  ok: boolean;
  engine: string;
}

export interface MatchCandidate {
  id: string;
  label: string;
  tags: string[];
}

export interface MatchRequest {
  tenantId: string;
  needs: string[];
  candidates: MatchCandidate[];
}

export interface MatchResult {
  candidateId: string;
  score: number;
  matchedTags: string[];
}

export interface MatchOutput {
  matches: MatchResult[];
}
