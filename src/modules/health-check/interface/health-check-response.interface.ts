interface IDependencies {
  database: { status: string; response_time_ms: number };
}

export interface IHealthCheckResponse {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
  uptime_seconds: number;
  dependencies: IDependencies;
}
