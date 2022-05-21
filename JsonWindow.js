class JsonWindow{
    constructor(parser){
        this.exists = false;
        this.isParser = !!parser;
        this.create()
        .setStyle()
        .setListeners()
        .setOtherAttributes()
    }
    //computed properties
    get omniScriptElement(){
        return [...document.querySelectorAll('[data-data-rendering-service-uid]')].filter(i => i.jsonDataStr)[0];
    }
    get omniScriptParentElement(){
        return this.omniScriptElement.parentElement;
    }
    get prettyPrintDataJson(){
        return JSON.stringify(JSON.parse(this.networkPayloadString || !this.isParser && this.omniScriptElement?.jsonDataStr || '{}' ), null, 2);
    }
    get draggableElement(){
        return this.displayElement
    }
    get parsed(){
        return this.parseButton?.innerText == 'Clear'
    }
    //methods
    
    create(){
        //widget
        this.displayElement = document.createElement('div');
        //header
        this.header = document.createElement('div');
        this.copyButton = document.createElement('a');
        this.deleteButton = document.createElement('a');
        //textArea
        this.textElement = document.createElement('textarea');
        this.isParser && (this.parseButton = document.createElement('button'));
        return this
    }
    setStyle(){
        this.header.setAttribute('style','width: 100%; height: 2rem; cursor: move; display: flex; justify-content: space-between;');
        this.copyButton.setAttribute('style', 'width: fit-content; color: #35a4da;')
        this.deleteButton.setAttribute('style',  'width: fit-content; color: #35a4da;')
        this.textElement.setAttribute('style','  min-width: 150px; max-width: 100%; overflow: scroll; border-color: rgba(59, 59, 59, 0.3); border-radius: 0.25rem;')
        this.isParser && (this.parseButton.setAttribute('style',  'width: fit-content; background-color: #35a4da; color: white; padding: .2rem .4rem; border-radius: .4rem; display: block; margin-left: auto; margin-top: .4rem;'))
        this.displayElement.setAttribute('style',' display: overflow: scroll;z-index: 1000; box-shadow: #808080 3px 3px 5px 2px; background: whitesmoke;padding: 1em; border-style: solid; border-width: 1px;border-color: #35a4da; border-radius: 0.5em; position: fixed;')
        return this
    }
    
    setListeners(){
        this.deleteButton.addEventListener('click', this.remove.bind(this))
        this.copyButton.addEventListener('click', this.copyToClipboard.bind(this))
        this.isParser && this.parseButton.addEventListener('click', this.parseData.bind(this))
        return this

    }
    parseData(){
        if(!this.parsed){
            const dataText = this.textElement.value;
            this.networkPayloadString = new SalesforceNetworkResponse(dataText).dataPayload;
            console.log({networkPayloadString: this.networkPayloadString})
            this.textElement.value = this.prettyPrintDataJson;
        } else {
            this.textElement.value = ''
        }
        this.flashTextArea();
        this.toggleParse();
    }
    toggleParse(){
        const text = this.parsed ? 'Parse Payload' : 'Clear';
        this.parseButton.innerText = text
    }
    setOtherAttributes(){
        this.copyButton.innerHTML = 'Copy'
        this.deleteButton.innerHTML = 'X'
        this.isParser && (this.parseButton.innerHTML = 'Parse Payload')
        !this.isParser && (this.textElement.setAttribute('disabled',''));
        return this
    }
    addButtonsToHeader(){
        this.header.append(this.copyButton)
        // this.header.append(this.title)
        this.header.append(this.deleteButton)
    }
    addHeaderToWindow(){
        this.displayElement.append(this.header)
    }
    addTextAreaToWindow(){
        this.displayElement.append(this.textElement)
    }
    addParseButtonToWindow(){
        this.isParser && (this.displayElement.append(this.parseButton))
    }
    addToScreen(e){ 
        this.addButtonsToHeader();
        this.addHeaderToWindow();
        this.addTextAreaToWindow();
        this.addParseButtonToWindow();
        this.removeButton(e);
        this.exists = true;
        this.reInitialize()
        if(this.isParser){
            this.textElement.innerHTML =  '';
            document.body.prepend(this.displayElement)
        } else {
            this.updateWindowWithCurrentJsonData();
            this.omniScriptParentElement.append(this.displayElement)
            this.interval = setInterval(()=> this.updateWindowWithCurrentJsonData(), 3000)
        }
    }
    setRemoveButtonCallback(removeButtonCallback){
        this.removeButton = removeButtonCallback;
    }
    setAddButtonCallback(addButtonCallback){
        this.addButton = addButtonCallback;
    }
    copyToClipboard(){
        //copy text
        const jsonDataText = this.textElement.innerHTML || this.textElement.value
        navigator.clipboard.writeText(jsonDataText);
        //flash background blue to signify copy was successful
        this.flashTextArea();
    }
    flashTextArea(border){
        let delay = 200;
        if(border){
            this.textElement.style.outline = "solid #acd3e6 1px"
            delay = 500;
        }else{
            this.textElement.style.backgroundColor = "#acd3e6";
        }
        setTimeout(()=> (this.textElement.style.backgroundColor = "unset", this.textElement.style.outline = "unset"), delay)
    }
    reInitialize() {
        if (this.parsed) {
            this.toggleParse()
        }
        this.displayElement.style.top = this.isParser ? '27%' : '12%';
        this.displayElement.style.left = '85%';
        this.textElement.style.height = 'initial';
        this.textElement.style.width = 'initial';
        this.isParser && (this.textElement.value = '');
        // 
    }
    updateWindowWithCurrentJsonData(){
        if(this.exists){
            this.textElement.innerHTML = this.prettyPrintDataJson;
            const border = true
            this.flashTextArea(border)
        } else{ 
            this.stopUpdatingDataJson();
        }
    }
    stopUpdatingDataJson(){
        clearInterval(this.interval)
    }
    remove(){
        this.displayElement.remove();
        this.stopUpdatingDataJson();
        this.addButton();
        this.exists = false;
    }
}