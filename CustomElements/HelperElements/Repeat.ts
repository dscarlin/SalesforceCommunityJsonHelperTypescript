import ClickableBlock from './ClickableBlock'
import NumberOfResults from './NumberOfResults'
type SelectPayloadCallback = {(e: PointerEvent, cmp: Repeat): void}

export default class Repeat extends HTMLElement{
    constructor(elements: ClickableBlock[][], onClickCallback: SelectPayloadCallback){
        super();
        this.elements = elements;
        this.onClickCallback = onClickCallback;
        this.root = document.createElement('div');
        this.repeatedElementBox = document.createElement('div');
        this.numberOfResults = new NumberOfResults();
        this.root.append(this.numberOfResults);
        this.root.append(this.repeatedElementBox);
        this.repeatedElementBox.style.maxHeight = '11rem'
        this.repeatedElementBox.style.padding = '2px'
    }
    elements: HTMLElement[][];
    root: HTMLDivElement;
    repeatedElementBox: HTMLDivElement;
    numberOfResults: NumberOfResults;
    currentElement: HTMLElement | null;
    lastElementList: HTMLElement[];

    onClickCallback: SelectPayloadCallback;

    connectedCallback(){
        if(![...this.children].length){
            this.append(this.root);
        }
        this.update(this.elements);
    }
    pointerClick(e: PointerEvent): void{
        this.onClickCallback(e, this);
    }
    update(elements: HTMLElement[][]){
        this.elements = elements;
        this.reset();
        this.evaluate(elements);
    }
    reset(){
        this.repeatedElementBox.textContent = '';
        this.numberOfResults.textContent = '';
        this.currentElement = null;
        this.lastElementList = [];
        this.singleOrMultipleElementDisplay()
    }
    singleOrMultipleElementDisplay(){
        const repeat = this.elements.length > 1;
        this.repeatedElementBox.style.overflow = repeat ? 'scroll' : 'hidden'
        repeat && (this.numberOfResults.number = this.elements.length)
    }
    evaluate(elements: HTMLElement[][] | HTMLElement[]){
        elements.forEach( (element, index) => {
            const parent = (this.currentElement || this.repeatedElementBox)
            const listOfChildElements = Array.isArray(element)
            const onLastElement = index === elements.length - 1
            const onlyOneElement = onLastElement && index == 0;
            if(listOfChildElements){
                
                const child = new ClickableBlock(index.toString(), this.pointerClick.bind(this))
                const notFirstElement = index > 0
                if(notFirstElement){
                    this.addSeparator(parent);
                }
                if(onlyOneElement){
                    child.singleSelect = true;
                }
                parent.append(child);
                const parentIsNotRoot = parent == this.currentElement
                if(parentIsNotRoot){
                    this.lastElementList.push(parent)
                }
                this.currentElement = child;
                this.evaluate(element)
                return;
            }
            if(onLastElement){
                const lastParent = this.lastElementList.pop() || this.repeatedElementBox;
                this.currentElement = lastParent;
            }
            parent.append(element);
        })
    }
    addSeparator(parent: HTMLElement){
        const separatorLine = document.createElement('hr')
        separatorLine.style.margin = '0';
        parent.append(separatorLine); 
    }  
}