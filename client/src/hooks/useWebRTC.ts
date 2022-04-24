import {useCallback, useContext, useEffect} from "react";
// @ts-ignore
import freeice from "freeice";
import {useCallbackState} from "./useCallbackStateHook";
import WebRTCInterface from "../WebRCT/WebRTCInterface";
import {socketInterface} from "../socket/SocketInterface";
import webRTCInterface from "../WebRCT/WebRTCInterface";
import {MainContext} from "../index";

export function useWebRTC(roomId: string) {
    const [clients, setClients] = useCallbackState<string[]>([]);
    const {user} = useContext(MainContext)

    const addNewClient = useCallback((newClient, cb) => {
        if (!clients.includes(newClient)) {
            setClients((list: string[]) => [...list, newClient], cb)
        }
    }, [clients, setClients])


    useEffect(() => {
        async function handlePeer({peerId, createOffer}: { peerId: string, createOffer: boolean }) {
            if (peerId in WebRTCInterface.peerConnections) {
                return console.log(`Already connected to peer ${peerId}`)
            }
            WebRTCInterface.peerConnections[peerId] = new RTCPeerConnection({
                iceServers: freeice()
            })

            WebRTCInterface.peerConnections[peerId].onicecandidate = event => {
                if (event.candidate) {
                    socketInterface.emit('RELAY_ICE', {
                        peerId,
                        iceCandidate: event.candidate
                    })
                }
            }

            WebRTCInterface.peerConnections[peerId].ontrack = ({streams: [remoteStream]}) => {
                addNewClient(peerId, () => {
                    if (WebRTCInterface.videoElements[peerId]) {
                        // @ts-ignore
                        WebRTCInterface.videoElements[peerId].srcObject = remoteStream
                    }
                })
            }

            if (WebRTCInterface.localMediaStream) {
                WebRTCInterface.localMediaStream.getTracks().forEach(track => {
                    WebRTCInterface.localMediaStream && WebRTCInterface.peerConnections[peerId].addTrack(track, WebRTCInterface.localMediaStream)

                })
            }

            if (createOffer) {
                const offer = await WebRTCInterface.peerConnections[peerId].createOffer()
                await WebRTCInterface.peerConnections[peerId].setLocalDescription(offer)
                socketInterface.emit('RELAY_SDP', {
                    peerId,
                    sessionDescription: offer
                })
            }
        }

        socketInterface.on('ADD_PEER', handlePeer)
    }, [])

    useEffect(() => {
        type RelayParams = { peerId: string, sessionDescription: RTCSessionDescriptionInit }
        socketInterface.on('SESSION_DESCRIPTION', async ({peerId, sessionDescription: remoteDescription}: RelayParams) => {
            await WebRTCInterface.peerConnections[peerId].setRemoteDescription(
                new RTCSessionDescription(remoteDescription)
            )

            if (remoteDescription.type === 'offer') {
                const answer = await WebRTCInterface.peerConnections[peerId].createAnswer()
                await WebRTCInterface.peerConnections[peerId].setLocalDescription(answer)
                socketInterface.emit('RELAY_SDP', {
                    peerId,
                    sessionDescription: answer
                })
            }
        })
    }, [])

    useEffect(() => {
        socketInterface.on('REMOVE_PEER', ({peerId}) => {
            if (WebRTCInterface.peerConnections[peerId]) {
                WebRTCInterface.peerConnections[peerId].close()
            }

            delete WebRTCInterface.peerConnections[peerId]
            delete webRTCInterface.videoElements[peerId]

            console.log(webRTCInterface.videoElements)

            setClients((list: string[]) => list.filter(client => client !== peerId), () => {
            })

            console.log(clients)
        })

        return () => {
            socketInterface.off('REMOVE_PEER')
        }
    }, [])

    useEffect(() => {
        socketInterface.on('ICE_CANDIDATE', ({peerId, iceCandidate}) => {
            WebRTCInterface.peerConnections[peerId].addIceCandidate(
                new RTCIceCandidate(iceCandidate)
            )
        })

        return () => {
            socketInterface.off('ICE_CANDIDATE')
        }
    }, [])

    useEffect(() => {
        async function startCapture() {
            webRTCInterface.localMediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true
            })
            addNewClient('local', () => {
                const localVideoElement = webRTCInterface.videoElements['local']

                if (localVideoElement) {
                    localVideoElement.volume = 0;
                    localVideoElement.srcObject = webRTCInterface.localMediaStream
                }
            })
        }

        startCapture()
            .then(() => socketInterface.emit('JOIN_ROOM', {roomId: roomId, userId: user.user.userId}))
            .catch(e => console.log('Error getting userMedia:', e))

        return () => {
            webRTCInterface.localMediaStream?.getTracks().forEach(track => track.stop())
            socketInterface.emit('LEAVE', {})
        }
    }, [roomId])

    const provideMediaRef = useCallback((id, node) => {
        webRTCInterface.videoElements[id] = node

    }, [])

    return {clients, provideMediaRef}

}