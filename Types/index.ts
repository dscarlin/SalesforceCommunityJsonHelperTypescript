export type ExtendedHTMLElement = new (...args: any[]) => HTMLElement;
export interface DraggableMixin extends HTMLElement{
    draggableElement: HTMLElement;
    header: HTMLElement;
    pos1: number;
    pos2: number;
    pos3: number;
    pos4: number;
    elmnt: HTMLElement;
    dragMouseDown: DragEvent;
    elementDrag: DragEvent;
    closeDragElement:DragEvent;
}

export type DragEvent = {
    (this: DraggableMixin, ev: MouseEvent): any
}

export type VoidMethodNoArg = {
    (): void
}

export type OmniScriptElement = HTMLElement & {
    jsonDataStr: string;
    parentElement: HTMLElement
}

export type Field = {
    label: string,
    value: string
}

export type ErrorMessage = {
    Error: string;
}

export type UntypedPayload = any;




