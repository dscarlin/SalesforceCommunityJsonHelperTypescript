
import SalesforceNetworkPayload from '../../Classes/SalesforceNetworkPayload';
import { VoidMethodNoArg, OmniScriptElement } from '../../Types'
import ClickableBlock from '../HelperElements/ClickableBlock';
import DraggableMixin from '../../Classes/DraggableMixin';
import DisplayField from '../HelperElements/DisplayField';
import Repeat from '../HelperElements/Repeat';
import MetaData from '../../Classes/MetaData';

export default class JsonWindow extends DraggableMixin(HTMLElement) {
    constructor(parser: string ='') {
        super();
        this.isParser = !!parser;
        this.create()
            .setStyle()
            .setListeners()
            .setOtherAttributes()
        this.expandedHeight = this.clientHeight;
    }

    //properties
    header!: HTMLDivElement;
    exists: boolean = false;
    readonly clientHeight!: number;
    private parsing: boolean = false;
    private isParser: boolean = false;
    private interval: number = 0;
    private expandedHeight: number;
    private networkPayloadString: string = '';
    private buttonBlock!: HTMLDivElement;
    private displayElement!: HTMLDivElement;
    private parseButton!: HTMLButtonElement;
    private copyButton!: HTMLSpanElement;
    private deleteButton!: HTMLSpanElement;
    private minimizeButton!: HTMLSpanElement;
    private optionsCheckboxLabel!: HTMLSpanElement;
    private optionsCheckbox!: HTMLInputElement;
    private textElement!: HTMLTextAreaElement;
    private repeatableData!: Repeat;
    private addButton!: VoidMethodNoArg;
    private removeButton!: VoidMethodNoArg;

    //computed properties
    private get omniScriptElement(): OmniScriptElement {
        const omniScriptElements =
            [...document.querySelectorAll('[data-data-rendering-service-uid]')] as OmniScriptElement[];
        return omniScriptElements.filter(i => i.jsonDataStr)[0];
    }
    private get omniScriptParentElement(): HTMLElement {
        return this.omniScriptElement.parentElement;
    }
    private get prettyPrintDataJson(): string {
        const jsonToParse = this.networkPayloadString ||
            !this.isParser && this.omniScriptElement?.jsonDataStr ||
            '{}'
        return JSON.stringify(JSON.parse(jsonToParse), null, 2);
    }
    private get parsed(): boolean {
        return this.parseButton?.innerText == 'Clear'
    }
    private get showOptions(): boolean {
        return this.optionsCheckbox.checked
    }

    /* methods */

    //element creation
    private create():JsonWindow {
        //widget
        this.displayElement = document.createElement('div');
        //header
        this.header = document.createElement('div');
        this.copyButton = document.createElement('span');
        this.deleteButton = document.createElement('span');
        this.minimizeButton = document.createElement('span');
        this.buttonBlock = document.createElement('div');
        //textArea
        this.textElement = document.createElement('textarea');

        this.optionsCheckboxLabel = document.createElement('span');
        this.optionsCheckbox = document.createElement('input');
        this.repeatableData = new Repeat([], this.selectPayloadPreview.bind(this));
        
        this.isParser && (this.parseButton = document.createElement('button'));
        this.draggableElement = this.displayElement;
        this.append(this.displayElement)
        return this
    }
    private setStyle():JsonWindow {
        this.buttonBlock.setAttribute('style','cursor:pointer');
        this.optionsCheckboxLabel.setAttribute('style', 'margin-left: .3rem');
        this.copyButton.setAttribute('style', 'width: fit-content; color: #35a4da;cursor: pointer')
        this.minimizeButton.setAttribute('style', 'width: fit-content; color: #35a4da; margin-right: .2rem;')
        this.deleteButton.setAttribute('style', 'width: fit-content; color: #35a4da; margin-left: .2rem; padding: 0 .2rem;')
        this.header.setAttribute('style', 'width: 100%; height: 2rem; cursor: move; display: flex; justify-content: space-between; font-size: 1.2rem; aligh-items: center');
        this.textElement.setAttribute('style', '  min-width: 10rem; max-width: 100%; overflow: scroll; border-color: rgba(59, 59, 59, 0.3); border-radius: 0.25rem;display: block')
        this.isParser && (this.parseButton.setAttribute('style', 'width: fit-content; background-color: #35a4da; color: white; padding: .2rem .4rem; border-radius: .4rem; display: block; margin-left: auto; margin-top: .4rem;'))
        this.displayElement.setAttribute('style', ' overflow: hidden; z-index: 1000; box-shadow: #000000 2px 2px 7px 2px; background: whitesmoke;padding: 0 .5em .5em; border-style: solid; border-width: 1px;border-color: #35a4da; border-radius: 0.5em; position: fixed; font-size: 1rem;')
        return this
    }
    private setListeners():JsonWindow {
        this.deleteButton.addEventListener('click', this.remove.bind(this))
        this.copyButton.addEventListener('click', this.copyToClipboard.bind(this))
        this.minimizeButton.addEventListener('click', this.toggleExpandWindow.bind(this))
        this.isParser && this.parseButton.addEventListener('click', this.parseData.bind(this))
        return this

    }
    private setOtherAttributes():JsonWindow {
        this.copyButton.innerHTML = 'Copy'
        this.deleteButton.innerHTML = 'X'
        this.optionsCheckboxLabel.innerHTML = 'Show Options'
        this.optionsCheckbox.setAttribute('type', 'checkbox');
        this.minimizeButton.innerHTML = '<strong>&#8210;</strong>'
        this.isParser && (this.parseButton.innerHTML = 'Parse Payload')
        new ResizeObserver(this.updateTextAreaWidth.bind(this)).observe(this.displayElement);
        !this.isParser && (this.textElement.setAttribute('disabled', ''));
        return this
    }

