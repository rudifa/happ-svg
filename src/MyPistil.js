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
      originX: { type: Number },
      originY: { type: Number },
      radius: { type: Number },
      width: { type: Number },
      length: { type: Number },
      angle: { type: Number }
    };
  }

  constructor() {
    super();
    this.originX = 50;
    this.originY = 50;
    this.radius = 5
    this.width = 3
    this.length = 50;
    this.angle = 30;
  }

  render() {
    return svg`<svg height="150" width="150">
      <g transform="rotate(${this.angle} ${this.originX} ${this.originY})">
        <circle cx="${this.originX + this.length}" cy="${this.originY}" r="${this.radius}" stroke="black" stroke-width="${this.width}" fill-opacity=0.0 />
        <line x1="${this.originX}" y1="${this.originY}" x2="${this.originX + this.length - this.radius}" y2="${this.originY}" style="stroke:rgb(0,0,0);stroke-width:${this.width}" />
      </g>
    </svg> `;
  }
}
