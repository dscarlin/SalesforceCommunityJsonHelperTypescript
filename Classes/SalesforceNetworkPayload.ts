import MetaData from './MetaData';
import { ErrorMessage, UntypedPayload } from '../Types'

export default class SalesforceNetworkPayload {
    constructor(jsonStr: string = '{}', showOptions: boolean) {
        this.showOptions = showOptions;
        this.jsonStr = jsonStr && jsonStr.replace(/\r\n|\r|\n/g, '');
        const { actions = [] } = this.inputNode;
        this.errorMessage = ({ Error: "Did not find Your value"})
        this.payload = this.errorMessage;
        this.metadata = [];
        this.payloads = actions.map(this.parseAction.bind(this));
    }

    public metadata: MetaData[];
    private showOptions: boolean;
    private payload: UntypedPayload;
    private options: UntypedPayload;
    private jsonStr: string;
    private payloads: string[];
    private errorMessage: ErrorMessage;
    private _inputNode: UntypedPayload;
    private currentAction: UntypedPayload;
    private currentMetadata!: MetaData;


    //computed properties
    public get parsedString(): string {
        const returnValue = this.payloads.length > 1 ? this.payloads : this.payload
        return JSON.stringify(returnValue, null, 2);
    }
    private get inputNode(): UntypedPayload {
        this.trimMessageText()
        this._inputNode = this._inputNode || JSON.parse(this.jsonStr || '{}');
        if (Array.isArray(this._inputNode)) {
            const actions = this._inputNode
            this._inputNode = { actions };
        }
        return this._inputNode;
    }
    //methods
    private trimMessageText(): void{
        const jsonStr: boolean = !!this.jsonStr;
        const longerThanNineChars: boolean = this.jsonStr.length > 9;
        const stringBeginsWithMessageColon: boolean = jsonStr && longerThanNineChars &&  this.jsonStr.substring(0,9) == 'message: '

        if(stringBeginsWithMessageColon) 
            this.jsonStr = this.jsonStr.slice(9);
    }
    private parseAction(currentAction: UntypedPayload): UntypedPayload {
        this.options = {}
        this.currentAction = currentAction;
        this.getParamsFromInputNode();
        this.metadata.push(this.currentMetadata);
        if(this.showOptions && this.options){
            this.payload = ({
                payload: this.payload, 
                options: this.options || {} 
            })
        }
        return this.payload;
    }
    private getParamsFromInputNode(): void {
        // Initial params from parsing input node 
        const { params, returnValue, result, callingDescriptor } = this.currentAction || {}
        const { returnValue:returnValueNested } = returnValue || {};
        const { namespace, classname, method, params:paramsNested } = params || {};
     
        this.currentMetadata = new MetaData();
        this.payload = result || returnValueNested || returnValue || paramsNested || params || this.errorMessage;
        this.payload = typeof this.payload === 'string' ? JSON.parse(this.payload || '{}') : this.payload;

        // Secondary params
        let { sClassName, sMethodName, drBundle, type, resultType } = this.payload;

        //attempt to target child payload node on class/method
        switch(classname){
            case 'ComponentController':
            case 'FlexRuntime':
                if(method == 'handleData'){
                    if(this.payload.dataSourceMap){
                        this.payload = JSON.parse(this.payload.dataSourceMap);
                        type = this.payload.type;
                        sMethodName = this.payload.value.ipMethod;
                        drBundle = this.payload.value.bundleName;
                        this.options = JSON.parse(this.payload.value?.optionsMap || '{}')
                        this.payload = JSON.parse(this.payload.value?.inputMap || '{}');
                    }
                }
            break;
            case 'BusinessProcessDisplayController':
            case 'NewportUtilities':
                switch(method){
                    case 'GenericInvoke2NoCont':
                        if(this.payload.input){
                            this.options = JSON.parse(this.payload.options || '{}');
                            this.payload = JSON.parse(this.payload.input);
                        }
                        if(this.payload.Bundle && this.payload.DRParams){
                            drBundle = this.payload.Bundle;
                            this.options = this.payload.options || {};
                            this.payload = this.payload.DRParams;
                        }
                        if(this.payload.bundleName && this.payload.objectList){
                            drBundle = this.payload.bundleName;
                            this.payload = this.payload.objectList;
                            //maybe options node => find this payload type again
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
    private hasOneOrMoreLabels(): boolean{
        return Object.values(this.currentMetadata).some(v => v)
    }

}
