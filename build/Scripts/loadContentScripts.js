const scriptFileNames = [
    "Scripts/bundle.js" 
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





