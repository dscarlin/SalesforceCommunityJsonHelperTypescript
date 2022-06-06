import Repeat from './Repeat';
type SelectBlockCallback = {( this: HTMLElement | Repeat, ev: MouseEvent): any}

export default class ClickableBlock extends HTMLElement{
    constructor(identifier: string, callback: SelectBlockCallback  ){
        super();
        this.dataset.id = identifier;
        this.clickCallback = callback;
        this.addEventListener('click', callback);
        this.root = document.createElement('div');
        this.root.style.padding = '1rem .5rem';
        this.root.style.cursor = 'pointer';        
    }
    public root: HTMLDivElement;
    private _singleSelect: boolean = true;
    private _isSelected: boolean = false;
    private clickCallback: SelectBlockCallback;
    public get isSelected(){
        return this._isSelected;
    }
    public set isSelected(bool){
        this._isSelected = bool;
        if(bool){
            this.root.style.outline = '#35a4da solid 2px';
            this.root.style.borderRadius = '.5rem';
            return
        }
        this.root.style.outline = 'initial';
    }
    public set singleSelect(bool){
        this._singleSelect = bool;
        if(bool){
            this.root.style.cursor = 'initial';
            this.removeEventListener('click', this.clickCallback);
        }
    }
    public get singleSelect(){
        return this._singleSelect;
    }   
    private connectedCallback(){
        if(![...this.children].length){
            super.append(this.root);
        }
    }
    public append(el: HTMLElement){
        this.root.append(el);
    }
}