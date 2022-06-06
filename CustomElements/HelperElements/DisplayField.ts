import ClickableBlock from './ClickableBlock'
import { Field } from '../../Types'

export default class DisplayField extends HTMLElement{
    constructor(field:Field){
        super();
        this.labelValue = field.label;
        this.textValue = field.value;
    }
    /* properties */
    private labelValue: string;
    private textValue: string;
    private text!: HTMLSpanElement;
    private copyToolTip!: HTMLSpanElement
    private label!: HTMLElement
    /* computed properties */
    public set textContent(val) {
        this.style.display = val ?  'block' : 'none';
        this.text.style.cursor = 'pointer';
        this.text.textContent = val || '';
    }
    public  get textContent(){
        return this.text.textContent;
    }
    /* methods */
    private connectedCallback(){

        this.style.display = 'none';
        this.style.width = 'fit-content';
        this.style.whiteSpace = 'nowrap';

        if(!this.label){

            this.create()
            this.append(this.label);
            this.append(this.text);
            this.append(this.copyToolTip);
        }
    }
    private create(){
        this.copyToolTip = document.createElement('span');
        this.copyToolTip.style.visibility = 'hidden';
        this.copyToolTip.style.color = 'green';
        this.copyToolTip.style.marginLeft = '.3rem';
        this.copyToolTip.textContent = 'Copied!';
        this.label = document.createElement('strong');
        this.label.textContent = this.labelValue;
        this.text = document.createElement('span');
        this.textContent = this.textValue; 
        this.text.addEventListener('click', this.handleClickCopy);
    }
    private handleClickCopy(this: HTMLSpanElement, ev: MouseEvent){
        const clickableBlock = this.parentElement?.parentElement?.parentElement as ClickableBlock;
        if(!clickableBlock.isSelected && !clickableBlock.singleSelect){
            return;
        } 
        ev.stopPropagation();
        const parent = this.parentElement as DisplayField;
        parent.showCopyToolTip();
        navigator.clipboard.writeText(this.textContent || '');
        setTimeout(() => parent.hideCopyToolTip(), 500);
    }
    public showCopyToolTip(){
        this.copyToolTip.style.visibility = 'visible';
    }
    public hideCopyToolTip(){
        this.copyToolTip.style.visibility = 'hidden'
    }
}