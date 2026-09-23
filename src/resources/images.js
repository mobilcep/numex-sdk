class Images {
  constructor(client) {
    this.client = client;
  }

  async generate(params) {
    return this.client.post('/images/generations', params);
  }
}

module.exports = Images;
