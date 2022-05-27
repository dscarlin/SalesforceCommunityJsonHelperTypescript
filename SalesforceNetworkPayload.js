class SalesforceNetworkPayload {
    constructor(jsonStr) {
        this.jsonStr = jsonStr && jsonStr.replace(/\r\n|\r|\n/g, '');
        const { actions = [] } = this.inputNode;
        this.payload = this.errorMessage;
        this.metadata = []
        this.payloads = actions.map(this.parseAction.bind(this));
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
    get errorMessage() {
        return ({ Error: "Did not find Your value"});
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
        const { params, returnValue, result } = this.currentAction || {}
        const { returnValue:returnValueNested } = returnValue || {};
        const { namespace, classname, method, params:paramsNested } = params || {};
        // if(!(classname && method)){
            //     return this.payload = params;
            // }typeof this.payload === 'string' ? JSON.parse(this.payload || '{}') : this.payload
        this.currentMetadata = {};
        this.payload = result || returnValueNested || returnValue || paramsNested || params || this.errorMessage;
        this.payload = typeof this.payload === 'string' ? JSON.parse(this.payload || '{}') : this.payload;

        let { sClassName, sMethodName, drBundle, type } = this.payload;

        switch(classname){
            case 'ComponentController':
            case 'FlexRuntime':
                if(method == 'handleData'){
                    if(this.payload.dataSourceMap)
                        this.payload = JSON.parse(this.payload.dataSourceMap)
                        type = this.payload.type;
                        sMethodName = this.payload.value.ipMethod;
                        drBundle = this.payload.value.bundleName;
                        this.payload = JSON.parse(this.payload.value?.inputMap || '{}')
                }
            break;
            case 'BusinessProcessDisplayController':
            case 'NewportUtilities':
                switch(method){
                    case 'GenericInvoke2NoCont':
                        if(this.payload.input)
                        this.payload = JSON.parse(this.payload.input)
                        if(this.payload.Bundle && this.payload.DRParams){
                            drBundle = this.payload.Bundle
                            this.payload = this.payload.DRParams
                        }
                        break;
                    case 'LWCPrep':
                        if(this.payload.config)
                        this.payload = JSON.parse(this.payload.config)
                        break;
                    case 'isCommunity':
                    case 'getNewportUrl':
                    case 'getCommunityName':
                    
                        this.payload = {}
                        break;
                }
              
                
            break;
        }

        this.currentMetadata.className = classname;
        this.currentMetadata.methodName = method;
        this.currentMetadata.namespace = namespace;
        this.currentMetadata.sClassName = sClassName;
        this.currentMetadata.sMethodName = sMethodName;
        this.currentMetadata.drBundle = drBundle;
        this.currentMetadata.type = type

       
        
       
        // const paramsJSON = this.currentAction?.params?.params?.parametersJSON;
        // const dataSourceMap = this.currentAction?.params?.params?.dataSourceMap;
        // const drParams = this.currentAction?.params?.params?.input?.DRParams;
        // const input = this.currentAction?.params?.params?.input;
        // let returnValue = this.currentAction?.returnValue?.returnValue;
        // const config = this.currentAction?.params?.params?.config;
        // const result = this.currentAction?.result
        // let params;
        // !returnValue && (returnValue = this.currentAction?.returnValue);
        // !paramsJSON && !dataSourceMap && !input && !config && !drParams && (params = this.currentAction?.params)

        // this.payload =
        //     paramsJSON || dataSourceMap || drParams ||
        //     input || returnValue || config ||
        //     result || params || this.errorMessage;

        // this.parsed = typeof this.payload === 'string' ? JSON.parse(this.payload || '{}') : this.payload;
    }
    getSecondaryParamsFromInputNode() {
        //Secondary set of params from parsing initial param node
        const inputMap = this.parsed?.value?.inputMap && typeof this.parsed.value.inputMap === 'string' ? JSON.parse(this.parsed.value.inputMap) : null;
        const drParams = this.parsed?.DRParams && typeof this.parsed.DRParams === 'object' ? this.parsed.DRParams : null;
        const ipResult = this.parsed?.IPResult ? typeof this.parsed.IPResult === 'object' ? this.parsed.IPResult : this.parsed.IPResult : null;

        this.payload = inputMap || drParams || ipResult || this.parsed;
        this.parsed = '';
    }

}
