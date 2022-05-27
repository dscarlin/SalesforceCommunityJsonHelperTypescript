class Repeat extends HTMLElement{
    constructor(elements, onClickCallback){
        super();
        this.elements = elements;
        this.onClickCallback = onClickCallback;
        this.root = document.createElement('div');
        this.repeatedElementBox = document.createElement('div');
        this.numberOfResults = document.createElement('span');
        Object.defineProperty(this.numberOfResults,'number',  {
            set: function(val) {this.textContent = `${val} results:`}.bind(this.numberOfResults)
        });
        this.root.append(this.numberOfResults);
        this.root.append(this.repeatedElementBox);
        this.repeatedElementBox.style.maxHeight = '11rem'
        this.repeatedElementBox.style.padding = '2px'
    }
    connectedCallback(){
        if(![...this.children].length){
            this.append(this.root);
        }
        this.update(this.elements);
    }
    click(e){
        this.onClickCallback(e, this);
    }
    update(elements){
        this.reset();
        this.evaluate(elements);
    }
    reset(){
        this.repeatedElementBox.textContent = '';
        this.numberOfResults.textContent = '';
        this.currentElement = '';
        this.lastElementList = [];
        this.singleOrMultipleElementDisplay()
    }
    singleOrMultipleElementDisplay(){
        const repeatedElement = elements.length > 1;
        this.repeatedElementBox.style.overflow = repeatedElement ? 'scroll' : 'hidden'
        repeatedElement && 
            (this.numberOfResults.number = elements.length)
    }
    evaluate(elements){
        elements.forEach( (element, index) => {
            const parent = (this.currentElement || this.repeatedElementBox)
            let child = element;
            const listOfChildElements = Array.isArray(child)
            const onLastElement = index === elements.length - 1
            const onlyOneElement = onLastElement && index == 0;
            if(listOfChildElements){
                const grandChildren = child;
                child = new ClickableBlock(index, this.click.bind(this))
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
                this.evaluate(grandChildren)
                return;
            }
            if(onLastElement){
                const lastParent = this.lastElementList.pop() || this.repeatedElementBox;
                this.currentElement = lastParent;
            }
            parent.append(element);
        })
    }
    addSeparator(parent){
        const separatorLine = document.createElement('hr')
        separatorLine.style.margin = '0';
        parent.append(separatorLine); 
    }  
}