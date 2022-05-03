import {Params} from "../../http/RequestInterface";
import BaseRequest from "../BaseRequest";
import {AxiosRequestConfig} from "axios";

export interface DownloadFileParams extends Params {
    chatId: string,
    messageId: string,
    chatType: 'common' | 'room'
}

export default class DownloadFileRequest extends BaseRequest<any> {
    route: string = '/chats/download'
    parameters: DownloadFileParams

    requestConfiguration: AxiosRequestConfig = {responseType: 'blob'}

    constructor(params: DownloadFileParams) {
        super();
        this.parameters = params
    }
}