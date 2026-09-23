export interface NumexOptions {
  apiKey?: string;
  baseURL?: string;
  /** Node executable path (e.g. process.execPath) or CLI command name (e.g. 'numex') */
  command?: string;
  cwd?: string;
  requireApiKey?: boolean;
}

export interface NumexBridgeOptions {
  /** Node executable path (e.g. process.execPath) or CLI command name (e.g. 'numex') */
  command?: string;
  getCwd?: () => string;
  shell?: boolean;
}

export interface NumexBridgeRunOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  command?: string;
}

export interface NumexBridgeResult {
  success: boolean;
  stdout: string;
  stderr: string;
  code: number | null;
  data?: any;
  error?: string;
}

export class NumexBridge {
  constructor(options?: NumexBridgeOptions);
  run(args?: string[], options?: NumexBridgeRunOptions): Promise<NumexBridgeResult>;
  runJson(args?: string[], options?: NumexBridgeRunOptions): Promise<any | null>;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | any[];
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  stream?: boolean;
  [key: string]: any;
}

export class ChatCompletions {
  create(params: ChatCompletionRequest): Promise<any>;
}

export class Chat {
  completions: ChatCompletions;
}

export class Images {
  generate(params: {
    prompt: string;
    n?: number;
    size?: string;
    [key: string]: any;
  }): Promise<any>;
}

export class Embeddings {
  create(params: {
    input: string | string[];
    model?: string;
    [key: string]: any;
  }): Promise<any>;
}

export class Models {
  list(): Promise<any>;
}

export class Search {
  query(params: {
    query: string;
    [key: string]: any;
  }): Promise<any>;
}

export class NumexApiClient {
  constructor(baseURL: string, apiKey?: string);
  post(path: string, data?: any, options?: any): Promise<any>;
  get(path: string, options?: any): Promise<any>;
}

export class Numex {
  constructor(options?: NumexOptions);
  apiKey?: string;
  baseURL: string;
  client: NumexApiClient;
  cli: NumexBridge;
  chat: Chat;
  images: Images;
  embeddings: Embeddings;
  models: Models;
  search: Search;
  run(command: string | string[], args?: string[] | Record<string, any>, options?: NumexBridgeRunOptions): Promise<NumexBridgeResult>;
}

export default Numex;
