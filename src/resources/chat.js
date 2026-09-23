class ChatCompletions {
  constructor(client) {
    this.client = client;
  }

  async create(params) {
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
