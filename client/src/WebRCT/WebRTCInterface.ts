class WebRTCInterface {
    videoElements: { [key: string]: HTMLVideoElement | null } = {
        'local': null
    }
    peerConnections: { [key: string]: RTCPeerConnection } = {}
    localMediaStream: MediaStream | null = null
}

export default new WebRTCInterface()