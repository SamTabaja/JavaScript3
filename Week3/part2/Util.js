'use strict';

// eslint-disable-next-line no-unused-vars
let repoName = []

class Util {
  static createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  static fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    });
  }

  static buildHTML() {
    const top = Util.createAndAppend("div", root, { id: "top" });
    const left = Util.createAndAppend("div", root, { id: "left" });
    const right = Util.createAndAppend("div", root, { id: "right" });
    //right elements
    Util.createAndAppend("h5", right, { text: "Contributions", "class": "rightTitle" });
    // top elements
    Util.createAndAppend("h7", top, { id: "title", text: "HYF-Repository" });
    Util.createAndAppend("select", top, { id: "select" });
    // left elements
    // repo name
    Util.createAndAppend("div", left, { id: "left1" });
    Util.createAndAppend("h7", left1, { id: "repository", text: "Repository: ", class: "headings first" });
    Util.createAndAppend("h7", left1, { id: "repositoryName", class: "txt first" });
    // reop description
    Util.createAndAppend("div", left, { id: "left2" });
    Util.createAndAppend("h7", left2, { id: "description", text: "Description: ", class: "headings first" });
    Util.createAndAppend("p", left2, { id: "descriptionText", class: "txt first" });
    // repo forks
    Util.createAndAppend("div", left, { id: "left3" });
    Util.createAndAppend("h7", left3, { id: "forkNumber", text: "Forks: ", class: "headings first" });
    Util.createAndAppend("h7", left3, { id: "forkText", class: "txt first" });
    // repo update
    Util.createAndAppend("div", left, { id: "left4" });
    Util.createAndAppend("h7", left4, { id: "update", text: "Updated: ", class: "headings first" });
    Util.createAndAppend("h7", left4, { id: "updateText", class: "txt first" });
  }
  
  static fillArrays(data) {
    for (let i = 0; i < data.length; i++) {
      repoName.push(data[i].name);
    }
  }

  static selectOptions(name) {
    let select = document.getElementById("select");
    for (let i = 0; i < name.length; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.text = name[i];
      select.appendChild(option);
    }
  }
  
  static selectOnChange(data) {
    select.addEventListener("change", function (e) {
      const i = e.target.value;
      Util.printRepoInfo(data[i])
      Util.getContributors(data[i])
    }); // end eventlistener
  }

  static printRepoInfo(data) {
    repositoryName.innerHTML = "<a href= '#' target='_blank'>" + data.name + "</a>";
    descriptionText.innerHTML = data.description;
    forkText.innerHTML = data.forks;
    updateText.innerHTML = data.updated_at;
  }
  
  static getContributors(data) {
    right.innerHTML = "";
    Util.createAndAppend("h5", right, { text: "Contributions", "class": "rightTitle" });
    let ul = Util.createAndAppend("ul", right, { "class": "ul" });
    Util.fetchJSON(data.contributors_url)
      .then(contributors => {
        contributors.forEach(c => {

          let li = Util.createAndAppend("li", ul, { "class": "li" });

          Util.createAndAppend("img", li, { "class": "avatar", "src": c.avatar_url });

          let login = Util.createAndAppend("div", li, { id: "login", "class": "liDivs" });
          const a = Util.createAndAppend("a", login, { "target": "_blank", "href": c.html_url, "class": "link" });
          Util.createAndAppend("h8", a, { text: c.login });

          let contributionsNumber = Util.createAndAppend("div", li, { id: "contributionsNumber", "class": "liDivs" });
          Util.createAndAppend("h8", contributionsNumber, { text: c.contributions });
        });
      })
      .catch(err => {
        Util.createAndAppend("div", right, { html: err.message, "class": "alert-error" });
      })
  }

}
