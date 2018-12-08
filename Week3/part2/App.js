'use strict';

class App {
  constructor(url) {
    this.initialize(url);
  }

  async initialize(url) {
    Util.buildHTML();

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.sort((a, b) => a.name.localeCompare(b.name));
      Util.fillArrays(repos);
      Util.selectOptions(repoName);
      Util.selectOnChange(repos);
      

    } catch (error) {
      this.renderError(error);
    }
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
