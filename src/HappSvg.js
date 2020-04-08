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

function projection(pt, angleDegrees) {
  let a = toRadians(angledeg)
  return dx * Math.cos(a) + dy * Math.sin(a)
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
    this.radius = 1.0;
    this.width = 0.3;
    this.maxLength = 7.0;

    this.pistils = [
      { id: "p0", angle: 30, length: 5.0, increment: 0.5 },
      { id: "p1", angle: 150, length: 5.0, increment: 0.5 },
      { id: "p2", angle: 270, length: 5.0, increment: 0.5 },
    ];

    this.selectedElement = "x";
    this.offset = {x: 0, y: 0};
  }

  // initialiseDragging(evt) {
  //     let offset = getMousePosition(evt);
  //     // Get initial translation
  //     transform = transforms.getItem(0);
  //     offset.x -= transform.matrix.e;
  //     offset.y -= transform.matrix.f;
  // }

  getMousePosition(evt) {
    // console.log('_handleClick target:', event.target.tagName, event.target);
    // console.log('_handleClick currentTarget:', event.currentTarget.tagName, event.currentTarget);
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
    this.pistils = this.pistils.map((pistil) => {
      if (pistil.id == evt.target.id) {
        pistil.length = pistil.length + pistil.increment;
        if (pistil.length > this.maxLength) {
          pistil.length = this.maxLength 
          pistil.increment = - pistil.increment
        } else if (pistil.length < this.radius) {
          pistil.length = this.radius 
          pistil.increment = - pistil.increment
        }
        console.log('_handleClick: ', evt.target.id, pistil)
      }
      return pistil;
    })
  }


  // svg.addEventListener('mousedown', startDrag); // OK
  // svg.addEventListener('mousemove', drag);
  // svg.addEventListener('mouseup', endDrag);
  // svg.addEventListener('mouseleave', endDrag);


  _mousedown(evt) {
    if (this.pistils.find(p => evt.target.id == p.id)) {
      console.log('mousedown startDrag event', evt.target.id) 
      //console.log('mousedown startDrag event', evt.target.id)
      // let target = evt.target
      // console.log('mousedown startDrag target', target)
      // var CTM = target.getScreenCTM();
      // console.log('mousedown startDrag CTM', CTM)

      let mousePos = this.getMousePosition(evt)
      console.log('mousedown startDrag mousePos', mousePos)
      this.offset = mousePos
    }
  }

  _mousemove(evt) {
    let pistil = this.pistils.find(p => evt.target.id == p.id)
    if (pistil) {
      console.log('mousemove drag', evt)
      let mousePos = this.getMousePosition(evt)
      let displ = displacement(this.offset, mousePos)
      let proj = projection(displ, pistil.angle)

      this.pistils = this.pistils.map((anyPistil) => {
        if (anyPistil.id == pistil.id) {
          anyPistil.length = anyPistil.length + proj;
          if (anyPistil.length > this.maxLength) {
            anyPistil.length = this.maxLength 
          } else if (anyPistil.length < this.radius) {
            anyPistil.length = this.radius 
          }
          //console.log('_handleClick: ', evt.target.id, anyPistil)
        }
        return anyPistil;
      })
    }
  }

  _mouseup(event) {
    //alert(`_mouseup`)
    //console.log('mouseup endDrag', event)
  }

  _mouseleave(event) {
    //alert(`_mouseleave`)
    //console.log('mouseleave endDrag', event)
    //console.log('mouseleave endDrag', typeof(this._try))
   //console.log('mouseleave endDrag', this.offset)
    //this._try()
  }

  _onload(event) {
    console.log('onload ...', event)
    this._try = function() { console.log("_try")}
  }

  pistilsSvg() { return svg` 
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 20"
      @onload="${e => this._onload(e)}"
      style="background:lavender;"
      @click="${this._handleClick}"
      @mousedown="${e => this._mousedown(e)}"
      @mousemove="${this._mousemove}"
      @mouseup="${this._mouseup}"
      @mouseleave="${this._mouseleave}"

    >  
    ${this.pistils.map(
      pistil => svg`
              <g class="stretchable-group" id="${pistil.id}" transform="rotate(${pistil.angle} ${this.originX} ${this.originY})">
          <line id="${pistil.id}" x1="${this.originX}" y1="${this.originY}" x2="${this.originX + pistil.length - this.radius}" y2="${this.originY}" style="stroke:rgb(0,0,0);stroke-width:${this.width}" />
          <circle class="circle" id="${pistil.id}" cx="${this.originX + pistil.length}" cy="${this.originY}" r="${this.radius}" stroke="black" stroke-width="${this.width}" fill-opacity=0.0         
          />
        </g>
      `)}


      <rect  fill="#888" x="1" y="1" width="1" height="1" onclick="alert('You have clicked the rect.')" />
      <rect id="rect.3.1" fill="#888" x="3" y="1" width="1" height="1" @click="${this._handleClick}"/>
      <rect  fill="#888" x="5" y="1" width="3" height="3" 

      </svg>`
    ; 
  }


  render() {
    return svg`

        ${this.pistilsSvg()}
    `;
     
  }

  render_0() {
    return svg`

        <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 30 20"
        onload="makeDraggable(evt)"
        @onload="$this._onload"
        >

        <style>
          .static {
            cursor: not-allowed;
          }
          .draggable, .draggable-group, .stretchable-group {
            cursor: move;
          }
        </style>
        
        <script type="text/javascript">

          function distanceToOrigin(coord) {
            dx = ${this.originX} - coord.x
            dy = ${this.originY} - coord.y
            dist = Math.sqrt(dx*dx + dy*dy)
            return dist
          }

          function toRadians(degrees) {
            return degrees * Math.PI / 180
          }
  function makeDraggable(evt) {
            console.log("makeDraggable")
            var svg = evt.target;
            // @mousedown=${e => this._mousedown(e, todo)}  // syntax error
            // @mousedown="${e => this._mousedown(e, todo)}"  // syntax error

            // svg.addEventListener('mousedown', this.handleDown);
            // svg.addEventListener('mousedown', e => console.log("mouse down")) // this works
            // svg.addEventListener('mousedown', e => this.handleDown)  // has no effect
            // svg.addEventListener('mousedown', ${e => this._mousedown})  // has no effect

            svg.addEventListener('mousedown', startDrag); // OK
            svg.addEventListener('mousemove', drag);
            svg.addEventListener('mouseup', endDrag);
            svg.addEventListener('mouseleave', endDrag);
            svg.addEventListener('touchstart', startDrag);
            svg.addEventListener('touchmove', drag);
            svg.addEventListener('touchend', endDrag);
            svg.addEventListener('touchleave', endDrag);
            svg.addEventListener('touchcancel', endDrag);
            function getMousePosition(evt) {
              var CTM = svg.getScreenCTM();
              if (evt.touches) { evt = evt.touches[0]; }
              return {
                x: (evt.clientX - CTM.e) / CTM.a,
                y: (evt.clientY - CTM.f) / CTM.d
              };
            }

            var selectedElement, offset, transform;
            function initialiseDragging(evt) {
                offset = getMousePosition(evt);
                // Make sure the first transform on the element is a translate transform
                var transforms = selectedElement.transform.baseVal;
                if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                  // Create an transform that translates by (0, 0)
                  var translate = svg.createSVGTransform();
                  translate.setTranslate(0, 0);
                  selectedElement.transform.baseVal.insertItemBefore(translate, 0);
                }
                // Get initial translation
                transform = transforms.getItem(0);
                offset.x -= transform.matrix.e;
                offset.y -= transform.matrix.f;
            }
            function startDrag(evt) {
              if (evt.target.classList.contains('draggable')) {
                selectedElement = evt.target;
                initialiseDragging(evt);
              } else if (evt.target.parentNode.classList.contains('draggable-group')) {
                selectedElement = evt.target.parentNode;
                initialiseDragging(evt);
              } else if (evt.target.classList.contains('DISABLE_circle')) {
                selectedElement = evt.target;
                initialiseDragging(evt);
                pos = getMousePosition(evt);
                let dist = distanceToOrigin(pos);

                console.log("startDrag", selectedElement.id, pos.x, pos.y, dist); 

                //console.log(selectedElement.id, evt.target.classList, pos.x, pos.y, dist);     
                /*   */   
              }           
            }

            function drag(evt) {
              if (selectedElement) {
                evt.preventDefault();
                var coord = getMousePosition(evt);
                //console.log(evt.target.classList)

                if (evt.target.classList.contains('circle')) {
                  let dist = distanceToOrigin(pos);

                  let dx = coord.x - offset.x;
                  let dy = coord.y - offset.y;
                  let d = deltaLength(${this.angle0}, offset, coord)
                  let id = selectedElement.id
                  //${this.angle0} = ${this.angle0} + 0.1 // readonly, just the value gets here
                  console.log("drag", d, selectedElement.id, ".${this.angle0}.")

                  
                } else {
                  //transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
                  //console.log(evt.target.classList, offset, coord)
                }
              }
            }
            
            function endDrag(evt) {
              selectedElement = false;
            }
          }
         </script>
    
        <rect x="0" y="0" width="30" height="20" fill="#eee"/>

      ${this.pistilsSvg()}

      <rect  fill="#888" x="1" y="1" width="1" height="1" onclick="alert('You have clicked the rect.')" />
      <rect id="rect.3.1" fill="#888" x="3" y="1" width="1" height="1" @click="${this._handleClick}"/>
      <rect  fill="#888" x="5" y="1" width="3" height="3" 
     
       />
       <!--
       @mousedown="${this._mousedown}"
       @mousemove="${this._mousemove}"
       @mouseup="${this._mouseup}"
       @mouseleave="${this._mouseleave}"
       -->
    
    </svg>
      `;
  }
}
