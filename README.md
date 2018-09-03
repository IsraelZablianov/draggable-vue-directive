<h1 align="center">draggable-vue-directive</h1>

[![GitHub open issues](https://img.shields.io/github/issues/IsraelZablianov/draggable-vue-directive.svg)](https://github.com/IsraelZablianov/draggable-vue-directive/issues?q=is%3Aopen+is%3Aissue)
[![npm download](https://img.shields.io/npm/dt/draggable-vue-directive.svg)](https://www.npmjs.com/package/draggable-vue-directive)
[![npm download per month](https://img.shields.io/npm/dm/draggable-vue-directive.svg)](https://www.npmjs.com/package/draggable-vue-directive)
[![npm version](https://img.shields.io/npm/v/draggable-vue-directive.svg)](https://www.npmjs.com/package/draggable-vue-directive)
[![Package Quality](http://npm.packagequality.com/shield/draggable-vue-directive.svg)](http://packagequality.com/#?package=draggable-vue-directive)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![MIT License](https://img.shields.io/github/license/IsraelZablianov/draggable-vue-directive.svg)](https://github.com/IsraelZablianov/draggable-vue-directive/blob/master/LICENSE)


Vue directive (Vue.js 2.x) for handling element drag & drop.


## Installation

```console
npm install draggable-vue-directive --save
```

## Demo

![demo gif](https://media.giphy.com/media/3o6nUO1lWMkeyH5nfW/giphy.gif)

The live demo can be found in https://israelzablianov.github.io/draggable-demo


### Typical use:
``` html
<div v-draggable>
    classic draggable
</div>
```
.vue file:
``` js
  import { Draggable } from 'draggable-vue-directive'
  ...
  export default {
        directives: {
            Draggable,
        },
  ...
```

### with handler:
``` html
<div v-draggable="draggableValue">
    <div :ref="handleId">
        <img src="../assets/move.svg" alt="move">
    </div>
    drag and drop using handler
</div>
```
.vue file:
``` js
  import { Draggable } from 'draggable-vue-directive'
  ...
  export default {
        directives: {
            Draggable,
        },
        data() {
            return {
                handleId: "handle-id",
                draggableValue: {
                    handle: undefined
                };
            }
        },
        mounted() {
            this.draggableValue.handle = this.$refs[this.handleId];
        }
  ...
```

### draggable Value
The object passed to the directive is called the directive value.<br>
For example in `v-draggable="draggableValue"` draggableValue can be an object containing the folowing fields: <br>

* [handle](#handle)
* [onPositionChange](#onpositionchange)
* [onDragEnd](#ondragend)
* [onDragStart](#ondragstart)
* [resetInitialPos](#resetinitialpos)
* [initialPosition](#initialposition)
* [stopDragging](#stopdragging)
* [boundingRect](#boundingrect)
* [boundingElement](#boundingelement)
* [boundingRectMargin](#boundingrectmargin)
#### handle
Type: `HtmlElement | Vue`<br>
Required: `false`<br>

There are two ways to use the draggable-vue-directive as showen in the demo above.<br>
The simple use is just to put the directive on any Vue component or Html element and boom! the element is draggable.<br>
The second option is to use handler. if you choose to use handler, the component itself will be draggable only using the handler.


#### onPositionChange
Type: `Function`<br>
Required: `false`<br>

In some cases it is useful to know the coordinates of the element when it's been dragged.<br>
Passing a callback to `draggableValue` will achieve this goal and every time the element is being dragged the callback will be executed with 3 params: positionDiff, absolutePosition (the current position, the first time the directive added to the DOM or being initialized, the value will be undefined unless the element has left and top values), event.<br>

``` js
  import { Draggable } from 'draggable-vue-directive'
  ...
  export default {
        directives: {
            Draggable,
        },
        data() {
            return {
                draggableValue: {
                    onPositionChange: this.onPosChanged
                };
            }
        },
        methods: {
            onPosChanged: function(positionDiff, absolutePosition, event) {
                console.log("left corner", absolutePosition.left);
                console.log("top corner", absolutePosition.top);
            }
        }
  ...
```
#### onDragEnd
Type: `Function`<br>
Required: `false`<br>

Emits only when draging ended, has the same functionality as [onPositionChange](#onpositionchange).

#### onDragStart
Type: `Function`<br>
Required: `false`<br>

Emits only when draging started, has the same functionality as [onPositionChange](#onpositionchange).

#### resetInitialPos
Type: `Boolean`<br>
Required: `false`<br>
default: `undefined`<br>

Returns to the initial position the element was before mounted.

#### initialPosition
Type: `Position`<br>
Required: `false`<br>
default: `undefined`<br>

Sets the absolute starting position of this element.<br>
Will be applied when resetInitialPos is true.

#### stopDragging
Type: `Boolean`<br>
Required: `false`<br>
default: `undefined`<br>

Immediately stop dragging.


#### boundingRect
Type: `ClientRect`<br>
Required: `false`<br>
default: `undefined`<br>

Constrains dragging to within the bounds of the rectangle.


#### boundingElement
Type: `HtmlElement`<br>
Required: `false`<br>
default: `undefined`<br>

Constrains dragging to within the bounds of the element.


#### boundingRectMargin
Type: `MarginOptions`<br>
Required: `false`<br>
default: `undefined`<br>

When using boundingRect or boundingElement, you can pass an object with top, left, bottom, right
properties, to define a margin between the elements and the boundries.