    //adding to screen
    private addButtonsToHeader(): void {
        this.header.append(this.copyButton)
        this.buttonBlock.append(this.minimizeButton)
        this.buttonBlock.append(this.deleteButton)
        this.header.append(this.buttonBlock)
    }
    private addHeaderToWindow(): void {
        this.displayElement.append(this.header)
    }
    private addTextAreaToWindow(): void {
        this.displayElement.append(this.textElement)
        if(this.isParser){
            this.displayElement.append(this.optionsCheckbox)
            this.displayElement.append(this.optionsCheckboxLabel)
        }
        this.displayElement.append(this.repeatableData)
    }
    private addParseButtonToWindow(): void {
        this.isParser && (this.displayElement.append(this.parseButton))
    }
    public addToScreen(): void {
        this.addButtonsToHeader();
        this.addHeaderToWindow();
        this.addTextAreaToWindow();
        this.addParseButtonToWindow();
        this.removeButton();
        this.setHeaderAsDraggable();
        this.exists = true;
        this.reInitialize()
        if (this.isParser) {
            this.textElement.innerHTML = '';
            document.body.prepend(this)
        } else {
            this.updateWindowWithCurrentJsonData();
            this.omniScriptParentElement.append(this)
            this.interval = setInterval(() => this.updateWindowWithCurrentJsonData(), 3000) as unknown as number
        }
    }

    //data json viewer actions
    private updateWindowWithCurrentJsonData():void {
        if (this.exists) {
            this.textElement.innerHTML = this.prettyPrintDataJson;
            const border: boolean = true
            this.flashTextArea(border)
        } else {
            this.stopUpdatingDataJson();
        }
    }
    private stopUpdatingDataJson(): void {
        clearInterval(this.interval)
    }

    //parser actions 
    private parseData():void {
        if (!this.parsed) {
            const unparsedPayload: string = this.textElement.value;
            const showOptions = this.showOptions
            const payload = new SalesforceNetworkPayload(unparsedPayload, showOptions);
            const { metadata, parsedString } = payload;
            this.applyResponseToUI(parsedString, metadata);
            this.textElement.value = this.prettyPrintDataJson;

        } else {
            this.applyResponseToUI();
        }
        this.flashTextArea();
        this.toggleParse();
    }
    
