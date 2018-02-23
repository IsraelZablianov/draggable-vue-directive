<h1 align="center">draggable-vue-directive</h1>

[![GitHub open issues](https://img.shields.io/github/issues/IsraelZablianov/draggable-vue-directive.svg)](https://github.com/IsraelZablianov/draggable-vue-directive/issues?q=is%3Aopen+is%3Aissue)
[![npm download](https://img.shields.io/npm/dt/draggable-vue-directive.svg)](https://www.npmjs.com/package/draggable-vue-directive)
[![npm download per month](https://img.shields.io/npm/dm/draggable-vue-directive.svg)](https://www.npmjs.com/package/draggable-vue-directive)
[![npm version](https://img.shields.io/npm/v/draggable-vue-directive.svg)](https://www.npmjs.com/package/draggable-vue-directive)
[![Package Quality](http://npm.packagequality.com/shield/draggable-vue-directive.svg)](http://packagequality.com/#?package=draggable-vue-directive)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![MIT License](https://img.shields.io/github/license/IsraelZablianov/draggable-vue-directive.svg)](https://github.com/IsraelZablianov/draggable-vue-directive/blob/master/LICENSE)


Vue directive (Vue.js 2.0) for handling element drag & drop.


## Getting Started

```console
npm install draggable-vue-directive --save
```

## Demo

![demo gif](https://media.giphy.com/media/3o6nUO1lWMkeyH5nfW/giphy.gif)


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
                draggableValue: { };
            }
        },
        mounted() {
            this.draggableValue.handle = this.$refs[this.handleId];
        }
  ...
```

### draggable Value 
The Object passed to the directive is called the directive value.<br>
For example in `v-draggable="draggableValue"` draggableValue can be an object containing the folowing fields <br>

* [handle](#handle)
* [onPositionChange](#onpositionchange)
* [resetInitialPos](#resetinitialpos)
* [stopDragging](#stopdragging)
* [boundingRect](#boundingrect)


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
Passing a callback to `draggableValue` will achieve this goal and every time the element is being dragged the callback
will be executed with the current position as param.<br>

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
                draggableValue: { };
            }
        },
        mounted() {
            this.draggableValue.handle = this.$refs[this.handleId];
            this.draggableValue.onPositionChange = this.onPosChanged;
        },
        methods: {
            onPosChanged: function(pos) {
                console.log("left corner", pos.x);
                console.log("top corner", pos.y);
            }
        }
  ...
```


#### resetInitialPos
Type: `Boolean`<br>
Required: `false`<br>
default: `undefined`<br>

Returns to the initial position the element was before mounted.


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