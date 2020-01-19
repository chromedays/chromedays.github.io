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
    this.querySelector("a").addEventListener("click", this.onClick);
  }
}
customElements.define("menu-item", MenuItem);

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

class ResumePage extends HTMLElement {
  constructor() {
    super();
    this.id = "content-container";
    this.render();
  }

  render() {
    // TODO:
    this.innerHTML = `
      <div style="width: 100vw; height: 100%">
        <iframe style="width: 100vw; height: 100%" src="https://docs.google.com/document/d/e/2PACX-1vTGC_HE-Oo7poUPC1XWzK3G6t-uWDbxgkgrrLKCJrCB0zDhS-71pcAPn6k95cfzxQtg8wWUIPro4gWr/pub?embedded=true"></iframe>
      </div>
    `;
  }
}
customElements.define("resume-page", ResumePage);

class MainApp extends HTMLElement {
  constructor() {
    super();

    this.contentType = "home";

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

    switch (this.contentType) {
      case "blog":
        break;
      case "about":
        break;
      case "resume":
        console.log("resume page added");
        this.appendChild(new ResumePage());
        break;
    }

    menuBar.addItem(
      new MenuItem("blog", () => {
        console.log("blog");
        if (canvas != null) canvas.resetShape(3);
        this.contentType = "blog";
        this.render();
      })
    );
    menuBar.addItem(
      new MenuItem("about", () => {
        console.log("about");
        if (canvas != null) canvas.resetShape(6);
        this.contentType = "about";
        this.render();
      })
    );
    menuBar.addItem(
      new MenuItem("resume", () => {
        console.log("resume");
        if (canvas != null) canvas.resetShape(12);
        this.contentType = "resume";
        this.render();
      })
    );
  }
}
customElements.define("main-app", MainApp);
