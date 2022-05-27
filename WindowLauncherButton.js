class WindowLauncherButton extends HTMLElement {
    constructor(parser) {
        super();
        this.exists = false;
        this.isParser = !!parser
        this.create()
            .setHoverBehavior()
            .setStyle()
            .setText()
        this.toggleOpacity = this.toggleOpacity.bind(this)
    }
    //methods
    create() {
        this.button = document.createElement('button');
        this.append(this.button);
        return this;
    }
    setHoverBehavior() {
        this.button.onmouseenter = this.toggleOpacity.bind(this);
        this.button.onmouseleave = this.toggleOpacity.bind(this);
        return this;
    }
    setStyle() {
        this.button.setAttribute('style', 'position: fixed; right:0; top: 200px; z-index: 1000; font-weight: 1000;border: blue solid 1px;border-radius: 0.3rem 0 0 0.3rem;background: #35a4da; opacity: .6; padding-bottom: 4px;font-size: .75em;');
        this.isParser && (this.button.style.top = '250px');
        return this;
    }
    setText() {
        const text = this.isParser ? '&#9729;' : '{}';
        this.button.innerHTML = text;
        return this;
    }
    setClickListener() {
        this.button.addEventListener('click', this.addWindow);
        return this;
    }
    toggleOpacity(e) {
        if (this.button.dataset.bright === 'true') {
            this.setAsBright();
        } else {
            this.setAsDull();
        }
    }
    setAsBright() {
        const button = this.button
        button.style.opacity = .6;
        button.dataset.bright = 'false';
        
        if (this.isParser) {
            button.style.fontSize = '.83em';
            
        } else {
            button.innerHTML = '{}'
        }
        button.style.maxHeight = '2em'
        button.style.maxWidth = '2em'
    }
    setAsDull() {
        const button = this.button
        button.style.opacity = 1;
        button.dataset.bright = 'true';
        if (this.isParser) {
            button.style.fontSize = '1.3em';
        } else {
            button.innerHTML = '{...}'
        }
        button.style.maxHeight = '3em'
        button.style.maxWidth = '3em'
    }

    setAddWindowCallback(addWindowCallback) {
        this.addWindow = addWindowCallback.bind(this);
        this.setClickListener();
    }
    addToScreen() {
        this.exists = true;
        this.reInitialize();
        document.body.append(this);
        return true;
    }
    reInitialize() {
        if (this.button.style.opacity == 1) {
            this.toggleOpacity()
        }
    }
    remove(clickEvent) {
        this.exists = false;
        !!clickEvent && this.toggleOpacity()
        super.remove();
    }
}