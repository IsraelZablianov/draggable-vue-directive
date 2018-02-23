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
    boundingRect?: ClientRect;
}
export interface DraggableBindings {
    value: DraggableValue;
}
export declare const Draggable: {
    bind(el: HTMLElement, binding: DraggableBindings): void;
    update(el: HTMLElement, binding: DraggableBindings): void;
};
