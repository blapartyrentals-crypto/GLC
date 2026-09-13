export interface EngineHealth {
  ok: boolean;
  engine: string;
  profile: string;
  version: string;
}

export function engineHealth(): EngineHealth {
  return {
    ok: true,
    engine: "glc-engine-runtime",
    profile: process.env["GLC_PROFILE"] ?? "commercial",
    version: "0.1.0"
  };
}