import {socketInterface} from "../socket/SocketInterface";
import {log} from "util";

export default class WebRTCInterface {
    videoElements: { [key: string]: HTMLVideoElement | undefined } = {
        'local': undefined
    }
    peerConnections: { [key: string]: RTCPeerConnection } = {}
    localMediaStream: MediaStream | null = null

    muteAll(mute: boolean) {
        for (const videoElementsKey in this.videoElements) {
            if (videoElementsKey === 'local') continue
            const currVideoElement = this.videoElements[videoElementsKey]
            if (currVideoElement) {
                currVideoElement.volume = mute ? 0 : 1
            }
        }
    }

    async addVideoOnAllPeers() {
        if (!this.localMediaStream) return

        const media = await navigator.mediaDevices.getUserMedia({video: true})
        const videoTrack = media.getVideoTracks()[0]
        this.localMediaStream.addTrack(videoTrack)
        this.videoElements['local'] && (this.videoElements['local'].srcObject = this.localMediaStream)

        for (const peerConnectionsKey in this.peerConnections) {
            this.peerConnections[peerConnectionsKey].addTrack(videoTrack, this.localMediaStream)

            const offer = await this.peerConnections[peerConnectionsKey].createOffer()
            await this.peerConnections[peerConnectionsKey].setLocalDescription(offer)
            socketInterface.emit('RELAY_SDP', {
                peerId: peerConnectionsKey,
                sessionDescription: offer
            })
        }
    }

    async removeVideoFormAllPeers() {
        if (!this.localMediaStream) return

        this.localMediaStream.getVideoTracks().forEach(track => {
            this.localMediaStream?.removeTrack(track)
        })
        this.videoElements['local'] && (this.videoElements['local'].srcObject = this.localMediaStream)

        for (const peerConnectionsKey in this.peerConnections) {
            this.peerConnections[peerConnectionsKey].getSenders().forEach(sender => {
                this.peerConnections[peerConnectionsKey].removeTrack(sender)
            })
            this.localMediaStream.getTracks().forEach(track => {
                this.localMediaStream && this.peerConnections[peerConnectionsKey].addTrack(track, this.localMediaStream)
            })

            const offer = await this.peerConnections[peerConnectionsKey].createOffer()
            await this.peerConnections[peerConnectionsKey].setLocalDescription(offer)
            socketInterface.emit('RELAY_SDP', {
                peerId: peerConnectionsKey,
                sessionDescription: offer
            })
        }
    }
}