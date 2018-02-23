"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function extractHandle(handle) {
    if (handle && handle.$el) {
        return handle.$el;
    }
    else {
        return handle;
    }
}
function isInBoundries(elementRect, boundingRect, dx, dy) {
    if (dx === void 0) { dx = 0; }
    if (dy === void 0) { dy = 0; }
    if (boundingRect && elementRect) {
        var actualMaxTop = elementRect.top + elementRect.height + dy;
        var maxTop = boundingRect.bottom;
        var actualMinTop = elementRect.top + dy;
        var minTop = boundingRect.top;
        var actualMaxLeft = elementRect.left + dx;
        var maxLeft = boundingRect.right - elementRect.width;
        var actualMinLeft = elementRect.left + dx;
        var minLeft = boundingRect.left;
        if ((actualMaxTop > maxTop && actualMaxTop - dy > maxTop) ||
            (actualMinTop < minTop && actualMinTop - dy < minTop) ||
            (actualMaxLeft > maxLeft && actualMaxLeft - dx > maxLeft) ||
            (actualMinLeft < minLeft && actualMinLeft - dx < minLeft)) {
            return false;
        }
    }
    return true;
}
exports.Draggable = {
    bind: function (el, binding) {
        exports.Draggable.update(el, binding);
    },
    update: function (el, binding) {
        if (binding.value && binding.value.stopDragging) {
            return;
        }
        var handler = (binding.value && binding.value.handle && extractHandle(binding.value.handle)) || el;
        init(binding);
        function mouseMove(event) {
            event.preventDefault();
            var state = getState();
            var dx = event.clientX - state.initialMousePos.x;
            var dy = event.clientY - state.initialMousePos.y;
            var boundingRect = binding.value && binding.value.boundingRect;
            var stopDragging = binding.value && binding.value.stopDragging;
            var elementRect = el.getBoundingClientRect();
            if (!isInBoundries(elementRect, boundingRect, dx, dy) || stopDragging) {
                return;
            }
            state.lastPos = {
                x: state.startPosition.x + dx,
                y: state.startPosition.y + dy
            };
            setState(state);
            el.style.transform = "translate(" + state.lastPos.x + "px, " + state.lastPos.y + "px)";
            onPositionChanged();
        }
        function mouseUp() {
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
        }
        function mouseDown(event) {
            var state = getState();
            state.startPosition = state.lastPos;
            state.initialMousePos = getInitialMousePosition(event);
            setState(state);
            onPositionChanged();
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
        }
        function getInitialMousePosition(event) {
            return {
                x: event.clientX,
                y: event.clientY
            };
        }
        function getInitState() {
            return {
                startPosition: { x: 0, y: 0 },
                initialMousePos: { x: 0, y: 0 },
                lastPos: { x: 0, y: 0 }
            };
        }
        function init(binding) {
            if (binding && binding.value && binding.value.resetInitialPos) {
                el.style.transform = "translate(0px, 0px)";
                setState(getInitState());
                onPositionChanged();
            }
            el.style.position = "absolute";
        }
        function setState(state) {
            handler.setAttribute("draggable-state", JSON.stringify(state));
        }
        function onPositionChanged() {
            var state = getState();
            binding.value && binding.value.onPositionChange && state && binding.value.onPositionChange(__assign({}, state.lastPos));
        }
        function getState() {
            return JSON.parse(handler.getAttribute("draggable-state"));
        }
        if (!handler.getAttribute("draggable")) {
            el.removeEventListener("mousedown", el["listener"]);
            handler.addEventListener("mousedown", mouseDown);
            handler.setAttribute("draggable", "true");
            el["listener"] = mouseDown;
            setState(getInitState());
            onPositionChanged();
        }
    }
};
//# sourceMappingURL=draggable.js.map