export default class MenuBar extends HTMLElement {
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

    let container = this.querySelector("ul");
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
