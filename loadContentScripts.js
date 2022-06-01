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
];
const scriptFileToElement = (index=0) => { 
    const fileName = scriptFileNames[index]
    if(!fileName) return;
    const scriptElement = document.createElement('script'); 
    scriptElement.setAttribute('src', chrome.runtime.getURL(fileName)); 
    document.body.append(scriptElement);
    setTimeout(() => scriptFileToElement(index + 1));
}
scriptFileToElement();





