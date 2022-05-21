const scriptFile = fileName => { 
    const script = document.createElement('script'); 
    script.setAttribute('src', chrome.runtime.getURL(fileName)); 
    return script;
}

const scripts = [
    "SalesforceNetworkResponse.js",
    "WindowLauncherButton.js", 
    "DraggableElement.js", 
    "JsonWindow.js", 
    "WindowShowHideHandler.js",
    "index.js" 
].map(scriptFile);

document.body.append(...scripts);