type VoidEventCallback = {
    (e: PointerEvent): void
}
type VoidMethodNoArg = {
    (): void
}
type OmniScriptElement = HTMLElement & {
    jsonDataStr: string;
    parentElement: HTMLElement
}
type Field = {
    label: string,
    value: string
}
type ErrorMessage = {
    Error: string;
}
type UntypedPayload = any;
type Mixable = new (...args: any[]) => HTMLElement;
export {
    VoidEventCallback,
    VoidMethodNoArg,
    OmniScriptElement,
    ErrorMessage,
    UntypedPayload,
    Mixable,
    Field
}