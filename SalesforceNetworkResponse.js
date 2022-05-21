class SalesforceNetworkResponse{
    constructor(jsonStr){
      this.jsonStr = jsonStr && jsonStr.replace(/\r\n|\r|\n/g,'');
      const { actions=[] } = this.inputNode;
      this.payload = this.errorMessage;
      this.payloads = actions.map(this.parseAction.bind(this));
    }
    //computed properties
    
    get inputNode(){
        this._inputNode = this._inputNode || JSON.parse(typeof this.jsonStr === 'string' && this.jsonStr || '""');
        return this._inputNode;
    }
    get errorMessage(){
        return '{ \"Error\": \"Did not find Your value\"}';
    }
    get dataPayload(){
      return this.payloads.length > 1 ? JSON.stringify(this.payloads, null, 2) : this.payload;
    }
    parseAction(currentAction){
        this.currentAction = currentAction;
        this.getInitialParamsFromInputNode();
        this.getPayloadFromEvaluatedInitialParams();
        this.getSecondaryParamsFromInputNode();
        this.getPayloadFromEvaluatedSecondaryParams();
        return this.payload;
    }
    //methods
    getInitialParamsFromInputNode(){
        //Initial params from parsing input node 
      this.paramsJSON = this.currentAction?.params?.params?.parametersJSON;
      this.dataSourceMap = this.currentAction?.params?.params?.dataSourceMap;
      this.input = this.currentAction?.params?.params?.input;
      this.returnValue = this.currentAction?.returnValue?.returnValue;
      this.config = this.currentAction?.params?.params?.config;
    }
    getSecondaryParamsFromInputNode(){
        //Secondary set of params from parsing initial param node
      this.inputMap = this.parsed?.value?.inputMap && typeof this.parsed.value.inputMap === 'string' ? this.parsed.value.inputMap : null;
      this.drParams = this.parsed?.DRParams && typeof this.parsed.DRParams === 'object' ? JSON.stringify(this.parsed.DRParams) : null;
      this.ipResult = this.parsed?.IPResult ? typeof this.parsed.IPResult === 'object' ? JSON.stringify(this.parsed.IPResult) : this.parsed.IPResult : null;
      this.parsed = '';
    }
    getPayloadFromEvaluatedSecondaryParams(){
        switch(true){
            case !!this.inputMap:                                    
                this.payload = this.inputMap;                             //Integration Procedure or Remote Action
                break;
            case !!this.drParams:                                       
                this.payload = this.drParams;                             //DataRaptor
                break;
            case !!this.ipResult:                                     
                this.payload = this.ipResult;                             //Integration Procedure Response  
                break;
            default:
                break;
          }
    }
    getPayloadFromEvaluatedInitialParams(){
        switch(true){
            case !!this.paramsJSON:                              //getDataHandler
                this.payload = this.paramsJSON;
                break;
            case !!this.dataSourceMap:                           //? 
                this.payload = this.dataSourceMap;
                break;
            case !!this.input:                                   //Integration Procedure
                this.payload = this.input;
                break;
            case !!this.returnValue:                             //response
                this.payload = this.returnValue;
                break;
            default:
                this.payload = this.errorMessage;
          }
          this.parsed = JSON.parse(this.payload || '{}');

    }
    
  }
  