import { html, svg, css, LitElement } from "lit-element";

// from http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
// and https://github.com/petercollingridge/code-for-blog/blob/36ba73c7b763022731a72813249cdc56e7dba8c0/svg-interaction/draggable/draggable_groups.svg?short_path=be4270d

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
    this.offset = 123;
  }

  getMousePosition(event) {
    var CTM = event.target.getScreenCTM();
    if (event.touches) { event = event.touches[0]; }
    console.log("getMousePosition", event.clientX, event.clientY)
    return {
      x: (event.clientX - CTM.e) / CTM.a,
      y: (event.clientY - CTM.f) / CTM.d
    };
  }

  getMousePosition_X(event) {
    // https://stackoverflow.com/questions/10298658/mouse-position-inside-autoscaled-svg
    // Find your root SVG element
    var svg = document.querySelector('svg');
    // Create an SVGPoint for future math
    var pt = svg.createSVGPoint();
    // Get point in global SVG space
    //function cursorPoint(evt){
      pt.x = evt.clientX; pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    //}
  }


  // svg.addEventListener('mousedown', startDrag); // OK
  // svg.addEventListener('mousemove', drag);
  // svg.addEventListener('mouseup', endDrag);
  // svg.addEventListener('mouseleave', endDrag);


  _mousedown(event) {
    //alert(`_mousedown`)
    console.log('mousedown startDrag event', event)
    let target = event.target
    console.log('mousedown startDrag target', target)
    var CTM = target.getScreenCTM();
    console.log('mousedown startDrag CTM', CTM)

    let mousePos = this.getMousePosition(event)
    console.log('mousedown startDrag mousePos', mousePos)

  }

  _mousemove(event) {
    //alert(`_mousedown`)
    //console.log('mousemove drag', event)
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

  _handleClick(event) {
    // alert(`clicked ${event.target.id}`)
    //console.log(event.target.id)

    let pistilx = this.pistils.filter(p => p.id == event.target.id)
   // console.log(event.target.id, pistil)

    this.pistils = this.pistils.map((pistil) => {
      if (pistil.id == event.target.id) {
        pistil.length = pistil.length + pistil.increment;
        if (pistil.length > this.maxLength) {
          pistil.length = this.maxLength 
          pistil.increment = - pistil.increment
        } else if (pistil.length < this.radius) {
          pistil.length = this.radius 
          pistil.increment = - pistil.increment
        }
        console.log(event.target.id, pistil)
      }
      return pistil;
    })


    return
    switch (event.target.id) {
      case "p0":
        this.length0 += this.increment0
        if (this.length0 >= this.maxLength) {
          this.length0 = this.maxLength
          this.increment0 = -this.increment0
        } else if (this.length0 <= this.radius) {
          this.length0 = this.radius
          this.increment0 = -this.increment0
        } 
      break;
      case "circle1":
        this.length1 += this.increment1
        if (this.length1 >= this.maxLength) {
          this.length1 = this.maxLength
          this.increment1 = -this.increment1
        } else if (this.length1 <= this.radius) {
          this.length1 = this.radius
          this.increment1 = -this.increment1
        }
      break;
      case "circle2":
        this.length2 += this.increment2
        if (this.length2 >= this.maxLength) {
          this.length2 = this.maxLength
          this.increment2 = -this.increment2
        } else if (this.length2 <= this.radius) {
          this.length2 = this.radius
          this.increment2 = -this.increment2
        }
      break;
    }
  }

  pistilsSvg() { return svg` 
    <svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 30 20"
    @onload="${e => this._onload(e)}"
    >  
    ${this.pistils.map(
      pistil => svg`
              <g class="stretchable-group" id="${pistil.id}" transform="rotate(${pistil.angle} ${this.originX} ${this.originY})">
          <line id="${pistil.id}" x1="${this.originX}" y1="${this.originY}" x2="${this.originX + pistil.length - this.radius}" y2="${this.originY}" style="stroke:rgb(0,0,0);stroke-width:${this.width}" @click="${this._handleClick} "/>
          <circle class="circle" id="${pistil.id}" cx="${this.originX + pistil.length}" cy="${this.originY}" r="${this.radius}" stroke="black" stroke-width="${this.width}" fill-opacity=0.0  
            @mousedown="${e => this._mousedown(e)}"
            @mousemove="${this._mousemove}"
            @mouseup="${this._mouseup}"
            @mouseleave="${this._mouseleave}"
            @click="${this._handleClick}"

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

          function deltaLength(angledeg, offset, coord) {
            let dx = coord.x - offset.x;
            let dy = coord.y - offset.y;
            let d = Math.sqrt(dx*dx + dy*dy)
            let a = toRadians(angledeg)
            let dl = dx * Math.cos(a) + dy * Math.sin(a)
            return dl
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
