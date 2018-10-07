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
var ChangePositionType;
(function (ChangePositionType) {
    ChangePositionType[ChangePositionType["Start"] = 1] = "Start";
    ChangePositionType[ChangePositionType["End"] = 2] = "End";
    ChangePositionType[ChangePositionType["Move"] = 3] = "Move";
})(ChangePositionType || (ChangePositionType = {}));
function extractHandle(handle) {
    return handle && handle.$el || handle;
}
function getPosWithBoundaries(elementRect, boundingRect, left, top, boundingRectMargin) {
    if (boundingRectMargin === void 0) { boundingRectMargin = {}; }
    var adjustedPos = { left: left, top: top };
    var height = elementRect.height, width = elementRect.width;
    var topRect = top, bottomRect = top + height, leftRect = left, rightRect = left + width;
    var marginTop = boundingRectMargin.top || 0, marginBottom = boundingRectMargin.bottom || 0, marginLeft = boundingRectMargin.left || 0, marginRight = boundingRectMargin.right || 0;
    var topBoundary = boundingRect.top + marginTop, bottomBoundary = boundingRect.bottom - marginBottom, leftBoundary = boundingRect.left + marginLeft, rightBoundary = boundingRect.right - marginRight;
    if (topRect < topBoundary) {
        adjustedPos.top = topBoundary;
    }
    else if (bottomRect > bottomBoundary) {
        adjustedPos.top = bottomBoundary - height;
    }
    if (leftRect < leftBoundary) {
        adjustedPos.left = leftBoundary;
    }
    else if (rightRect > rightBoundary) {
        adjustedPos.left = rightBoundary - width;
    }
    return adjustedPos;
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
        if (binding && binding.value && binding.value.resetInitialPos) {
            initializeState();
            handlePositionChanged();
        }
        if (!handler.getAttribute("draggable")) {
            el.removeEventListener("mousedown", el["listener"]);
            handler.addEventListener("mousedown", mouseDown);
            handler.setAttribute("draggable", "true");
            el["listener"] = mouseDown;
            initializeState();
            handlePositionChanged();
        }
        function mouseMove(event) {
            event.preventDefault();
            var stopDragging = binding.value && binding.value.stopDragging;
            if (stopDragging) {
                return;
            }
            var state = getState();
            if (!state.startDragPosition || !state.initialMousePos) {
                initializeState(event);
                state = getState();
            }
            var dx = event.clientX - state.initialMousePos.left;
            var dy = event.clientY - state.initialMousePos.top;
            var currentDragPosition = {
                left: state.startDragPosition.left + dx,
                top: state.startDragPosition.top + dy
            };
            var boundingRect = getBoundingRect();
            var elementRect = el.getBoundingClientRect();
            if (boundingRect && elementRect) {
                currentDragPosition = getPosWithBoundaries(elementRect, boundingRect, currentDragPosition.left, currentDragPosition.top, binding.value.boundingRectMargin);
            }
            setState({ currentDragPosition: currentDragPosition });
            updateElementStyle();
            handlePositionChanged(event);
        }
        function getBoundingRect() {
            if (!binding.value) {
                return;
            }
            return binding.value.boundingRect
                || binding.value.boundingElement
                    && binding.value.boundingElement.getBoundingClientRect();
        }
        function updateElementStyle() {
            var state = getState();
            if (!state.currentDragPosition) {
                return;
            }
            el.style.position = "fixed";
            el.style.left = state.currentDragPosition.left + "px";
            el.style.top = state.currentDragPosition.top + "px";
        }
        function mouseUp(event) {
            event.preventDefault();
            var currentRectPosition = getRectPosition();
            setState({
                initialMousePos: undefined,
                startDragPosition: currentRectPosition,
                currentDragPosition: currentRectPosition
            });
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
            handlePositionChanged(event, ChangePositionType.End);
        }
        function mouseDown(event) {
            event.preventDefault();
            setState({ initialMousePos: getInitialMousePosition(event) });
            handlePositionChanged(event, ChangePositionType.Start);
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
        }
        function getInitialMousePosition(event) {
            return event && {
                left: event.clientX,
                top: event.clientY
            };
        }
        function getRectPosition() {
            var clientRect = el.getBoundingClientRect();
            if (!clientRect.height || !clientRect.width) {
                return;
            }
            return { left: clientRect.left, top: clientRect.top };
        }
        function initializeState(event) {
            var state = getState();
            var initialRectPositionFromBinding = binding && binding.value && binding.value.initialPosition;
            var initialRectPositionFromState = state.initialPosition;
            var startingDragPosition = getRectPosition();
            var initialPosition = initialRectPositionFromBinding || initialRectPositionFromState || startingDragPosition;
            setState({
                initialPosition: initialPosition,
                startDragPosition: initialPosition,
                currentDragPosition: initialPosition,
                initialMousePos: getInitialMousePosition(event)
            });
            updateElementStyle();
        }
        function setState(partialState) {
            var prevState = getState();
            var state = __assign({}, prevState, partialState);
            handler.setAttribute("draggable-state", JSON.stringify(state));
        }
        function handlePositionChanged(event, changePositionType) {
            var state = getState();
            var posDiff = { x: 0, y: 0 };
            if (state.currentDragPosition && state.startDragPosition) {
                posDiff.x = state.currentDragPosition.left - state.startDragPosition.left;
                posDiff.y = state.currentDragPosition.top - state.startDragPosition.top;
            }
            var currentPosition = state.currentDragPosition && __assign({}, state.currentDragPosition);
            if (changePositionType === ChangePositionType.End) {
                binding.value && binding.value.onDragEnd && state && binding.value.onDragEnd(posDiff, currentPosition, event);
            }
            else if (changePositionType === ChangePositionType.Start) {
                binding.value && binding.value.onDragStart && state && binding.value.onDragStart(posDiff, currentPosition, event);
            }
            else {
                binding.value && binding.value.onPositionChange && state && binding.value.onPositionChange(posDiff, currentPosition, event);
            }
        }
        function getState() {
            return JSON.parse(handler.getAttribute("draggable-state")) || {};
        }
    }
};
//# sourceMappingURL=draggable.js.map