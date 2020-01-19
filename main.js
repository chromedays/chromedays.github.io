class MenuItem extends HTMLElement {
  constructor(name, onClick) {
    super();

    this.className = "menu-item";

    this.name = name;
    this.onClick = onClick;

    this.render();
  }

  render() {
    this.innerHTML = `
    <li id="${this.name}" ><a href="#">${this.name.toUpperCase()}</a></li>
    `;

    if (this.onClick != null) {
      console.log(this.name);
      this.querySelector("a").addEventListener("click", this.onClick);
    }
  }
}
customElements.define("menu-item", MenuItem);

class DirectLinkItem extends MenuItem {
  constructor(name, link) {
    super(name, null);

    this.link = link;

    this.render();
  }

  render() {
    super.render();

    this.querySelector("a").href = this.link;
    this.querySelector("a").target = "_blank";
  }
}
customElements.define("direct-link-item", DirectLinkItem);

class MenuBar extends HTMLElement {
  constructor() {
    super();

    this.items = [];

    this.render();
  }

  render() {
    this.innerHTML = `
        <ul id="menu-container">
        </ul>
    `;

    var container = this.querySelector("ul");
    this.items.forEach(item => {
      container.appendChild(item);
    });
  }

  addItem(item) {
    this.items.push(item);
    this.render();
  }
}
customElements.define("menu-bar", MenuBar);

class MainApp extends HTMLElement {
  constructor() {
    super();

    this.contentType = "projects";

    this.render();
  }

  render() {
    this.innerHTML = "";
    // TODO: gl context is created every time the render func gets called
    this.innerHTML = `
        <header>
          <h1 class="title">ILGWON HA</h1>
          <h3 class="subtitle">GRAPHICS PROGRAMMER</h4>
        </header>
        <menu-bar></menu-bar>
    `;

    const canvas = document.querySelector("gl-canvas");
    const menuBar = this.querySelector("menu-bar");

    menuBar.addItem(
      new MenuItem("blog", () => {
        console.log("blog");
        this.contentType = "blog";
        this.render();
      })
    );
    menuBar.addItem(
      new MenuItem("about", () => {
        console.log("about");
        this.contentType = "about";
        this.render();
      })
    );
    menuBar.addItem(
      new MenuItem("projects", () => {
        console.log("projects");
        this.contentType = "projects";
        this.render();
      })
    );
    menuBar.addItem(new DirectLinkItem("resume", "http://bit.ly/2NFEZdQ"));
  }
}
customElements.define("main-app", MainApp);
