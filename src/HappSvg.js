import { html, svg, css, LitElement } from "lit-element";

// from http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
// and https://github.com/petercollingridge/code-for-blog/blob/36ba73c7b763022731a72813249cdc56e7dba8c0/svg-interaction/draggable/draggable_groups.svg?short_path=be4270d

function toRadians(degrees) {
  return degrees * Math.PI / 180
}

function distance(pt1, pt2) {
  let dx = pt1.x - pt2.x;
  let dy = pt1.y - pt2.y;
  return Math.sqrt(dx*dx + dy*dy)
}          

function displacement(pt1, pt2) {
  return {x: pt2.x - pt1.x, y: pt2.y - pt1.y}
}

function projection(pt, angledeg) {
  let a = toRadians(angledeg)
  return pt.x * Math.cos(a) + pt.y * Math.sin(a)
}          

export class HappSvg extends LitElement {
  static get properties() {
    return {
      originX: { type: Number },
      originY: { type: Number },
      radius: { type: Number },
      width: { type: Number },
      maxLength: { type: Number },
      pistils: { type: Array }
    };
  }

  constructor() {
    super();
    this.originX = 15.0;
    this.originY = 10.0;
    this.radius = 0.5;
    this.width = 0.3;
    this.maxLength = 7.0;
    this.minLength = 1.0;

    this.pistils = [
      { id: "p0", angle: 30, length: 5.0, increment: 0.5 },
      { id: "p1", angle: 150, length: 5.0, increment: 0.5 },
      { id: "p2", angle: 270, length: 5.0, increment: 0.5 },
    ];

    this.offset = {x: 0, y: 0};
    this.isDragging = false
  }

  _getMousePosition(evt) {
      let svg = evt.currentTarget
    let CTM = svg.getScreenCTM();
    // console.log('_handleClick CTM:', CTM);
    let pt = svg.createSVGPoint();
    // console.log('_handleClick pt:', pt);
    pt.x = evt.clientX; pt.y = evt.clientY;
    // console.log('_handleClick pt:', pt);
    pt = pt.matrixTransform(CTM.inverse());
    // console.log('_handleClick pt:', pt);
    return pt
  }

  _handleClick(evt) {
    return
    this.pistils = this.pistils.map((pistil) => {
      if (pistil.id == evt.target.id) {
        pistil.length = pistil.length + pistil.increment;
        if (pistil.length > this.maxLength) {
          pistil.length = this.maxLength 
          pistil.increment = - pistil.increment
        } else if (pistil.length < this.minLength) {
          pistil.length = this.minLength 
          pistil.increment = - pistil.increment
        }
        console.log('_handleClick: ', evt.target.id, pistil)
      }
      return pistil;
    })
  }

  _mousedown(evt) {
    if (this.pistils.find(p => evt.target.id == p.id)) {
      // console.log('_mousedown startDrag event', evt.target.id) 
      let mousePos = this._getMousePosition(evt)
      // console.log('_mousedown startDrag mousePos', mousePos)
      this.offset = mousePos
      this.isDragging = true
    }
  }

  _mousemove(evt) {
    if (! this.isDragging) {
      return
    }
    let pistil = this.pistils.find(p => evt.target.id == p.id)
    // 
    if (pistil) {
      // console.log('_mousemove drag', evt)
      let mousePos = this._getMousePosition(evt)
      let displ = displacement(this.offset, mousePos)
      let proj = projection(displ, pistil.angle)
      this.offset = mousePos

      this.pistils = this.pistils.map((anyPistil) => {
        if (anyPistil.id == pistil.id) {
          anyPistil.length = anyPistil.length + proj;
          if (anyPistil.length > this.maxLength) {
            anyPistil.length = this.maxLength 
          } else if (anyPistil.length < this.minLength) {
            anyPistil.length = this.minLength 
          }
          // console.log('_mousemove: ', evt.target.id, anyPistil)
        }
        return anyPistil;
      })
    }
  }

  _mouseup(event) {
    // console.log('_mouseup endDrag', event)
    this.isDragging = false
  }

  _mouseleave(event) {
    // console.log('_mouseleave endDrag', event)
    this.isDragging = false
  }

  render() { return svg` 
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 20"
      style="background:lavender;"
      @click="${this._handleClick}"
      @mousedown="${e => this._mousedown(e)}"
      @mousemove="${this._mousemove}"
      @mouseup="${this._mouseup}"
    >  
    ${this.pistils.map(
      pistil => svg`
              <g class="stretchable-group" id="${pistil.id}" transform="rotate(${pistil.angle} ${this.originX} ${this.originY})">
          <line id="${pistil.id}" x1="${this.originX}" y1="${this.originY}" x2="${this.originX + pistil.length - this.radius}" y2="${this.originY}" style="stroke:rgb(0,0,0);stroke-width:${this.width}" />
          <circle class="circle" id="${pistil.id}" cx="${this.originX + pistil.length}" cy="${this.originY}" r="${this.radius}" stroke="black" stroke-width="${this.width}" fill-opacity=0.0         
          @mouseleave="${this._mouseleave}"
          />
        </g>
      `)}
      </svg>`
    ; 
  }

}
