import { VoidEventCallback } from '../../Types'

export default class ClickableBlock extends HTMLElement{
    constructor(identifier: string, callback: VoidEventCallback  ){
        super();
        this.dataset.id = identifier;
        this.onclick = callback;
        this.root = document.createElement('div');
        this.root.style.padding = '1rem .5rem';
        this.root.style.cursor = 'pointer';        
    }
    root: HTMLDivElement;
    private _singleSelect: boolean;
    private _isSelected: boolean;
    get isSelected(){
        return this._isSelected;
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
            this.onclick = (e:PointerEvent) => null;
        }
    }
    get singleSelect(){
        return this._singleSelect;
    }   
    connectedCallback(){
        if(![...this.children].length){
            this.append(this.root, this.root);
        }
    }
    append(el: HTMLElement, root?: HTMLElement){
        if(root){
            super.append(el);
            return;
        }
        this.root.append(el);
    }
}