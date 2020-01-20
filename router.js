export default class Router {
  constructor(routeActions) {
    this.routes = {};
    routeActions.forEach(routeAction => {
      routeAction.onRegisterRouteAction(this);
    });

    window.addEventListener("hashchange", this.onHashChange.bind(this));
    window.addEventListener("load", this.onLoad.bind(this));
  }

  register(url, action) {
    this.routes[url] = action;
  }

  async route() {
    let url = location.hash.slice(1).toLowerCase() || "/";
    console.log("Url: " + url);

    let action = this.routes[url] ? this.routes[url] : null;
    if (action) {
      await action();
    }
  }

  async onLoad() {
    console.log("onLoad");
    await this.route();
  }

  async onHashChange() {
    console.log("onHashChange");
    await this.route();
  }
}
