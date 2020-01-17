import Vue, { DirectiveOptions, VNodeDirective } from "vue";
export declare type HandleType = Vue | HTMLElement;
export declare type MouseOrTouchEvent = MouseEvent | TouchEvent;
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
    onPositionChange?: (posDiff?: PositionDiff, pos?: Position, event?: MouseOrTouchEvent) => void;
    onDragEnd?: (posDiff?: PositionDiff, pos?: Position, event?: MouseOrTouchEvent) => void;
    onDragStart?: (posDiff?: PositionDiff, pos?: Position, event?: MouseOrTouchEvent) => void;
    resetInitialPos?: boolean;
    stopDragging?: boolean;
    boundingRect?: ClientRect;
    boundingElement?: HTMLElement;
    boundingRectMargin?: MarginOptions;
    initialPosition?: Position;
}
export interface DraggableBindings extends VNodeDirective {
    value: DraggableValue;
}
export interface DraggableState {
    initialPosition: Position;
    startDragPosition: Position;
    currentDragPosition: Position;
    initialMousePos?: Position;
}
export declare const Draggable: DirectiveOptions;
