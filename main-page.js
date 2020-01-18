import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.2.1/lit-element.js?module";

class MainPage extends LitElement {
  constructor() {
    super();
  }

  static get styles() {
    return css`
      :host {
        color: white;
        font-family: Open Sans;
        font-weight: lighter;
      }

      h1 {
        color: white;
        text-align: center;
      }

      h2,
      h3,
      h4,
      h5,
      h6,
      p,
      li,
      a {
        color: white;
        text-align: center;
        text-decoration: none;
        font-weight: lighter;
      }

      .content-container {
        color: white;
        text-decoration: none;
        font-weight: lighter;
        margin: 100px 30px 30px 30px;
      }

      .title {
        font-size: 50px;
        margin: 30px 10px 10px 10px;
      }

      .subtitle {
        font-size: 15px;
        margin-top: 0px;
      }

      .menu-container {
        display: flex;
        flex-direction: row;
        list-style: none;
        justify-content: center;
        padding: 0px 0px 0px 0px;
        margin: 30px 20% 0% 20%;
      }

      .menu-item {
        flex: auto;
        list-style: none;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }
    `;
  }

  render() {
    return html`
      <header>
        <h1 class="title">ILGWON HA</h1>
        <h3 class="subtitle">GRAPHICS PROGRAMMER</h4>
      </header>
      <ul class="menu-container">
        <li class="menu-item" @click=${() => {
          console.log("Portfolio");
        }}><a href="#">PORTFOLIO</a></li>
        <li class="menu-item" @click=${() => {
          console.log("About Me");
        }}><a href="#">ABOUT ME</a></li>
        <li class="menu-item" @click=${() => {
          console.log("Contact");
        }}><a href="#">CONTACT</a></li>
      </ul>
      <div class="content-container">
      </div>
    `;
  }
}

window.customElements.define("main-page", MainPage);
