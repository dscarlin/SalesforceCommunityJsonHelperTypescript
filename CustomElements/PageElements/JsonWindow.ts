
import { VoidMethodNoArg, OmniScriptElement } from '../../Types'
import Repeat from '../HelperElements/Repeat';
import ClickableBlock from '../HelperElements/ClickableBlock';
import DisplayField from '../HelperElements/DisplayField';
import DraggableMixin from '../../Classes/DraggableMixin';
import SalesforceNetworkPayload from '../../Classes/SalesforceNetworkPayload';
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
    parsing: boolean;
    isParser: boolean;
    exists: boolean = false;
    interval: number;
    clientHeight: number;
    expandedHeight: number;
    networkPayloadString: string;
    header: HTMLDivElement;
    buttonBlock: HTMLDivElement;
    displayElement: HTMLDivElement;
    parseButton: HTMLButtonElement;
    copyButton: HTMLAnchorElement;
    deleteButton: HTMLAnchorElement;
    minimizeButton: HTMLAnchorElement;
    textElement: HTMLTextAreaElement;
    repeatableData: Repeat;
    addButton: VoidMethodNoArg;
    removeButton: VoidMethodNoArg;

    //computed properties
    get omniScriptElement(): OmniScriptElement {
        const omniScriptElements =
            [...document.querySelectorAll('[data-data-rendering-service-uid]')] as OmniScriptElement[];
        return omniScriptElements.filter(i => i.jsonDataStr)[0];
    }
    get omniScriptParentElement(): HTMLElement {
        return this.omniScriptElement.parentElement;
    }
    get prettyPrintDataJson(): string {
        const jsonToParse = this.networkPayloadString ||
            !this.isParser && this.omniScriptElement?.jsonDataStr ||
            '{}'
        return JSON.stringify(JSON.parse(jsonToParse), null, 2);
    }
    get parsed(): boolean {
        return this.parseButton?.innerText == 'Clear'
    }

    /* methods */

    //element creation
    create():JsonWindow {
        //widget
        this.displayElement = document.createElement('div');
        //header
        this.header = document.createElement('div');
        this.copyButton = document.createElement('a');
        this.deleteButton = document.createElement('a');
        this.minimizeButton = document.createElement('a');
        this.buttonBlock = document.createElement('div');
        //textArea
        this.repeatableData = new Repeat([], this.selectPayloadPreview.bind(this));
        this.textElement = document.createElement('textarea');
        
        this.isParser && (this.parseButton = document.createElement('button'));
        this.draggableElement = this.displayElement;
        this.append(this.displayElement)
        return this
    }
    setStyle():JsonWindow {
        this.header.setAttribute('style', 'width: 100%; height: 2rem; cursor: move; display: flex; justify-content: space-between; font-size: 1.2rem; aligh-items: center');
        this.copyButton.setAttribute('style', 'width: fit-content; color: #35a4da;')
        this.deleteButton.setAttribute('style', 'width: fit-content; color: #35a4da; margin-left: .2rem; padding: 0 .2rem')
        this.minimizeButton.setAttribute('style', 'width: fit-content; color: #35a4da; margin-right: .2rem')
        this.textElement.setAttribute('style', '  min-width: 10rem; max-width: 100%; overflow: scroll; border-color: rgba(59, 59, 59, 0.3); border-radius: 0.25rem;')
        this.isParser && (this.parseButton.setAttribute('style', 'width: fit-content; background-color: #35a4da; color: white; padding: .2rem .4rem; border-radius: .4rem; display: block; margin-left: auto; margin-top: .4rem;'))
        this.displayElement.setAttribute('style', ' overflow: hidden; z-index: 1000; box-shadow: #000000 2px 2px 7px 2px; background: whitesmoke;padding: 0 .5em .5em; border-style: solid; border-width: 1px;border-color: #35a4da; border-radius: 0.5em; position: fixed; font-size: 1rem;')
        return this
    }
    setListeners():JsonWindow {
        this.deleteButton.addEventListener('click', this.remove.bind(this))
        this.copyButton.addEventListener('click', this.copyToClipboard.bind(this))
        this.minimizeButton.addEventListener('click', this.toggleExpandWindow.bind(this))
        this.isParser && this.parseButton.addEventListener('click', this.parseData.bind(this))
        return this

    }
    setOtherAttributes():JsonWindow {
        this.copyButton.innerHTML = 'Copy'
        this.deleteButton.innerHTML = 'X'
        this.minimizeButton.innerHTML = '-'
        this.isParser && (this.parseButton.innerHTML = 'Parse Payload')
        new ResizeObserver(this.updateTextAreaWidth.bind(this)).observe(this.displayElement);
        !this.isParser && (this.textElement.setAttribute('disabled', ''));
        return this
    }

    //adding to screen
    addButtonsToHeader(): void {
        this.header.append(this.copyButton)
        this.buttonBlock.append(this.minimizeButton)
        this.buttonBlock.append(this.deleteButton)
        this.header.append(this.buttonBlock)
    }
    addHeaderToWindow(): void {
        this.displayElement.append(this.header)
    }
    addTextAreaToWindow(): void {
        this.displayElement.append(this.textElement)
        this.displayElement.append(this.repeatableData)
    }
    addParseButtonToWindow(): void {
        this.isParser && (this.displayElement.append(this.parseButton))
    }
    addToScreen(): void {
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
    updateWindowWithCurrentJsonData():void {
        if (this.exists) {
            this.textElement.innerHTML = this.prettyPrintDataJson;
            const border: boolean = true
            this.flashTextArea(border)
        } else {
            this.stopUpdatingDataJson();
        }
    }
    stopUpdatingDataJson(): void {
        clearInterval(this.interval)
    }

    //parser actions 
    parseData():void {
        if (!this.parsed) {
            const unparsedPayload: string = this.textElement.value;
            const payload = new SalesforceNetworkPayload(unparsedPayload);
            const { metadata, parsedString } = payload;
            this.applyResponseToUI(parsedString, metadata);
            this.textElement.value = this.prettyPrintDataJson;

        } else {
            this.applyResponseToUI();
        }
        this.flashTextArea();
        this.toggleParse();
    }
    applyResponseToUI(parsedString?: string, metadata: MetaData[] = []) : void{
        this.networkPayloadString = parsedString || '';
        const fieldUpdates: HTMLElement[][] = metadata.map(this.fieldLabelsAndValues);
        this.repeatableData.update(fieldUpdates);
        this.textElement.value = ''
    }
    fieldLabelsAndValues(metadata: MetaData): HTMLElement[]{
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
    toggleParse(): void {
        const text:string = this.parsed ? 'Parse Payload' : 'Clear';
        if (this.parsed) {
            this.textElement.removeAttribute('disabled')
            this.textElement.style.minWidth = '10rem';
            this.textElement.style.height = '8rem'
            // this.textElement.style.width = 'unset'
            // this.textElement.style.height = 'unset'
            this.parsing = false;
        }

        else {
            this.textElement.setAttribute('disabled', '');
            this.parsing = true;
        }

        this.parseButton.innerText = text
    }
    selectPayloadPreview(e: Event, repeatElement: Repeat) {
        const childBlocksExcludingSeparators = [...repeatElement.repeatedElementBox.children].filter((child, index, arr) => !(index % 2)) as ClickableBlock[]
        childBlocksExcludingSeparators.map((child, index, arr) => {
            if (arr.length < 2) {
                return;
            }
            if (e.currentTarget instanceof HTMLElement && index.toString() == e.currentTarget.dataset.id) {
                this.textElement.value = JSON.stringify(JSON.parse(this.networkPayloadString)[index], null, 2);
                child.isSelected = true
                return;
            }
            child.isSelected = false
        })
    }
    updateTextAreaWidth() {
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
    toggleExpandWindow(e: PointerEvent) {
        if (this.expandedHeight) {
            this.displayElement.style.height = `${this.expandedHeight}px`;
            this.displayElement.style.height = `auto`;

            this.expandedHeight = 0;
        } else {
            this.expandedHeight = this.displayElement.clientHeight;
            this.displayElement.style.height = '2rem';
        }
    }
    flashTextArea(border?: boolean) {
        let delay = 200;
        if (border) {
            this.textElement.style.outline = "solid #acd3e6 1px"
            delay = 500;
        } else {
            this.textElement.style.backgroundColor = "#acd3e6";
        }
        setTimeout(() => (this.textElement.style.backgroundColor = "unset", this.textElement.style.outline = "unset"), delay)
    }
    copyToClipboard() {
        //copy text
        const jsonDataText = this.textElement.innerHTML || this.textElement.value
        navigator.clipboard.writeText(jsonDataText);
        //flash background blue to signify copy was successful
        this.flashTextArea();
    }
    remove() {
        this.stopUpdatingDataJson();
        this.addButton();
        this.exists = false;
        super.remove()
    }
    reInitialize() {
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

    //communication with button
    setRemoveButtonCallback(removeButtonCallback: VoidMethodNoArg) {
        this.removeButton = removeButtonCallback;
    }
    setAddButtonCallback(addButtonCallback: VoidMethodNoArg) {
        this.addButton = addButtonCallback;
    }


}

