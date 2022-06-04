import { Mixable } from '../Types'

const DraggableMixin = (superClass: Mixable)  => (class extends superClass  {
    constructor(){
        super()
    }

    /* properties */
    pos1: number = 0;
    pos2: number = 0;
    pos3: number = 0;
    pos4: number = 0;
    draggableElement: HTMLElement;
    header:HTMLElement;
    /* computed properties */
    get elmnt(){
        return this.draggableElement;
    }
    /* methods */
    setHeaderAsDraggable(): void{
        this.header.onmousedown = this.dragMouseDown.bind(this);
    }
    dragMouseDown(e: PointerEvent): void {
        console.log('test')
        e.preventDefault();
        // e.stopPropagation();
        // get the mouse cursor position at startup:
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.onmouseup = this.closeDragElement.bind(this);
        // call a function whenever the cursor moves:
        document.onmousemove = this.elementDrag.bind(this);
    }
    elementDrag(e: PointerEvent): void {
        e.preventDefault();
        // calculate the new cursor position:
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        // set the element's new position:
        const offsetTop: number = this.elmnt.offsetTop < 0 ? 0 : this.elmnt.offsetTop;
        
        this.elmnt.style.top = (offsetTop - this.pos2) + "px";
        this.elmnt.style.left = (this.elmnt.offsetLeft - this.pos1) + "px";
    }
    closeDragElement(): void {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    } 
})
export default DraggableMixin