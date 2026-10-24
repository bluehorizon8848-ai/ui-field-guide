// Cloudflare Pages Functions and D1 Database type declarations

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta: Record<string, unknown>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec<T = unknown>(query: string): Promise<D1Result<T>>;
}

interface EventContext<Env, P extends string, Data> {
  request: Request & { cf?: { country?: string; [key: string]: unknown } };
  functionPath: string;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
}

type PagesFunction<
  Env = unknown,
  P extends string = string,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (context: EventContext<Env, P, Data>) => Response | Promise<Response>;
