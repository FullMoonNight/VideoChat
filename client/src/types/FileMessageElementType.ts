export interface FileMessageElementType {
    messageId: string,
    type: 'file',
    senderUserId: string,
    sendDate: string,
    fileName: string,
    size: number,
}