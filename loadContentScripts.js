const scriptFileToElement = fileName => { 
    const scriptElement = document.createElement('script'); 
    scriptElement.setAttribute('src', chrome.runtime.getURL(fileName)); 
    return scriptElement;
}
const scriptFileNames = [
    "DisplayField.js",
    "ClickableBlock.js",
    "Repeat.js",
    "SalesforceNetworkPayload.js",
    "WindowLauncherButton.js", 
    "DraggableMixin.js", 
    "JsonWindow.js", 
    "WindowShowHideHandler.js",
    "index.js" 
]
const scriptElements = scriptFileNames.map(scriptFileToElement);
document.body.append(...scriptElements);

