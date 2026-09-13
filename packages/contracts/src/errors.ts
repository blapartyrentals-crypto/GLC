export type ErrorCode =
  | "TENANT_REQUIRED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "UPSTREAM"
  | "INTERNAL";

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export class GlcError extends Error {
  readonly code: ErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(code: ErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "GlcError";
    this.code = code;
    this.details = details;
  }
}