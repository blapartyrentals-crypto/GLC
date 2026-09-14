import { Injectable } from "@nestjs/common";

export interface AppConfigShape {
  port: number;
  profile: string;
}

@Injectable()
export class AppConfig implements AppConfigShape {
  readonly port: number;
  readonly profile: string;

  constructor() {
    this.port = Number(process.env["PORT"] ?? 3000);
    this.profile = process.env["GLC_PROFILE"] ?? "commercial";
  }
}