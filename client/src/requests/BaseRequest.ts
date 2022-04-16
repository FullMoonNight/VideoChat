import Request, {MethodType, Params} from "../http/RequestInterface";
import RequestExecutor from "../http/RequestExecutor";


export default class BaseRequest<T> implements Request {
    route: string = '';
    method: MethodType = 'get';
    parameters?: Params;
    attachment?: Blob | Blob[]

    async execute() {
        const requestExecutor = new RequestExecutor<T>(this)
        return await requestExecutor.execute()
    }

    getParameters() {
        if (this.parameters) return this.parameters
        return {}
    };

    getAttachment() {
        if (this.attachment) {
            const formData = new FormData()
            if (this.attachment instanceof Array) {
                this.attachment.forEach(attachment => {
                    formData.append('files', attachment)
                })
            } else {
                formData.append('files', this.attachment)
            }
            if (this.parameters && Object.keys(this.parameters).length) {
                formData.append('body', JSON.stringify(this.parameters))
            }
            return formData
        }
    }

    getRoute() {
        if (this.parameters && Object.keys(this.parameters).length && this.method === "get") {
            let queryStr = ''
            for (const [key, value] of Object.entries(this.parameters)) {
                if (value && value.toString().trim())
                    queryStr += `${key}=${value}&`
            }
            return `${this.route}?${queryStr.substr(0, queryStr.length - 1)}`
        }
        return this.route
    }
}