class Search {
  constructor(client) {
    this.client = client;
  }

  async query(params) {
    return this.client.post('/search', params);
  }
}

module.exports = Search;
