import Request, {MethodType, Params} from "../http/RequestInterface";
import RequestExecutor from "../http/RequestExecutor";


export default class BaseRequest<T> implements Request {
    route: string = '';
    method: MethodType = 'get';
    parameters?: Params;
    queryParams: boolean = false;
    haveBinaryData: boolean = false;
    binaryData?: ArrayBuffer;

    async execute() {
        const requestExecutor = new RequestExecutor<T>(this)
        return await requestExecutor.execute()
    }

    getParameters() {
        if (this.parameters) return this.parameters
        return {}
    };

    getBinaryData() {
        if (this.haveBinaryData) {
            return this.binaryData
        }
    }

    getRoute() {
        if (this.parameters && Object.keys(this.parameters).length && this.queryParams) {
            let quarryStr = ''
            for (const [key, value] of Object.entries(this.parameters)) {
                if (value.toString().trim())
                    quarryStr += `${key}=${value}&`
            }
            return `${this.route}?${quarryStr.substr(0, quarryStr.length - 1)}`
        }
        return this.route
    }
}