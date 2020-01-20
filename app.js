import Router from "./router.js";
import { SimplePageRouteAction, LinkRouteAction } from "./route-actions.js";
import MenuBar from "./menu-bar.js";
import { SimplePageMenuItem, LinkMenuItem } from "./menu-items.js";

class App extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = /*html*/ `
      <header>
        <h1 id="title">ILGWON HA</h1>
        <h3 id="subtitle">GRAPHICS PROGRAMMER</h4>
      </header>
      <menu-bar></menu-bar>
      <div id="page-container"></div>
    `;

    const pageContainer = this.querySelector("#page-container");

    const menuBar = this.querySelector("menu-bar");
    const menuItems = [
      new SimplePageMenuItem("blog", pageContainer, /*html*/ `<div>N/A</div>`),
      new SimplePageMenuItem(
        "about",
        pageContainer,
        /*html*/ `<div>My name is Ilgwon. I am a junior student majoring in BS of CS in Real-Time Interactive Simulation at DigiPen Institute of Technology.</div>`
      ),
      new LinkMenuItem(
        "resume",
        "https://docs.google.com/viewer?url=https://github.com/chromedays/chromedays.github.io/raw/master/resume.pdf"
      )
    ];
    menuItems.forEach(menuItem => menuBar.addItem(menuItem));

    let routeActions = [
      new SimplePageRouteAction("", pageContainer, /*html*/ `<div>Home</div>`)
    ];

    routeActions = routeActions.concat(
      menuItems.map(menuItem => menuItem.routeAction)
    );

    this.router = new Router(routeActions);
  }
}
customElements.define("c-app", App);
