'use strict';

{
  let repoName = [];

  function fetchJSON(url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      }
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function selectOptions(name) {
    let select = document.getElementById("select");
    for (let i = 0; i < name.length; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.text = name[i];
      select.appendChild(option);
    }
  }

  function buildHTML() {
    createAndAppend("div", root, { id: "top" });
    createAndAppend("div", root, { id: "left" });
    createAndAppend("div", root, { id: "right" });
    const top = document.getElementById('top');
    const left = document.getElementById('left');
    let right = document.getElementById('right');
    //right elements
    createAndAppend("h5", right, { text: "Contributions", "class": "rightTitle" });
    // top elements
    createAndAppend("h7", top, { id: "title", text: "HYF-Repository" });
    createAndAppend("select", top, { id: "select" });
    // left elements
    createAndAppend("div", left, { id: "left1" });
    createAndAppend("h7", left1, { id: "repository", text: "Repository: ", class: "headings first" });
    createAndAppend("h7", left1, { id: "repositoryName", class: "txt first" });

    createAndAppend("div", left, { id: "left2" });
    createAndAppend("h7", left2, { id: "description", text: "Description: ", class: "headings first" });
    createAndAppend("p", left2, { id: "descriptionText", class: "txt first" });

    createAndAppend("div", left, { id: "left3" });
    createAndAppend("h7", left3, { id: "forkNumber", text: "Forks: ", class: "headings first" });
    createAndAppend("h7", left3, { id: "forkText", class: "txt first" });

    createAndAppend("div", left, { id: "left4" });
    createAndAppend("h7", left4, { id: "update", text: "Updated: ", class: "headings first" });
    createAndAppend("h7", left4, { id: "updateText", class: "txt first" });

  }

  function fillArrays(data) {
    for (let i = 0; i < data.length; i++) {
      repoName.push(data[i].name);
    }
  }

  function selectOnChange(data) {
    select.addEventListener("change", function (e) {
      const i = e.target.value;
      printRepoInfo(data[i])
      getContributors(data[i])
    }); // end eventlistener
  }

  function printRepoInfo(data) {
    repositoryName.innerHTML = "<a href= '#' target='_blank'>" + data.name + "</a>";
    descriptionText.innerHTML = data.description;
    forkText.innerHTML = data.forks;
    updateText.innerHTML = data.updated_at;
  }

  async function getContributors(data) {
    right.innerHTML = "";
    createAndAppend("h5", right, { text: "Contributions", "class": "rightTitle" });
    let ul = createAndAppend("ul", right, { "class": "ul" });
    let contributors = await fetchJSON(data.contributors_url)
    try {
      contributors.forEach(c => {

        let li = createAndAppend("li", ul, { "class": "li" });

        createAndAppend("img", li, { "class": "avatar", "src": c.avatar_url });

        let login = createAndAppend("div", li, { id: "login", "class": "liDivs" });
        const a = createAndAppend("a", login, { "target": "_blank", "href": c.html_url, "class": "link" });
        createAndAppend("h8", a, { text: c.login });

        let contributionsNumber = createAndAppend("div", li, { id: "contributionsNumber", "class": "liDivs" });
        createAndAppend("h8", contributionsNumber, { text: c.contributions });
      });
    }
    catch (err) {
      createAndAppend("div", right, { html: err.message, "class": "alert-error" });
    }
  }


  async function main(url) {
    try {
      let data = await fetchJSON(url)
      data.sort((a, b) => a.name.localeCompare(b.name));
      fillArrays(data);
      buildHTML()
      selectOptions(repoName)
      selectOnChange(data)
    }
    catch (err) {
      createAndAppend('div', root, { text: err.message, class: 'alert-error' });
    }
  } //end of main fucntion

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}