    private applyResponseToUI(parsedString?: string, metadata: MetaData[] = []) : void{
        this.networkPayloadString = parsedString || '';
        const fieldUpdates: HTMLElement[][] = metadata.map(this.fieldLabelsAndValues);
        this.repeatableData.update(fieldUpdates);
        this.textElement.value = ''
    }
    private fieldLabelsAndValues(metadata: MetaData): HTMLElement[]{
        return Object.entries({
            'Calling Descriptor: ': metadata.callingDescriptor || "",
            'Class : ': metadata.className || "",
            'Method: ': metadata.methodName || "",
            'Namespace: ': metadata.namespace || "",
            'sClass: ': metadata.sClassName || "",
            'Type: ': metadata.type || "",
            'sMethod: ': metadata.sMethodName || "",
            'DataRaptor: ': metadata.drBundle || "",
            'Result Type: ': metadata.resultType || ""
        }).map(([label, value]) => new DisplayField({ label, value }))
    }
    private toggleParse(): void {
        const text:string = this.parsed ? 'Parse Payload' : 'Clear';
        if (this.parsed) {
            this.textElement.removeAttribute('disabled')
            this.textElement.style.minWidth = '10rem';
            this.textElement.style.height = '8rem'
            this.optionsCheckbox.style.display = 'inline'
            this.optionsCheckboxLabel.style.display = 'inline'
            // this.textElement.style.width = 'unset'
            // this.textElement.style.height = 'unset'
            this.parsing = false;
        }

        else {
            this.textElement.setAttribute('disabled', '');
            this.optionsCheckbox.style.display = 'none'
            this.optionsCheckboxLabel.style.display = 'none'
            this.parsing = true;
        }

        this.parseButton.innerText = text
    }
    private selectPayloadPreview(ev: MouseEvent, repeatElement: Repeat, ): any {
        const childBlocksExcludingSeparators = [...repeatElement.repeatedElementBox.children].filter((child, index, arr) => !(index % 2)) as ClickableBlock[]
        childBlocksExcludingSeparators.map((child, index, arr) => {
            if (arr.length < 2) {
                return;
            }
            if (ev.currentTarget instanceof HTMLElement && index.toString() == ev.currentTarget.dataset.id) {
                this.textElement.value = JSON.stringify(JSON.parse(this.networkPayloadString)[index], null, 2);
                child.isSelected = true
                return;
            }
            child.isSelected = false
        })
    }
    private updateTextAreaWidth() {
        if (!this.expandedHeight && !this.parsed) {
            this.displayElement.style.height = 'auto';
        }
        if (this.parsing) {
            this.parsing = false;
            //get widest element being added 
            let width = 0;
            const repeatElements = [...this.repeatableData.repeatedElementBox.children] as ClickableBlock[]
            repeatElements.map(repeatElement => repeatElement.root &&
                ([...repeatElement.root.children] as DisplayField[]) //fields
                    .map(field => {
                        field.showCopyToolTip();

                        field.clientWidth > width && (width = field.clientWidth)
                        field.hideCopyToolTip();
                    })
            )
            if (width) {
                //update width
                this.textElement.style.width = `calc(${width}px + 1rem`;
                this.textElement.style.minWidth = `calc(${width}px + 1rem`;
                this.textElement.style.height = `calc(${width}px - 4rem`
            } else {
                //default widened width
                this.textElement.style.width = '20rem';
                this.textElement.style.height = '15rem';
            }
        }
    }


    //common actions
    private toggleExpandWindow(this: JsonWindow, ev: MouseEvent) {
        if (this.expandedHeight) {
            this.displayElement.style.height = `${this.expandedHeight}px`;
            this.displayElement.style.height = `auto`;

            this.expandedHeight = 0;
        } else {
            this.expandedHeight = this.displayElement.clientHeight;
            this.displayElement.style.height = '2rem';
        }
    }
    private flashTextArea(border?: boolean) {
        let delay = 200;
        if (border) {
            this.textElement.style.outline = "solid #acd3e6 1px"
            delay = 500;
        } else {
            this.textElement.style.backgroundColor = "#acd3e6";
        }
        setTimeout(() => (this.textElement.style.backgroundColor = "unset", this.textElement.style.outline = "unset"), delay)
    }
    private copyToClipboard() {
        //copy text
        const jsonDataText = this.textElement.innerHTML || this.textElement.value
        navigator.clipboard.writeText(jsonDataText);
        //flash background blue to signify copy was successful
        this.flashTextArea();
    }
    private reInitialize() {
        if (this.parsed) {
            this.toggleParse()
        }
        this.repeatableData.update([]);
        this.displayElement.style.top = this.isParser ? '27%' : '12%';
        this.displayElement.style.left = '75%';
        this.textElement.style.height = 'initial';
        this.textElement.style.width = 'initial';
        this.displayElement.style.height = 'auto';
        this.isParser && (this.textElement.value = '');
        // 
    }
    public remove() {
        this.stopUpdatingDataJson();
        this.addButton();
        this.exists = false;
        super.remove()
    }

    //communication with button
    public setRemoveButtonCallback(removeButtonCallback: VoidMethodNoArg) {
        this.removeButton = removeButtonCallback;
    }
    public setAddButtonCallback(addButtonCallback: VoidMethodNoArg) {
        this.addButton = addButtonCallback;
    }


}

