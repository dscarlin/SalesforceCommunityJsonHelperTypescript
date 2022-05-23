class SalesforceNetworkResponse {
    constructor(jsonStr) {
        this.jsonStr = jsonStr && jsonStr.replace(/\r\n|\r|\n/g, '');
        const { actions = [] } = this.inputNode;
        this.payload = this.errorMessage;
        this.payloads = actions.map(this.parseAction.bind(this));
    }
    //computed properties

    get inputNode() {
        this._inputNode = this._inputNode || JSON.parse(typeof this.jsonStr === 'string' && this.jsonStr || '""');
        if (Array.isArray(this._inputNode)) {
            const actions = this._inputNode
            this._inputNode = { actions };
        }
        return this._inputNode;
    }
    get errorMessage() {
        return '{ \"Error\": \"Did not find Your value\"}';
    }
    get dataPayload() {
        const returnValue = this.payloads.length > 1 ? this.payloads : this.payload
        return JSON.stringify(returnValue, null, 2);
    }
    parseAction(currentAction) {
        this.currentAction = currentAction;
        this.getInitialParamsFromInputNode();
        this.getSecondaryParamsFromInputNode();
        return this.payload;
    }
    //methods
    getInitialParamsFromInputNode() {
        //Initial params from parsing input node 
        const paramsJSON = this.currentAction?.params?.params?.parametersJSON;
        const dataSourceMap = this.currentAction?.params?.params?.dataSourceMap;
        const drParams = this.currentAction?.params?.params?.input?.DRParams;
        const input = this.currentAction?.params?.params?.input;
        let returnValue = this.currentAction?.returnValue?.returnValue;
        const config = this.currentAction?.params?.params?.config;
        const result = this.currentAction?.result
        let params;
        !returnValue && (returnValue = this.currentAction?.returnValue);
        !paramsJSON && !dataSourceMap && !input && !config && !drParams && (params = this.currentAction?.params)

        this.payload =
            paramsJSON || dataSourceMap || drParams ||
            input || returnValue || config ||
            result || params || this.errorMessage;

        this.parsed = typeof this.payload === 'string' ? JSON.parse(this.payload || '{}') : this.payload;
    }
    getSecondaryParamsFromInputNode() {
        //Secondary set of params from parsing initial param node
        const inputMap = this.parsed?.value?.inputMap && typeof this.parsed.value.inputMap === 'string' ? this.parsed.value.inputMap : null;
        const drParams = this.parsed?.DRParams && typeof this.parsed.DRParams === 'object' ? JSON.stringify(this.parsed.DRParams) : null;
        const ipResult = this.parsed?.IPResult ? typeof this.parsed.IPResult === 'object' ? JSON.stringify(this.parsed.IPResult) : this.parsed.IPResult : null;

        this.parsed = '';
        this.payload = inputMap || drParams || ipResult || this.payload;
    }

}
