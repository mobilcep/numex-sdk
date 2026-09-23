class Embeddings {
  constructor(client) {
    this.client = client;
  }

  async create(params) {
    return this.client.post('/embeddings', params);
  }
}

module.exports = Embeddings;
