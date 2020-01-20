import { SimplePageRouteAction, LinkRouteAction } from "./route-actions.js";

class MenuItem extends HTMLElement {
  constructor(name, routeAction) {
    super();

    this.name = name;
    this.routeAction = routeAction;
    this.innerHTML = /*html*/ `<li id="${this.name}" ><a href="${
      this.routeAction.href
    }">${this.name.toUpperCase()}</a></li>`;
  }
}
customElements.define("c-menu", MenuItem);

export class SimplePageMenuItem extends MenuItem {
  constructor(name, pageContainer, pageHtml) {
    super(name, new SimplePageRouteAction(name, pageContainer, pageHtml));
  }
}
customElements.define("c-simple-page-menu", SimplePageMenuItem);

export class LinkMenuItem extends MenuItem {
  constructor(name, url) {
    super(name, new LinkRouteAction(url));

    this.querySelector("a").target = "_blank";
  }
}
customElements.define("c-link-menu", LinkMenuItem);
