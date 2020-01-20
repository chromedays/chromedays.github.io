class RouteActionBase {
  constructor() {}

  onRegisterRouteAction() {}

  get href() {
    return "";
  }
}

export class LinkRouteAction extends RouteActionBase {
  constructor(url) {
    super();

    this.url = url;
  }

  get href() {
    return this.url;
  }
}

export class SimplePageRouteAction extends RouteActionBase {
  constructor(name, container, html) {
    super();

    this.name = name;
    this.container = container;
    this.html = html;
  }

  onRegisterRouteAction(router) {
    router.register("/" + this.name.toLowerCase(), async () => {
      this.container.innerHTML = this.html;
    });
  }

  get href() {
    return "/#/" + this.name.toLowerCase();
  }
}
