const scriptFileNames = [
    "CustomElements/HelperElements/DisplayField.js",
    "CustomElements/HelperElements/ClickableBlock.js",
    "CustomElements/HelperElements/Repeat.js",
    "Classes/SalesforceNetworkPayload.js",
    "CustomElements/PageElements/WindowLauncherButton.js", 
    "Classes/DraggableMixin.js", 
    "CustomElements/PageElements/JsonWindow.js", 
    "Classes/WindowShowHideHandler.js",
    "InitializingScripts/index.js" 
];
const scriptFilesToElements = (scriptFileNames, index=0) => { 
    const fileName = scriptFileNames[index]
    if(!fileName) return;
    const scriptElement = document.createElement('script'); 
    scriptElement.setAttribute('src', chrome.runtime.getURL(fileName)); 
    document.body.append(scriptElement);
    setTimeout(() => scriptFilesToElements(scriptFileNames, index + 1));
}
scriptFilesToElements(scriptFileNames);





