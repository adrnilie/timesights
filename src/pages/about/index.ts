import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("about-page")
export class AboutPage extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html` <h1 class="text-3xl font-bold">About Page</h1> `;
  }
}
