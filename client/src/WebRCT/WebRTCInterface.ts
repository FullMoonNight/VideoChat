export default class WebRTCInterface {
    videoElements: { [key: string]: HTMLVideoElement | null } = {
        'local': null
    }
    peerConnections: { [key: string]: RTCPeerConnection } = {}
    localMediaStream: MediaStream | null = null

    // private static thisInstance: any = null
    //
    // constructor() {
    //     if (WebRTCInterface.thisInstance) return WebRTCInterface.thisInstance
    //
    //     WebRTCInterface.thisInstance = this
    //     return this
    // }
}