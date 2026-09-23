// Numex /chat uç noktası { message, history } bekler; OpenAI tarzı { messages } da
// verilebilsin diye son kullanıcı mesajını ve önceki mesajları bu alanlara da kopyalarız.
function withMessageFields(params = {}) {
  if (params.message || !Array.isArray(params.messages) || !params.messages.length) return params;
  let lastUser = -1;
  for (let i = params.messages.length - 1; i >= 0; i--) {
    if (params.messages[i] && params.messages[i].role === 'user') { lastUser = i; break; }
  }
  if (lastUser === -1) return params;
  const content = params.messages[lastUser].content;
  const message = typeof content === 'string'
    ? content
    : Array.isArray(content) ? content.map((c) => (c && c.text) || '').join('') : '';
  const history = params.history || params.messages.slice(0, lastUser);
  return { ...params, message, history };
}

class ChatCompletions {
  constructor(client) {
    this.client = client;
  }

  async create(params) {
    params = withMessageFields(params);
    // If stream is requested, use the appropriate streaming endpoint/method
    if (params.stream) {
      return this.client.post('/chat/stream', params, { stream: true });
    }
    return this.client.post('/chat', params);
  }
}

class Chat {
  constructor(client) {
    this.completions = new ChatCompletions(client);
  }
}

module.exports = Chat;
