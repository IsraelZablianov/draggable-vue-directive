export declare type HandleType = any | HTMLElement;
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
export interface DraggableBindings {
    value: DraggableValue;
}
export declare const Draggable: {
    update(el: HTMLElement, binding: DraggableBindings): void;
};
