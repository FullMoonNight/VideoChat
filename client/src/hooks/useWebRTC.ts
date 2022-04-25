import {useCallback, useContext, useEffect, useMemo} from "react";
// @ts-ignore
import freeice from "freeice";
import {useCallbackState} from "./useCallbackStateHook";
import {socketInterface} from "../socket/SocketInterface";
import WebRTCInterface from "../WebRCT/WebRTCInterface";
import {MainContext} from "../index";

export function useWebRTC(roomId: string) {
    const [clients, setClients] = useCallbackState<{ socketId: string, userId: string }[]>([]);
    const {user} = useContext(MainContext)

    const webRTCInterface = useMemo(() => new WebRTCInterface(), [])

    const addNewClient = useCallback((newClient, cb) => {
        setClients((list: { socketId: string, userId: string }[]) => {
            if (!list.find(element => element.socketId === newClient.socketId && element.userId === newClient.userId))
                return [...list, newClient]
            return list
        }, cb)
    }, [clients, setClients])


    useEffect(() => {
        async function handlePeer({peerId, userId, createOffer}: { peerId: string, userId: string, createOffer: boolean }) {
            console.log(1)
            if (webRTCInterface.peerConnections[peerId]) {
                return console.log(`Already connected to peer ${peerId}`)
            }
            webRTCInterface.peerConnections[peerId] = new RTCPeerConnection({
                iceServers: freeice()
            })

            webRTCInterface.peerConnections[peerId].onicecandidate = event => {
                if (event.candidate) {
                    socketInterface.emit('RELAY_ICE', {
                        peerId,
                        iceCandidate: event.candidate
                    })
                }
            }

            webRTCInterface.peerConnections[peerId].ontrack = ({streams: [stream]}) => {
                addNewClient({socketId: peerId, userId}, () => {
                    if (webRTCInterface.videoElements[peerId]) {
                        // @ts-ignore
                        webRTCInterface.videoElements[peerId].srcObject = stream
                    }
                })
            }

            if (webRTCInterface.localMediaStream) {
                webRTCInterface.localMediaStream.getTracks().forEach(track => {
                    webRTCInterface.localMediaStream && webRTCInterface.peerConnections[peerId].addTrack(track, webRTCInterface.localMediaStream)
                })
            }

            if (createOffer) {
                const offer = await webRTCInterface.peerConnections[peerId].createOffer()
                await webRTCInterface.peerConnections[peerId].setLocalDescription(offer)
                socketInterface.emit('RELAY_SDP', {
                    peerId,
                    sessionDescription: offer
                })
            }
        }

        socketInterface.on('ADD_PEER', handlePeer)

        return () => {
            socketInterface.off('ADD_PEER')
        }
    }, [])

    useEffect(() => {
        type RelayParams = { peerId: string, sessionDescription: RTCSessionDescriptionInit }
        socketInterface.on('SESSION_DESCRIPTION', async ({peerId, sessionDescription: remoteDescription}: RelayParams) => {
            await webRTCInterface.peerConnections[peerId].setRemoteDescription(
                new RTCSessionDescription(remoteDescription)
            )

            if (remoteDescription.type === 'offer') {
                const answer = await webRTCInterface.peerConnections[peerId].createAnswer()
                await webRTCInterface.peerConnections[peerId].setLocalDescription(answer)
                socketInterface.emit('RELAY_SDP', {
                    peerId,
                    sessionDescription: answer
                })
            }
        })

        return () => {
            socketInterface.off('SESSION_DESCRIPTION')
        }
    }, [])

    useEffect(() => {
        socketInterface.on('REMOVE_PEER', ({peerId}) => {
            if (webRTCInterface.peerConnections[peerId]) {
                webRTCInterface.peerConnections[peerId].close()
            }

            delete webRTCInterface.peerConnections[peerId]
            delete webRTCInterface.videoElements[peerId]

            console.log('remove', webRTCInterface.peerConnections)

            setClients((list: { socketId: string, userId: string }[]) => list.filter(client => client.socketId !== peerId), () => {
            })
        })

        return () => {
            socketInterface.off('REMOVE_PEER')
        }
    }, [])

    useEffect(() => {
        socketInterface.on('ICE_CANDIDATE', ({peerId, iceCandidate}) => {
            webRTCInterface.peerConnections[peerId].addIceCandidate(
                new RTCIceCandidate(iceCandidate)
            )
        })

        return () => {
            socketInterface.off('ICE_CANDIDATE')
        }
    }, [])

    useEffect(() => {
        async function startCapture() {
            // webRTCInterface.localMediaStream = await navigator.mediaDevices.getUserMedia({
            //     audio: true,
            //     video: {
            //         height: 720,
            //         width: 1280,
            //     }
            // })

            webRTCInterface.localMediaStream = await navigator.mediaDevices.getDisplayMedia()
            addNewClient({socketId: 'local', userId: user.user.userId}, () => {
                if (webRTCInterface.videoElements['local']) {
                    webRTCInterface.videoElements['local'].volume = 0;
                    webRTCInterface.videoElements['local'].srcObject = webRTCInterface.localMediaStream
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