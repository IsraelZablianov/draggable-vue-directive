import Vue from "vue";
import { VNodeDirective } from "vue";

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
}

export interface DraggableBindings extends VNodeDirective {
	value: DraggableValue;
}

function extractHandle(handle: HandleType): HTMLElement {
	if (handle && (<Vue>handle).$el) {
		return (<Vue>handle).$el;
	}
	else {
		return <HTMLElement>handle;
	}
}

export const Draggable = {
	update(el: HTMLElement, binding: DraggableBindings) {
		if (binding.value && binding.value.stopDragging) {
			return;
		}

		const handler = (binding.value && binding.value.handle && extractHandle(binding.value.handle)) || el;
		const safeDistance = 5;
		init(binding);

		function mouseMove(event: MouseEvent) {
			event.preventDefault();
			const state = getState();
			const dx = event.clientX - state.initialMousePos.x;
			const dy = event.clientY - state.initialMousePos.y;
			if (el.scrollHeight + event.clientY > window.innerHeight - safeDistance ||
				event.clientY - safeDistance < 0 ||
				el.scrollWidth + event.clientX > window.innerWidth - safeDistance ||
				event.clientX - el.scrollWidth < safeDistance) {
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

		function setState(state) {
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
			el.removeEventListener("mousedown", mouseDown);
			handler.addEventListener("mousedown", mouseDown);
			handler.setAttribute("draggable", "true");
			setState(getInitState());
			onPositionChanged();
		}
	}
};

Vue.directive("draggable", Draggable);