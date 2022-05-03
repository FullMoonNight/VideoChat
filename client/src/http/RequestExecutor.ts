import Request, {MethodType} from "../http/RequestInterface";
import axios, {AxiosResponse, AxiosInstance, AxiosError} from "axios";
import AuthController from "../controllers/AuthController";


interface ErrorType {
    message: string
}

class RequestExecutor<T> {
    private readonly method: MethodType
    private command: Request
    private static axios: AxiosInstance

    constructor(request: Request) {
        this.method = request.method
        this.command = request

        if (!RequestExecutor.axios) RequestExecutor.axios = this.axiosInstanceCreate()
    }

    async execute(): Promise<AxiosResponse<T> & AxiosError<ErrorType>> {
        if (this.method === 'post') {
            let data = this.command.attachment ? this.command.getAttachment() : this.command.getParameters()
            return RequestExecutor.axios.post(this.command.getRoute(), data, this.command.requestConfiguration).catch(reason => reason)
        } else {
            return RequestExecutor.axios.get(this.command.getRoute(), this.command.requestConfiguration).catch(reason => reason)
        }
    }

    private axiosInstanceCreate(): AxiosInstance {
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_DESTINATION_HOST + '/api',
            withCredentials: true,
        })

        axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken');
            if (config.headers && token) config.headers.Authorization = `Bearer ${token}`
            return config
        })

        axiosInstance.interceptors.response.use((config) => {
                return config
            }, async (error) => {
                const originRequest = error.config
                if (error.response.status === 401 && error.config && !originRequest._isRetry) {
                    originRequest._isRetry = true
                    try {
                        const response = await axios.post<{ accessToken: string }>(`${process.env.REACT_APP_DESTINATION_HOST}/api/authenticate/refresh`, null, {withCredentials: true})
                        localStorage.setItem('accessToken', response.data.accessToken)
                        return axiosInstance.request(originRequest)
                    } catch (e) {
                        console.log('Не авторизован')
                        await AuthController.logout(true)
                    }
                }
                throw error
            }
        )

        return axiosInstance
    }
}

export default RequestExecutor