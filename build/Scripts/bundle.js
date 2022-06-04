(()=>{"use strict";class t extends HTMLElement{constructor(t,e){super(),this.dataset.id=t,this.onclick=e,this.root=document.createElement("div"),this.root.style.padding="1rem .5rem",this.root.style.cursor="pointer"}get isSelected(){return this._isSelected}set isSelected(t){if(this._isSelected=t,t)return this.root.style.outline="#35a4da solid 2px",void(this.root.style.borderRadius=".5rem");this.root.style.outline="initial"}set singleSelect(t){this._singleSelect=t,t&&(this.root.style.cursor="initial",this.onclick=t=>null)}get singleSelect(){return this._singleSelect}connectedCallback(){[...this.children].length||this.append(this.root,this.root)}append(t,e){e?super.append(t):this.root.append(t)}}class e extends HTMLElement{set number(t){this.textContent=`${t} results:`}}class s extends HTMLElement{constructor(t,s){super(),this.elements=t,this.onClickCallback=s,this.root=document.createElement("div"),this.repeatedElementBox=document.createElement("div"),this.numberOfResults=new e,this.root.append(this.numberOfResults),this.root.append(this.repeatedElementBox),this.repeatedElementBox.style.maxHeight="11rem",this.repeatedElementBox.style.padding="2px"}connectedCallback(){[...this.children].length||this.append(this.root),this.update(this.elements)}pointerClick(t){this.onClickCallback(t,this)}update(t){this.elements=t,this.reset(),this.evaluate(t)}reset(){this.repeatedElementBox.textContent="",this.numberOfResults.textContent="",this.currentElement=null,this.lastElementList=[],this.singleOrMultipleElementDisplay()}singleOrMultipleElementDisplay(){const t=this.elements.length>1;this.repeatedElementBox.style.overflow=t?"scroll":"hidden",t&&(this.numberOfResults.number=this.elements.length)}evaluate(e){e.forEach(((s,i)=>{const n=this.currentElement||this.repeatedElementBox,a=Array.isArray(s),o=i===e.length-1,r=o&&0==i;if(a){const e=new t(i.toString(),this.pointerClick.bind(this));i>0&&this.addSeparator(n),r&&(e.singleSelect=!0),n.append(e);return n==this.currentElement&&this.lastElementList.push(n),this.currentElement=e,void this.evaluate(s)}if(o){const t=this.lastElementList.pop()||this.repeatedElementBox;this.currentElement=t}n.append(s)}))}addSeparator(t){const e=document.createElement("hr");e.style.margin="0",t.append(e)}}class i extends HTMLElement{constructor(t){super(),this.labelValue=t.label,this.textValue=t.value}set textContent(t){this.style.display=t?"block":"none",this.text.style.cursor="pointer",this.text.textContent=t||""}get textContent(){return this.text.textContent}connectedCallback(){this.style.display="none",this.style.width="fit-content",this.style.whiteSpace="nowrap",this.label||(this.create(),this.append(this.label),this.append(this.text),this.append(this.copyToolTip))}create(){this.copyToolTip=document.createElement("span"),this.copyToolTip.style.visibility="hidden",this.copyToolTip.style.color="green",this.copyToolTip.style.marginLeft=".3rem",this.copyToolTip.textContent="Copied!",this.label=document.createElement("strong"),this.label.textContent=this.labelValue,this.text=document.createElement("span"),this.textContent=this.textValue,this.text.addEventListener("click",this.handleClickCopy)}handleClickCopy(t){const e=this.parentElement.parentElement.parentElement;if(!e.isSelected&&!e.singleSelect)return;t.stopPropagation();const s=this.parentElement;s.showCopyToolTip(),navigator.clipboard.writeText(this.textContent),setTimeout((()=>s.hideCopyToolTip()),500)}showCopyToolTip(){this.copyToolTip.style.visibility="visible"}hideCopyToolTip(){this.copyToolTip.style.visibility="hidden"}}const n=t=>class extends t{constructor(){super(),this.pos1=0,this.pos2=0,this.pos3=0,this.pos4=0}get elmnt(){return this.draggableElement}setHeaderAsDraggable(){this.header.onmousedown=this.dragMouseDown.bind(this)}dragMouseDown(t){console.log("test"),t.preventDefault(),this.pos3=t.clientX,this.pos4=t.clientY,document.onmouseup=this.closeDragElement.bind(this),document.onmousemove=this.elementDrag.bind(this)}elementDrag(t){t.preventDefault(),this.pos1=this.pos3-t.clientX,this.pos2=this.pos4-t.clientY,this.pos3=t.clientX,this.pos4=t.clientY;const e=this.elmnt.offsetTop<0?0:this.elmnt.offsetTop;this.elmnt.style.top=e-this.pos2+"px",this.elmnt.style.left=this.elmnt.offsetLeft-this.pos1+"px"}closeDragElement(){document.onmouseup=null,document.onmousemove=null}};class a{}class o{constructor(t="{}"){this.jsonStr=t&&t.replace(/\r\n|\r|\n/g,"");const{actions:e=[]}=this.inputNode;this.payload=this.errorMessage,this.metadata=[],this.payloads=e.map(this.parseAction.bind(this)),this.errorMessage={Error:"Did not find Your value"}}get inputNode(){if(this.trimMessageText(),this._inputNode=this._inputNode||JSON.parse(this.jsonStr),Array.isArray(this._inputNode)){const t=this._inputNode;this._inputNode={actions:t}}return this._inputNode}get parsedString(){const t=this.payloads.length>1?this.payloads:this.payload;return JSON.stringify(t,null,2)}trimMessageText(){const t=!!this.jsonStr,e=this.jsonStr.length>9;t&&e&&"message: "==this.jsonStr.substring(0,9)&&(this.jsonStr=this.jsonStr.slice(9))}parseAction(t){return this.currentAction=t,this.getParamsFromInputNode(),this.metadata.push(this.currentMetadata),this.payload}getParamsFromInputNode(){var t;const{params:e,returnValue:s,result:i,callingDescriptor:n}=this.currentAction||{},{returnValue:o}=s||{},{namespace:r,classname:l,method:h,params:d}=e||{};this.currentMetadata=new a,this.payload=i||o||s||d||e||this.errorMessage,this.payload="string"==typeof this.payload?JSON.parse(this.payload||"{}"):this.payload;let{sClassName:p,sMethodName:c,drBundle:u,type:m,resultType:y}=this.payload;switch(l){case"ComponentController":case"FlexRuntime":"handleData"==h&&(this.payload.dataSourceMap&&(this.payload=JSON.parse(this.payload.dataSourceMap)),m=this.payload.type,c=this.payload.value.ipMethod,u=this.payload.value.bundleName,this.payload=JSON.parse((null===(t=this.payload.value)||void 0===t?void 0:t.inputMap)||"{}"));break;case"BusinessProcessDisplayController":case"NewportUtilities":switch(h){case"GenericInvoke2NoCont":this.payload.input&&(this.payload=JSON.parse(this.payload.input)),this.payload.Bundle&&this.payload.DRParams&&(u=this.payload.Bundle,this.payload=this.payload.DRParams),this.payload.bundleName&&this.payload.objectList&&(u=this.payload.bundleName,this.payload=this.payload.objectList);break;case"LWCPrep":this.payload.config&&(this.payload=JSON.parse(this.payload.config));break;case"isCommunity":case"getNewportUrl":case"getCommunityName":this.payload={}}break;default:this.payload.IPResult&&(this.payload=this.payload.IPResult,y="Integration Procedure"),this.payload.OBDRresp&&(this.payload=this.payload.OBDRresp,y="DataRaptor")}this.currentMetadata.className=l,this.currentMetadata.methodName=h,this.currentMetadata.namespace=r,this.currentMetadata.sClassName=p,this.currentMetadata.sMethodName=c,this.currentMetadata.drBundle=u,this.currentMetadata.type=m,this.currentMetadata.resultType=y,!this.hasOneOrMoreLabels()&&n&&(this.currentMetadata.callingDescriptor=n)}hasOneOrMoreLabels(){return Object.values(this.currentMetadata).some((t=>t))}}class r extends(n(HTMLElement)){constructor(t=""){super(),this.exists=!1,this.isParser=!!t,this.create().setStyle().setListeners().setOtherAttributes(),this.expandedHeight=this.clientHeight}get omniScriptElement(){return[...document.querySelectorAll("[data-data-rendering-service-uid]")].filter((t=>t.jsonDataStr))[0]}get omniScriptParentElement(){return this.omniScriptElement.parentElement}get prettyPrintDataJson(){var t;const e=this.networkPayloadString||!this.isParser&&(null===(t=this.omniScriptElement)||void 0===t?void 0:t.jsonDataStr)||"{}";return JSON.stringify(JSON.parse(e),null,2)}get parsed(){var t;return"Clear"==(null===(t=this.parseButton)||void 0===t?void 0:t.innerText)}create(){return this.displayElement=document.createElement("div"),this.header=document.createElement("div"),this.copyButton=document.createElement("a"),this.deleteButton=document.createElement("a"),this.minimizeButton=document.createElement("a"),this.buttonBlock=document.createElement("div"),this.repeatableData=new s([],this.selectPayloadPreview.bind(this)),this.textElement=document.createElement("textarea"),this.isParser&&(this.parseButton=document.createElement("button")),this.draggableElement=this.displayElement,this.append(this.displayElement),this}setStyle(){return this.header.setAttribute("style","width: 100%; height: 2rem; cursor: move; display: flex; justify-content: space-between; font-size: 1.2rem; aligh-items: center"),this.copyButton.setAttribute("style","width: fit-content; color: #35a4da;"),this.deleteButton.setAttribute("style","width: fit-content; color: #35a4da; margin-left: .2rem; padding: 0 .2rem"),this.minimizeButton.setAttribute("style","width: fit-content; color: #35a4da; margin-right: .2rem"),this.textElement.setAttribute("style","  min-width: 10rem; max-width: 100%; overflow: scroll; border-color: rgba(59, 59, 59, 0.3); border-radius: 0.25rem;"),this.isParser&&this.parseButton.setAttribute("style","width: fit-content; background-color: #35a4da; color: white; padding: .2rem .4rem; border-radius: .4rem; display: block; margin-left: auto; margin-top: .4rem;"),this.displayElement.setAttribute("style"," overflow: hidden; z-index: 1000; box-shadow: #000000 2px 2px 7px 2px; background: whitesmoke;padding: 0 .5em .5em; border-style: solid; border-width: 1px;border-color: #35a4da; border-radius: 0.5em; position: fixed; font-size: 1rem;"),this}setListeners(){return this.deleteButton.addEventListener("click",this.remove.bind(this)),this.copyButton.addEventListener("click",this.copyToClipboard.bind(this)),this.minimizeButton.addEventListener("click",this.toggleExpandWindow.bind(this)),this.isParser&&this.parseButton.addEventListener("click",this.parseData.bind(this)),this}setOtherAttributes(){return this.copyButton.innerHTML="Copy",this.deleteButton.innerHTML="X",this.minimizeButton.innerHTML="-",this.isParser&&(this.parseButton.innerHTML="Parse Payload"),new ResizeObserver(this.updateTextAreaWidth.bind(this)).observe(this.displayElement),!this.isParser&&this.textElement.setAttribute("disabled",""),this}addButtonsToHeader(){this.header.append(this.copyButton),this.buttonBlock.append(this.minimizeButton),this.buttonBlock.append(this.deleteButton),this.header.append(this.buttonBlock)}addHeaderToWindow(){this.displayElement.append(this.header)}addTextAreaToWindow(){this.displayElement.append(this.textElement),this.displayElement.append(this.repeatableData)}addParseButtonToWindow(){this.isParser&&this.displayElement.append(this.parseButton)}addToScreen(){this.addButtonsToHeader(),this.addHeaderToWindow(),this.addTextAreaToWindow(),this.addParseButtonToWindow(),this.removeButton(),this.setHeaderAsDraggable(),this.exists=!0,this.reInitialize(),this.isParser?(this.textElement.innerHTML="",document.body.prepend(this)):(this.updateWindowWithCurrentJsonData(),this.omniScriptParentElement.append(this),this.interval=setInterval((()=>this.updateWindowWithCurrentJsonData()),3e3))}updateWindowWithCurrentJsonData(){if(this.exists){this.textElement.innerHTML=this.prettyPrintDataJson;const t=!0;this.flashTextArea(t)}else this.stopUpdatingDataJson()}stopUpdatingDataJson(){clearInterval(this.interval)}parseData(){if(this.parsed)this.applyResponseToUI();else{const t=this.textElement.value,e=new o(t),{metadata:s,parsedString:i}=e;this.applyResponseToUI(i,s),this.textElement.value=this.prettyPrintDataJson}this.flashTextArea(),this.toggleParse()}applyResponseToUI(t,e=[]){this.networkPayloadString=t||"";const s=e.map(this.fieldLabelsAndValues);this.repeatableData.update(s),this.textElement.value=""}fieldLabelsAndValues(t){return Object.entries({"Calling Descriptor: ":t.callingDescriptor||"","Class : ":t.className||"","Method: ":t.methodName||"","Namespace: ":t.namespace||"","sClass: ":t.sClassName||"","Type: ":t.type||"","sMethod: ":t.sMethodName||"","DataRaptor: ":t.drBundle||"","Result Type: ":t.resultType||""}).map((([t,e])=>new i({label:t,value:e})))}toggleParse(){const t=this.parsed?"Parse Payload":"Clear";this.parsed?(this.textElement.removeAttribute("disabled"),this.textElement.style.minWidth="10rem",this.textElement.style.height="8rem",this.parsing=!1):(this.textElement.setAttribute("disabled",""),this.parsing=!0),this.parseButton.innerText=t}selectPayloadPreview(t,e){[...e.repeatedElementBox.children].filter(((t,e,s)=>!(e%2))).map(((e,s,i)=>{if(!(i.length<2))return t.currentTarget instanceof HTMLElement&&s.toString()==t.currentTarget.dataset.id?(this.textElement.value=JSON.stringify(JSON.parse(this.networkPayloadString)[s],null,2),void(e.isSelected=!0)):void(e.isSelected=!1)}))}updateTextAreaWidth(){if(this.expandedHeight||this.parsed||(this.displayElement.style.height="auto"),this.parsing){this.parsing=!1;let t=0;[...this.repeatableData.repeatedElementBox.children].map((e=>e.root&&[...e.root.children].map((e=>{e.showCopyToolTip(),e.clientWidth>t&&(t=e.clientWidth),e.hideCopyToolTip()})))),t?(this.textElement.style.width=`calc(${t}px + 1rem`,this.textElement.style.minWidth=`calc(${t}px + 1rem`,this.textElement.style.height=`calc(${t}px - 4rem`):(this.textElement.style.width="20rem",this.textElement.style.height="15rem")}}toggleExpandWindow(t){this.expandedHeight?(this.displayElement.style.height=`${this.expandedHeight}px`,this.displayElement.style.height="auto",this.expandedHeight=0):(this.expandedHeight=this.displayElement.clientHeight,this.displayElement.style.height="2rem")}flashTextArea(t){let e=200;t?(this.textElement.style.outline="solid #acd3e6 1px",e=500):this.textElement.style.backgroundColor="#acd3e6",setTimeout((()=>(this.textElement.style.backgroundColor="unset",this.textElement.style.outline="unset")),e)}copyToClipboard(){const t=this.textElement.innerHTML||this.textElement.value;navigator.clipboard.writeText(t),this.flashTextArea()}remove(){this.stopUpdatingDataJson(),this.addButton(),this.exists=!1,super.remove()}reInitialize(){this.parsed&&this.toggleParse(),this.repeatableData.update([]),this.displayElement.style.top=this.isParser?"27%":"12%",this.displayElement.style.left="75%",this.textElement.style.height="initial",this.textElement.style.width="initial",this.displayElement.style.height="auto",this.isParser&&(this.textElement.value="")}setRemoveButtonCallback(t){this.removeButton=t}setAddButtonCallback(t){this.addButton=t}}class l extends HTMLElement{constructor(t=""){super(),this.exists=!1,this.isParser=!!t,this.create().setHoverBehavior().setStyle().setText(),this.toggleOpacity=this.toggleOpacity.bind(this)}create(){return this.button=document.createElement("button"),this.append(this.button),this}setHoverBehavior(){return this.button.onmouseenter=this.toggleOpacity.bind(this),this.button.onmouseleave=this.toggleOpacity.bind(this),this}setStyle(){return this.button.setAttribute("style","position: fixed; right:0; top: 200px; z-index: 1000; font-weight: 1000;border: blue solid 1px;border-radius: 0.3rem 0 0 0.3rem;background: #35a4da; opacity: .6; padding-bottom: 4px;font-size: .75em;"),this.isParser&&(this.button.style.top="250px"),this}setText(){const t=this.isParser?"&#9729;":"{}";return this.button.innerHTML=t,this}setClickListener(){return this.button.addEventListener("click",this.addWindow),this}toggleOpacity(t){"true"!==this.button.dataset.bright&&t?this.setAsBright():this.setAsDull()}setAsDull(){const t=this.button;t.style.opacity=".6",t.dataset.bright="false",this.isParser?t.style.fontSize=".83em":t.innerHTML="{}",t.style.maxHeight="2em",t.style.maxWidth="2em"}setAsBright(){const t=this.button;t.style.opacity="1",t.dataset.bright="true",this.isParser?t.style.fontSize="1.3em":t.innerHTML="{...}",t.style.maxHeight="3em",t.style.maxWidth="3em"}setAddWindowCallback(t){this.addWindow=t.bind(this),this.setClickListener()}addToScreen(){return this.exists=!0,this.reInitialize(),document.body.append(this),!0}reInitialize(){"1"===this.button.style.opacity&&this.toggleOpacity()}remove(){this.exists=!1,this.toggleOpacity(),super.remove()}}class h{constructor(){this.watchForBrowserHistoryStateChange()}get window(){return this._window||(this._window=new r),this._window}get button(){return this._button||(this._button=new l),this._button}get parser_window(){return this._parser_window||(this._parser_window=new r("parser_")),this._parser_window}get parser_button(){return this._parser_button||(this._parser_button=new l("parser_")),this._parser_button}watchForBrowserHistoryStateChange(){var t;history.pushState=(t=history.pushState,function(){var e=t.apply(this,arguments);return window.dispatchEvent(new Event("pushstate")),window.dispatchEvent(new Event("locationchange")),e}),history.replaceState=(t=>function(){var e=t.apply(this,arguments);return window.dispatchEvent(new Event("replacestate")),window.dispatchEvent(new Event("locationchange")),e})(history.replaceState),window.addEventListener("popstate",(()=>{window.dispatchEvent(new Event("locationchange"))})),window.addEventListener("locationchange",this.newDataJsonWindow.bind(this))}delayedStart(t,e=0){const s=(new Date).getTime(),i=!this.addLauncherButtonsIfApplicable()&&e<15,n=s-this.lastLocationChange<5e3;(i||n)&&(e++,this.pendingDelay=setTimeout((()=>this.delayedStart(t,e)),t))}newDataJsonWindow(){const t=(new Date).getTime();this.lastLocationChange=t,this.window.exists=!1,this.resetPendingDelay(),this.delayedStart(2e3)}resetPendingDelay(){clearTimeout(this.pendingDelay),this.pendingDelay=null}allowWindowAndButtonToAddAndRemoveEachOther(t=""){const{button:e,window:s}=this.getWindowAndButton(t);e.setAddWindowCallback(s.addToScreen.bind(s)),s.setAddButtonCallback(e.addToScreen.bind(e)),s.setRemoveButtonCallback(e.remove.bind(e))}removeButton(){this.button.exists&&this.button.remove()}addLauncherButtonsIfApplicable(){if(!document.querySelector("[data-aura-rendered-by],[data-aura-class]"))return!1;this.addButton("parser_");return 1!==[...document.querySelectorAll("[data-data-rendering-service-uid]")].filter((t=>t.jsonDataStr)).length?(this.removeButton(),!1):(this.addButton(),!0)}addButton(t=""){const{button:e,window:s}=this.getWindowAndButton(t);e.exists||s.exists||(e.addToScreen(),this.allowWindowAndButtonToAddAndRemoveEachOther(t))}getWindowAndButton(t=""){let e,s;return t?(e=this.parser_window,s=this.parser_button):(e=this.window,s=this.button),{button:s,window:e}}}customElements.define("c-repeat",s),customElements.define("c-number-of-results",e),customElements.define("c-json-window",r),customElements.define("c-display-field",i),customElements.define("c-clickable-block",t),customElements.define("c-window-launcher-button",l),(new h).delayedStart(5e3)})();