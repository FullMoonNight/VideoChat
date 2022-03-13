export type MethodType = "get" | "post"
export type Params = { [key: string]: number | string | boolean | null | undefined }

export default interface Request {
    method: MethodType,
    route: string,
    parameters?: Params,

    attachment?: Blob | Blob[],

    getParameters: () => Params | {}
    getAttachment: () => FormData | undefined
    getRoute: () => string

}