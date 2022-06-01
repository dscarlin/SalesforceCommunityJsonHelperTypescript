function start(){
    customElements.define('c-repeat', Repeat);
    customElements.define('c-json-window', JsonWindow);
    customElements.define('c-display-field', DisplayField);
    customElements.define('c-clickable-block', ClickableBlock);
    customElements.define('c-window-launcher-button', WindowLauncherButton);
    new WindowShowHideHandler().delayedStart(5000);
}
start();
