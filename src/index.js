const Chat = require('./resources/chat');
const Images = require('./resources/images');
const Embeddings = require('./resources/embeddings');
const Models = require('./resources/models');
const Search = require('./resources/search');
const { NumexBridge } = require('./bridge');

class NumexApiClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  async _request(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'User-Agent': 'numex-node-sdk/1.1.0',
      ...(options.headers || {})
    };

    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, { ...options, headers });

    // Handle stream response
    if (options.stream) {
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Numex API Error [${res.status}]: ${errText}`);
      }
      return res.body; // Return the ReadableStream
    }

    // Handle normal JSON response
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(`Numex API Error [${res.status}]: ${data.error ? JSON.stringify(data.error) : JSON.stringify(data)}`);
    }

    return data;
  }

  post(path, data, options = {}) {
    return this._request(path, { method: 'POST', body: data, ...options });
  }

  get(path, options = {}) {
    return this._request(path, { method: 'GET', ...options });
  }
}

class Numex {
  /**
   * Initialize the Numex API Client & CLI Bridge
   * @param {Object} options 
   * @param {string} [options.apiKey] - Your Numex Developer API Key
   * @param {string} [options.baseURL] - Optional custom base URL
   * @param {string} [options.command] - Optional custom CLI command name
   * @param {string} [options.cwd] - Optional working directory
   */
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.NUMEX_API_KEY;
    if (!this.apiKey && options.requireApiKey !== false) {
      throw new Error("Numex API Key is required. Pass it via options or set NUMEX_API_KEY environment variable.");
    }
    
    this.baseURL = options.baseURL || 'https://api.numexai.com.tr/v1';
    this.client = new NumexApiClient(this.baseURL, this.apiKey);

    // CLI Bridge for programmatic CLI execution
    this.cli = new NumexBridge({
      command: options.command || 'numex',
      getCwd: () => options.cwd || process.cwd()
    });

    // Sub-modules
    this.chat = new Chat(this.client);
    this.images = new Images(this.client);
    this.embeddings = new Embeddings(this.client);
    this.models = new Models(this.client);
    this.search = new Search(this.client);
  }

  /**
   * Run programmatic CLI command
   * @param {string|Array<string>} command - CLI subcommand or array of arguments
   * @param {Array<string>|Object} [args=[]] - Additional arguments or options if args omitted
   * @param {Object} [options={}] - Options like timeout, cwd, env
   * @example await numex.run('coklu_duzenle', ['src/'], { timeout: 60000 })
   */
  async run(command, args = [], options = {}) {
    let fullArgs = [];

    if (Array.isArray(command)) {
      fullArgs = [...command];
      if (typeof args === 'object' && !Array.isArray(args)) {
        options = args;
      } else if (Array.isArray(args)) {
        fullArgs.push(...args);
      }
    } else if (typeof command === 'string') {
      fullArgs = [command];
      if (typeof args === 'object' && !Array.isArray(args)) {
        options = args;
      } else if (Array.isArray(args)) {
        fullArgs.push(...args);
      }
    }

    return this.cli.run(fullArgs, options);
  }
}

module.exports = { Numex, NumexApiClient, NumexBridge };
