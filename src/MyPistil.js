import { html, svg, css, LitElement } from "lit-element";

export class MyPistil extends LitElement {
  static get styles() {
    return css`
      :host {
        --happ-ui-text-color: #000;

        display: inline-block;
        padding: 25px;
        color: var(--happ-ui-text-color);
      }
    `;
  }

  static get properties() {
    return {
      length: { type: Number },
      angle: { type: Number }
    };
  }

  constructor() {
    super();
    this.length = 50;
    this.angle = 0;
  }

  __increment() {
    this.counter += 1;
  }

  render() {
    return svg`<svg height="150" width="150">
      <circle cx="100" cy="50" r="5" stroke="black" stroke-width="4" fill-opacity=0.0 />
      <line x1="50" y1="50" x2="97" y2="50" style="stroke:rgb(0,0,0);stroke-width:3" />
    </svg> `;
  }
}
