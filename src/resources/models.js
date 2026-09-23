class Models {
  constructor(client) {
    this.client = client;
  }

  async list() {
    return this.client.get('/models');
  }
}

module.exports = Models;
