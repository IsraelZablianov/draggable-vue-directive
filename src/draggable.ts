import Vue from "Vue";

export type HandleType = Vue | HTMLElement;
export interface Position {
	x: number;
	y: number;
}

export interface DraggableValue {
	handle?: HandleType;
	onPositionChange?: (pos: Position) => void;
	resetInitialPos?: boolean;
	stopDragging?: boolean;
	boundingRect?: ClientRect;
}

export interface DraggableBindings {
	value: DraggableValue;
}

function extractHandle(handle: HandleType): HTMLElement {
	return handle && (handle as Vue).$el || handle as HTMLElement;
}

function isInBoundries(elementRect?: ClientRect, boundingRect?: ClientRect, dx: number = 0, dy: number = 0): boolean {
	if (boundingRect && elementRect) {
		const actualMaxTop = elementRect.top + elementRect.height + dy;
		const maxTop = boundingRect.bottom;

		const actualMinTop = elementRect.top + dy;
		const minTop = boundingRect.top;

		const actualMaxLeft = elementRect.left + dx;
		const maxLeft = boundingRect.right - elementRect.width;

		const actualMinLeft = elementRect.left + dx;
		const minLeft = boundingRect.left;

		if ((actualMaxTop > maxTop && actualMaxTop - dy > maxTop) ||
			(actualMinTop < minTop && actualMinTop - dy < minTop) ||
			(actualMaxLeft > maxLeft && actualMaxLeft - dx > maxLeft) ||
			(actualMinLeft < minLeft && actualMinLeft - dx < minLeft)) {
			return false;
		}
	}

	return true
}

export const Draggable = {
	bind(el: HTMLElement, binding: DraggableBindings) {
		Draggable.update(el, binding);
	},
	update(el: HTMLElement, binding: DraggableBindings) {
		if (binding.value && binding.value.stopDragging) {
			return;
		}

		const handler = (binding.value && binding.value.handle && extractHandle(binding.value.handle)) || el;
		init(binding);

		function mouseMove(event: MouseEvent) {
			event.preventDefault();
			const state = getState();
			const dx = event.clientX - state.initialMousePos.x;
			const dy = event.clientY - state.initialMousePos.y;

			const boundingRect = binding.value && binding.value.boundingRect;
			const stopDragging = binding.value && binding.value.stopDragging;
			var elementRect = el.getBoundingClientRect();

			if (!isInBoundries(elementRect, boundingRect, dx, dy) || stopDragging) {
				return;
			}

			state.lastPos = {
				x: state.startPosition.x + dx,
				y: state.startPosition.y + dy
			};
			setState(state);
			el.style.transform = `translate(${state.lastPos.x}px, ${state.lastPos.y}px)`;
			onPositionChanged();
		}

		function mouseUp() {
			document.removeEventListener("mousemove", mouseMove);
			document.removeEventListener("mouseup", mouseUp);
		}

		function mouseDown(event: MouseEvent) {
			const state = getState();
			state.startPosition = state.lastPos;
			state.initialMousePos = getInitialMousePosition(event);
			setState(state);
			onPositionChanged();
			document.addEventListener("mousemove", mouseMove);
			document.addEventListener("mouseup", mouseUp);
		}

		function getInitialMousePosition(event: MouseEvent): Position {
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
			}
		}

		function init(binding: DraggableBindings) {
			if (binding && binding.value && binding.value.resetInitialPos) {
				el.style.transform = `translate(0px, 0px)`;
				setState(getInitState());
				onPositionChanged();
			}
			el.style.position = "absolute";
		}

		function setState(state: any) {
			handler.setAttribute("draggable-state", JSON.stringify(state));
		}

		function onPositionChanged() {
			const state = getState();
			binding.value && binding.value.onPositionChange && state && binding.value.onPositionChange({ ...state.lastPos });
		}

		function getState() {
			return JSON.parse(handler.getAttribute("draggable-state") as string);
		}

		if (!handler.getAttribute("draggable")) {
			el.removeEventListener("mousedown", (el as any)["listener"]);
			handler.addEventListener("mousedown", mouseDown);
			handler.setAttribute("draggable", "true");
			(el as any)["listener"] = mouseDown;
			setState(getInitState());
			onPositionChanged();
		}
	}
};