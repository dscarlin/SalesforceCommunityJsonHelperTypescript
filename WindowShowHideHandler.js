class WindowShowHideHandler {
    constructor() {
        this.watchForBrowserHistoryStateChange();
    }
    //computed properties
    get window() {
        if (this._window) return this._window;
        this._window = new JsonWindow()
        return this._window
    }
    get button() {
        if (this._button) return this._button;
        this._button = new WindowLauncherButton()
        return this._button
    }
    get parser_window() {
        if (this._parser_window) return this._parser_window;
        this._parser_window = new JsonWindow('parser_')
        return this._parser_window
    }
    get parser_button() {
        if (this._parser_button) return this._parser_button;
        this._parser_button = new WindowLauncherButton('parser_')
        return this._parser_button
    }
    
    //methods
    watchForBrowserHistoryStateChange() {
        history.pushState = (f => function pushState() {
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.pushState);

        history.replaceState = (f => function replaceState() {
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });

        window.addEventListener('locationchange', this.browserHistoryStateChangeHandler.bind(this));
    }
    delayedStart(delay, count = 0) {
        const time = new Date().getTime();
        const added = this.addLauncherButtonsIfApplicable()
        if (!added && count < 15 || time - this.lastLocationChange < 5000) {
            count++
            this.pendingDelay = setTimeout(() => this.delayedStart(delay, count), delay);
        }

    }
    browserHistoryStateChangeHandler() {
        this.lastLocationChange = new Date().getTime();
        this.window.exists = false;
        clearTimeout(this.pendingDelay); this.pendingDelay = null;
        this.delayedStart(2000);
    }
    allowWindowAndButtonToAddAndRemoveEachOther(parser=''){
        const { 
            [`${parser}window`]: window, 
            [`${parser}button`]: button 
        } = this
        button.setAddWindowCallback(window.addToScreen.bind(window));
        window.setAddButtonCallback( button.addToScreen.bind( button));
        window.setRemoveButtonCallback( button.remove.bind( button));
    }
    removeButtonIfExists(){
        this.button.exists &&  this.button.remove();

    }
    addLauncherButtonsIfApplicable() {
        const isNotSalesforce = !document.querySelector('[data-aura-rendered-by],[data-aura-class]')
        if(isNotSalesforce) return false;
        this.addButton('parser_')
        const numberOfOmniScripts = [
            ...document.querySelectorAll('[data-data-rendering-service-uid]')
            ].filter(i => i.jsonDataStr).length
        if(numberOfOmniScripts !== 1) {
            this.removeButtonIfExists()
            return false;
        }
        this.addButton();
        return true;
    }
    addButton(parser=''){
        this.allowWindowAndButtonToAddAndRemoveEachOther(parser)
        const { 
            [`${parser}window`]: window, 
            [`${parser}button`]: button 
        } = this
        if(!button.exists && !window.exists){
                button.addToScreen();
        }
    }

}