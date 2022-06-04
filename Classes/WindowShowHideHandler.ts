import JsonWindow from "../CustomElements/PageElements/JsonWindow";
import WindowLauncherButton from "../CustomElements/PageElements/WindowLauncherButton";
import { OmniScriptElement } from '../Types'

export default class WindowShowHideHandler {
    constructor() {
        this.watchForBrowserHistoryStateChange();
    }
    private _window: JsonWindow;
    private _button: WindowLauncherButton;
    private _parser_window: JsonWindow;
    private _parser_button: WindowLauncherButton;
    private lastLocationChange: number;
    private pendingDelay: number;

    //computed properties
    private get window() {
        if (this._window) return this._window;
        this._window = new JsonWindow()
        return this._window
    }
    private get button() {
        if (this._button) return this._button;
        this._button = new WindowLauncherButton()
        return this._button
    }
    private get parser_window() {
        if (this._parser_window) return this._parser_window;
        this._parser_window = new JsonWindow('parser_')
        return this._parser_window
    }
    private get parser_button() {
        if (this._parser_button) return this._parser_button;
        this._parser_button = new WindowLauncherButton('parser_')
        return this._parser_button
    }
    
    //methods
    private watchForBrowserHistoryStateChange(): void {
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

        window.addEventListener('locationchange', this.newDataJsonWindow.bind(this));
    }
    public delayedStart(delay: number, tries = 0): void {
        const maximumAmountOfTries = 15;
        const time = new Date().getTime();
        const buttonAddedToScreen = this.addLauncherButtonsIfApplicable()
        const notAddedAndStillRemainingTries = !buttonAddedToScreen && tries < maximumAmountOfTries
        const locationChangeWithinTheLastFiveSeconds = time - this.lastLocationChange < 5000
        const shouldStartAgainAfterDelay = notAddedAndStillRemainingTries || locationChangeWithinTheLastFiveSeconds
        
        if (shouldStartAgainAfterDelay) {
            tries++
            this.pendingDelay = setTimeout(() => this.delayedStart(delay, tries), delay) as unknown as number;
        }
    }
    private newDataJsonWindow(): void {
        const currentTime = new Date().getTime();
        this.lastLocationChange = currentTime;
        this.window.exists = false;
        this.resetPendingDelay();
        this.delayedStart(2000);
    }
    private resetPendingDelay(){
        clearTimeout(this.pendingDelay); this.pendingDelay = null;
    }
    private allowWindowAndButtonToAddAndRemoveEachOther(parser=''): void{
        const { button, window } = this.getWindowAndButton(parser);
        button.setAddWindowCallback(window.addToScreen.bind(window));
        window.setAddButtonCallback( button.addToScreen.bind( button));
        window.setRemoveButtonCallback( button.remove.bind( button));
    }
    private removeButton(){
        this.button.exists &&  this.button.remove();

    }
    private addLauncherButtonsIfApplicable(): boolean {
        const isNotSalesforce = !document.querySelector('[data-aura-rendered-by],[data-aura-class]')
        if(isNotSalesforce) return false;
        this.addButton('parser_')
        const numberOfOmniScripts = ([
            ...document.querySelectorAll('[data-data-rendering-service-uid]')
            ] as OmniScriptElement[]).filter(i => i.jsonDataStr).length
        if(numberOfOmniScripts !== 1) {
            this.removeButton()
            return false;
        }
        this.addButton();
        return true;
    }
    private addButton(parser=''): void{
        const { button, window } = this.getWindowAndButton(parser);
        if(!button.exists && !window.exists){
            button.addToScreen();
            this.allowWindowAndButtonToAddAndRemoveEachOther(parser)
        }
    }
    private getWindowAndButton(parser = ''){
        let window: JsonWindow, button: WindowLauncherButton;
        if(parser){
            window = this.parser_window;
            button = this.parser_button;
        }else {
            window = this.window;
            button = this.button;
        }
        return ({button, window})
    }

}