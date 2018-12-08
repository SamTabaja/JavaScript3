'use strict';

class Repository {
  constructor(data) {
    this.data = data;
  }

  render(container) {
    Util.printRepoInfo(this.data)
  }

  fetchContributors() {
    return Util.fetchJSON(this.data.contributors_url);

  }

  name() {
    return this.data.name;
  }
}
