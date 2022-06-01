class SalesforceNetworkPayload {
    constructor(jsonStr) {
        this.jsonStr = jsonStr && jsonStr.replace(/\r\n|\r|\n/g, '');
        const { actions = [] } = this.inputNode;
        this.payload = this.errorMessage;
        this.metadata = []
        this.payloads = actions.map(this.parseAction.bind(this));
        this.errorMessage = ({ Error: "Did not find Your value"})
    }
    //computed properties
    get inputNode() {
        this.trimMessageText()
        this._inputNode = this._inputNode || this.parse(this.jsonStr);
        if (Array.isArray(this._inputNode)) {
            const actions = this._inputNode
            this._inputNode = { actions };
        }
        return this._inputNode;
    }
    get parsedString() {
        const returnValue = this.payloads.length > 1 ? this.payloads : this.payload
        return JSON.stringify(returnValue, null, 2);
    }
    //methods
    parse(val){
        try{
           val =  JSON.parse(val);
        } catch(e){
        }
        return val || '';
    }
    trimMessageText(){
        if(this.jsonStr && this.jsonStr.length > 9 && this.jsonStr.substring(0,9) == 'message: ') 
            this.jsonStr = this.jsonStr.slice(9)
    }
    parseAction(currentAction) {
        this.currentAction = currentAction;
        this.getParamsFromInputNode();
        // this.getSecondaryParamsFromInputNode();
        this.metadata.push(this.currentMetadata);
        return this.payload;
    }
    getParamsFromInputNode() {
        // Initial params from parsing input node 
        const { params, returnValue, result, callingDescriptor } = this.currentAction || {}
        const { returnValue:returnValueNested } = returnValue || {};
        const { namespace, classname, method, params:paramsNested } = params || {};
     
        this.currentMetadata = {};
        this.payload = result || returnValueNested || returnValue || paramsNested || params || this.errorMessage;
        this.payload = typeof this.payload === 'string' ? JSON.parse(this.payload || '{}') : this.payload;

        // Secondary params
        let { sClassName, sMethodName, drBundle, type, resultType } = this.payload;

        //attempt to target child payload node on class/method
        switch(classname){
            case 'ComponentController':
            case 'FlexRuntime':
                if(method == 'handleData'){
                    if(this.payload.dataSourceMap)
                        this.payload = JSON.parse(this.payload.dataSourceMap);
                        type = this.payload.type;
                        sMethodName = this.payload.value.ipMethod;
                        drBundle = this.payload.value.bundleName;
                        this.payload = JSON.parse(this.payload.value?.inputMap || '{}');
                }
            break;
            case 'BusinessProcessDisplayController':
            case 'NewportUtilities':
                switch(method){
                    case 'GenericInvoke2NoCont':
                        if(this.payload.input)
                            this.payload = JSON.parse(this.payload.input);
                        if(this.payload.Bundle && this.payload.DRParams){
                            drBundle = this.payload.Bundle;
                            this.payload = this.payload.DRParams;
                        }
                        if(this.payload.bundleName && this.payload.objectList){
                            drBundle = this.payload.bundleName;
                            this.payload = this.payload.objectList;
                        }
                        break;
                    case 'LWCPrep':
                        if(this.payload.config)
                        this.payload = JSON.parse(this.payload.config);
                        break;
                    case 'isCommunity':
                    case 'getNewportUrl':
                    case 'getCommunityName':
                        this.payload = {}
                    }
                    break;
            default:
                if(this.payload.IPResult){
                    this.payload = this.payload.IPResult;
                    resultType = 'Integration Procedure';
                }
                if(this.payload.OBDRresp){
                    this.payload = this.payload.OBDRresp;
                    resultType = 'DataRaptor';
                }
        }

        //assign labels for parsed payload
        this.currentMetadata.className = classname;
        this.currentMetadata.methodName = method;
        this.currentMetadata.namespace = namespace;
        this.currentMetadata.sClassName = sClassName;
        this.currentMetadata.sMethodName = sMethodName;
        this.currentMetadata.drBundle = drBundle;
        this.currentMetadata.type = type;
        this.currentMetadata.resultType = resultType;
        if(!this.hasOneOrMoreLabels() && callingDescriptor){
            this.currentMetadata.callingDescriptor = callingDescriptor;
        }

    }
    hasOneOrMoreLabels(){
        return Object.values(this.currentMetadata).some(v => v)
    }

}
