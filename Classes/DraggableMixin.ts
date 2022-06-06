import { ExtendedHTMLElement, DraggableMixin } from '../Types'

const DraggableMixin = (superClass: ExtendedHTMLElement)  => (class extends superClass  {
    constructor(){
        super()
    }

    /* properties */
    public draggableElement!: HTMLElement;
    public header!:HTMLElement;
     pos1: number = 0;
     pos2: number = 0;
     pos3: number = 0;
     pos4: number = 0;
    /* computed properties */
     get elmnt(){
        return this.draggableElement;
    }
    /* methods */
    setHeaderAsDraggable(): void{
        this.header.onmousedown = this.dragMouseDown.bind(this);
    }

    dragMouseDown(this: DraggableMixin, ev: MouseEvent): any {
        console.log('test')
        ev.preventDefault();
        // ev.stopPropagation();
        // get the mouse cursor position at startup:
        this.pos3 = ev.clientX;
        this.pos4 = ev.clientY;
        document.onmouseup = this.closeDragElement.bind(this);
        // call a function whenever the cursor moves:
        document.onmousemove = this.elementDrag.bind(this);
    }

    elementDrag(this: DraggableMixin , ev: MouseEvent): any {
        ev.preventDefault();
        // calculate the new cursor position:
        this.pos1 = this.pos3 - ev.clientX;
        this.pos2 = this.pos4 - ev.clientY;
        this.pos3 = ev.clientX;
        this.pos4 = ev.clientY;
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
