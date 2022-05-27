class ClickableBlock extends HTMLElement{
    constructor(identifier, callback){
        super();
        this.dataset.id = identifier;
        this.onclick = callback;
        this.root = document.createElement('div');
        this.root.style.padding = '1rem .5rem';
        this.root.style.cursor = 'pointer';        
    }
    set isSelected(bool){
        this._isSelected = bool;
        if(bool){
            this.root.style.outline = '#35a4da solid 2px';
            this.root.style.borderRadius = '.5rem';
            return
        }
        this.root.style.outline = 'initial';
    }
    set singleSelect(bool){
        this._singleSelect = bool;
        if(bool){
            this.root.style.cursor = 'initial';
            this.onclick = '';
        }
    }
    get singleSelect(){
        return this._singleSelect;
    }
    get isSelected(){
        return this._isSelected;
    }
    connectedCallback(){
        if(![...this.children].length){
            this.append(this.root, true);
        }
    }
    append(el, root){
        if(root){
            super.append(el);
            return;
        }
        this.root.append(el);
    }
}