export interface PostgrestError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export interface PostgrestResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

export interface SupabaseClientOptions {
  headers?: Record<string, string>;
  fetch?: typeof fetch;
  auth?: {
    persistSession?: boolean;
  };
}

export interface SupabaseQueryBuilder<T = any> extends PromiseLike<PostgrestResponse<T[]>> {
  insert(values: any): SupabaseQueryBuilder<T>;
  update(values: any): SupabaseQueryBuilder<T>;
  select(columns?: string): SupabaseQueryBuilder<T>;
  eq(column: string, value: any): SupabaseQueryBuilder<T>;
  order(column: string, options?: { ascending?: boolean }): SupabaseQueryBuilder<T>;
  single(): Promise<PostgrestResponse<T>>;
  catch<TResult = never>(
    onrejected?: (reason: any) => TResult | PromiseLike<TResult>
  ): Promise<PostgrestResponse<T[]> | TResult>;
  finally(onfinally?: () => void): Promise<PostgrestResponse<T[]>>;
}

export interface SupabaseClient {
  from<T = any>(table: string): SupabaseQueryBuilder<T>;
  rpc<T = any>(fnName: string, params?: Record<string, any>): Promise<PostgrestResponse<T>>;
}

export declare class SupabaseError extends Error implements PostgrestError {
  details?: string;
  hint?: string;
  code?: string;
}

export declare function createClient(url: string, key: string, options?: SupabaseClientOptions): SupabaseClient;

declare const _default: {
  createClient: typeof createClient;
};

export default _default;
