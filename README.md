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

You can view the live demo here: https://israelzablianov.github.io/draggable-demo


## Examples

### Without Handler

``` html
<div v-draggable>
    classic draggable
</div>
```

`.vue` file:
``` js
  import { Draggable } from 'draggable-vue-directive'
  ...
  export default {
        directives: {
            Draggable,
        },
  ...
```

### With Handler

``` html
<div v-draggable="draggableValue">
    <div :ref="handleId">
        <img src="../assets/move.svg" alt="move">
    </div>
    drag and drop using handler
</div>
```

`.vue` file:

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

## `draggable` Value

The object passed to the directive is called the directive’s <dfn>value</dfn>.<br>
For example, in `v-draggable="draggableValue"`, `draggableValue` can be an object containing the folowing fields:<br>

* [`handle`](#handle)
* [`onPositionChange`](#onpositionchange)
* [`onDragEnd`](#ondragend)
* [`onDragStart`](#ondragstart)
* [`resetInitialPos`](#resetinitialpos)
* [`initialPosition`](#initialposition)
* [`stopDragging`](#stopdragging)
* [`boundingRect`](#boundingrect)
* [`boundingElement`](#boundingelement)
* [`boundingRectMargin`](#boundingrectmargin)

#### handle
Type: `HtmlElement | Vue`<br>
Required: `false`<br>

There are two ways to use the `draggable` directive, as shown in the demo above.<br>

1. **The simple use.** Just to put the directive on any Vue component or HTML element, and…boom! The element is draggable.
2. **Using a handler.** If you choose to use a handler, the component itself will only be draggable using the handler.


#### onPositionChange
Type: `Function`<br>
Required: `false`<br>

Sometimes you need to know the element’s coordinates while it’s being dragged.<br>
Passing a callback to `draggableValue` will achieve this goal; 
while dragging the element, the callback will be executed with 3 params: 

- `positionDiff`
- `absolutePosition` (the current position; the first time the directive is added to the DOM or being initialized, the value will be `undefined`, unless the element has `left` and `top` values)
- `event` (the event object)

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

Emits only when dragging ends. Has the same functionality as [`onPositionChange`](#onpositionchange).

#### onDragStart
Type: `Function`<br>
Required: `false`<br>

Emits only when dragging starts. Has the same functionality as [`onPositionChange`](#onpositionchange).

#### resetInitialPos
Type: `Boolean`<br>
Required: `false`<br>
default: `undefined`<br>

Returns to the initial position of the element, before it is mounted.

#### initialPosition
Type: `Position`<br>
Required: `false`<br>
default: `undefined`<br>

Sets the absolute starting position of this element.<br>
Will be applied when `resetInitialPos` is `true`.

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

When using `boundingRect` or `boundingElement`, you can pass an object with 
`top`, `left`, `bottom`, and `right` properties, to define a margin between the elements and the boundaries.
