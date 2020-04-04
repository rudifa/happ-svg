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
      length0: { type: Number },
      length1: { type: Number },
      length2: { type: Number },
      increment0: { type: Number },
      increment1: { type: Number },
      increment2: { type: Number },
      angle0: { type: Number },
      angle1: { type: Number },
      angle2: { type: Number },
    };
  }

  constructor() {
    super();
    this.originX = 15.0;
    this.originY = 10.0;
    this.radius = 0.5;
    this.width = 0.3;
    this.maxLength = 7.5;
    this.length0 = 5.0;
    this.length1 = 5.0;
    this.length2 = 5.0;
    this.increment0 = 0.5;
    this.increment1 = 0.5;
    this.increment2 = 0.5;
    this.angle0 = 30;
    this.angle1 = 150;
    this.angle2 = 270;
  }

  handleClick(event) {
    //alert("clicked")
    //this.length += 1;
    console.log(event.target.id)
    switch (event.target.id) {
      case "circle0":
        this.length0 += this.increment0
        if (this.length0 >= this.maxLength) {
          this.length0 = this.maxLength
          this.increment0 = -this.increment0
        }else if (this.length0 <= this.radius) {
          this.length0 = this.radius
          this.increment0 = -this.increment0
        } 
      break;
      case "circle1":
        this.length1 += this.increment1
        if (this.length1 >= this.maxLength) {
          this.length1 = this.maxLength
          this.increment1 = -this.increment1
        }else if (this.length1 <= this.radius) {
          this.length1 = this.radius
          this.increment1 = -this.increment1
        }
      break;
      case "circle2":
        this.length2 += this.increment2
        if (this.length2 >= this.maxLength) {
          this.length2 = this.maxLength
          this.increment2 = -this.increment2
        }else if (this.length2 <= this.radius) {
          this.length2 = this.radius
          this.increment2 = -this.increment2
        }
      break;
    }
  }

  render() {
    return svg`

        <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 30 20"
        onload="makeDraggable(evt)">

        <style>
          .static {
            cursor: not-allowed;
          }
          .draggable, .draggable-group, .stretchable-group {
            cursor: move;
          }
        </style>
        
        <script type="text/javascript"><![CDATA[
          function makeDraggable(evt) {
            var svg = evt.target;
            svg.addEventListener('mousedown', startDrag);
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
              } /*              else if (evt.target.parentNode.classList.contains('stretchable-group')) {
                selectedElement = evt.target.parentNode;
                initialiseDragging(evt);

                console.log(selectedElement.id, ${this.length})          
              }
              */
            }
            function drag(evt) {
              if (selectedElement) {
                evt.preventDefault();
                var coord = getMousePosition(evt);
                transform.setTranslate(coord.x - offset.x, coord.y - offset.y);

                //console.log(offset, coord)
              }
            }
            function endDrag(evt) {
              selectedElement = false;
            }
          }
        ]]> </script>
    
        <rect x="0" y="0" width="30" height="20" fill="#eee"/>
<!-------
        <rect class="static" fill="#888" x="2" y="4" width="6" height="2"/>
        <rect class="draggable" fill="#007bff" x="2" y="4" width="6" height="2" transform="rotate(90, 5, 5) translate(10, 0)"/>
     
        <g class="draggable-group">
          <ellipse fill="#ff00af" cx="5" cy="5" rx="3" ry="2" transform="translate(10, 0)"/>
          <polygon fill="#ffa500" transform="rotate(15, 15, 15)" points="16.9 15.6 17.4 18.2 15 17 12.6 18.2 13.1 15.6 11.2 13.8 13.8 13.4 15 11 16.2 13.4 18.8 13.8"/>
        </g>

      
        <g class="draggable-group">
          <path stroke="#2bad7b" stroke-width="0.5" fill="none" d="M1 5C5 1 5 9 9 5" transform="translate(20)"/>
          <text x="25" y="15" text-anchor="middle" font-size="3px" alignment-baseline="middle">Drag</text>
        </g>
------>
            
      <g class="stretchable-group" id="pistil0" transform="rotate(${this.angle0} ${this.originX} ${this.originY})" @click="${this.handleClick}">
        <circle id="circle0" cx="${this.originX + this.length0}" cy="${this.originY}" r="${this.radius}" stroke="black" stroke-width="${this.width}" fill-opacity=0.0 />
        <line id="l0" x1="${this.originX}" y1="${this.originY}" x2="${this.originX + this.length0 - this.radius}" y2="${this.originY}" style="stroke:rgb(0,0,0);stroke-width:${this.width}" />
      </g>
      
      <g class="stretchable-group" id="pistil1" transform="rotate(${this.angle1} ${this.originX} ${this.originY})" @click="${this.handleClick}">
        <circle id="circle1" cx="${this.originX + this.length1}" cy="${this.originY}" r="${this.radius}" stroke="black" stroke-width="${this.width}" fill-opacity=0.0 />
        <line id="l0" x1="${this.originX}" y1="${this.originY}" x2="${this.originX + this.length1 - this.radius}" y2="${this.originY}" style="stroke:rgb(0,0,0);stroke-width:${this.width}" />
      </g>
      
      <g class="stretchable-group" id="pistil2" transform="rotate(${this.angle2} ${this.originX} ${this.originY})" @click="${this.handleClick}">
        <circle id="circle2" cx="${this.originX + this.length2}" cy="${this.originY}" r="${this.radius}" stroke="black" stroke-width="${this.width}" fill-opacity=0.0 />
        <line id="l0" x1="${this.originX}" y1="${this.originY}" x2="${this.originX + this.length2 - this.radius}" y2="${this.originY}" style="stroke:rgb(0,0,0);stroke-width:${this.width}" />
      </g>

      <rect  fill="#888" x="1" y="1" width="1" height="1" onclick="alert('You have clicked the rect.')"/>
      <rect id="rect.3.1" fill="#888" x="3" y="1" width="1" height="1" @click="${this.handleClick}"/>

    </svg>
      `;
  }
}