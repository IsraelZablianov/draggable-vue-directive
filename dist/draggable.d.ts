import Vue from "vue";
export declare type HandleType = Vue | HTMLElement;
export interface Position {
    left: number;
    top: number;
}
export interface PositionDiff {
    x: number;
    y: number;
}
export interface MarginOptions {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}
export interface DraggableValue {
    handle?: HandleType;
    onPositionChange?: (posDiff?: PositionDiff, pos?: Position, event?: MouseEvent) => void;
    onDragEnd?: (posDiff?: PositionDiff, pos?: Position, event?: MouseEvent) => void;
    onDragStart?: (posDiff?: PositionDiff, pos?: Position, event?: MouseEvent) => void;
    resetInitialPos?: boolean;
    stopDragging?: boolean;
    boundingRect?: ClientRect;
    boundingElement?: HTMLElement;
    boundingRectMargin?: MarginOptions;
    initialPosition?: Position;
}
export interface DraggableBindings {
    value: DraggableValue;
}
export interface DraggableState {
    initialPosition: Position;
    startDragPosition: Position;
    currentDragPosition: Position;
    initialMousePos?: Position;
}
export declare const Draggable: {
    bind(el: HTMLElement, binding: DraggableBindings): void;
    update(el: HTMLElement, binding: DraggableBindings): void;
};
