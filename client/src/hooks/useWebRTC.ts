import {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
// @ts-ignore
import freeice from "freeice";
import {useCallbackState} from "./useCallbackStateHook";
import {socketInterface} from "../socket/SocketInterface";
import WebRTCInterface from "../WebRCT/WebRTCInterface";
import {MainContext} from "../index";
import {useImmer} from "use-immer";
import {RoomElementType} from "../types/RoomElementType";

export function useWebRTC(room: RoomElementType) {
    const roomId = room.roomId

    const [clients, setClients] = useCallbackState<{ socketId: string, userId: string }[]>([]);
    const {user} = useContext(MainContext)

    let webRTCInterface = useMemo(() => new WebRTCInterface(), [])

    const [muteState, setMuteState] = useCallbackState<boolean>(false)
    const [deafenState, setDeafenState] = useCallbackState<boolean>(false)
    const [videoState, setVideoState] = useCallbackState<boolean>(false)
    const [editorsState, setEditorsState] = useImmer<{ visible: boolean, currentEditor: 'text' | 'handWr' }>({currentEditor: 'text', visible: false})
    const [textEditorState, setTextEditorState] = useState('')
    const [chatState, setChatState] = useCallbackState<boolean>(false)

    const drawMethod = useRef<((value: any) => void)>(value => {
    })

    const muteHandler = function () {
        setMuteState(prevState => !prevState, async (updatedState) => {
            if (webRTCInterface.localMediaStream?.getAudioTracks()[0]) {
                webRTCInterface.localMediaStream.getAudioTracks()[0].enabled = !updatedState
            }
        })
    }

    const deafenHandler = function () {
        setDeafenState(prevState => !prevState, (updatedState) => {
            webRTCInterface.muteAll(updatedState)
        })
    }

    const videoHandler = function () {
        setVideoState(prevState => !prevState, (updatedState) => {
            if (updatedState) {
                webRTCInterface.addVideoOnAllPeers()
            } else {
                webRTCInterface.removeVideoFormAllPeers()
            }

        })
    }

    const editorHandler = function (action: 'switch' | 'changeVisible') {
        setEditorsState(draft => {
            if (action === 'switch') {
                draft.currentEditor = draft.currentEditor === 'handWr' ? 'text' : 'handWr'
            } else {
                draft.visible = !draft.visible
            }
        })
    }

    const addNewClient = useCallback((newClient, cb) => {
        setClients((list: { socketId: string, userId: string }[]) => {
            if (!list.find(element => element.socketId === newClient.socketId && element.userId === newClient.userId))
                return [...list, newClient]
            return list
        }, cb)
    }, [clients, setClients])

    let receiveMessage = useCallback(function (messageEv: MessageEvent) {
        const data = JSON.parse(messageEv.data) as { type: 'text' | 'handWr', data: any }
        switch (data.type) {
            case 'text':
                setTextEditorState(data.data)
                break;
            case 'handWr':
                draw(data.data)
                break;
        }
    }, [])

    const onChangeTextHandler = (function () {
        let savedValues: any, isThrottle = false
        return function foo(data: string, type: 'text' | 'handWr') {
            if (isThrottle) {
                savedValues = arguments
                return
            }
            isThrottle = true
            webRTCInterface.sendMessageByDataChannel(JSON.stringify({type, data}))
            setTimeout(() => {
                isThrottle = false
                if (savedValues) {
                    foo.apply(null, savedValues)
                }
                savedValues = null
            }, 1000)
        }
    })()

    const onChangeCanvasHandler = useCallback((data: string, type: 'handWr') => {
        webRTCInterface.sendMessageByDataChannel(JSON.stringify({type, data}))
    }, [])


    const getCanvasDrawMethod = useCallback((updater) => {
        drawMethod.current = updater
    }, [])

    const draw = (data: string) => {
        drawMethod.current(data)
    }

    const chatHandler = () => {
        setChatState(prevState => !prevState)
    }


    useEffect(() => {
        async function handlePeer({peerId, userId, createOffer}: { peerId: string, userId: string, createOffer: boolean }) {
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

            webRTCInterface.peerConnections[peerId].ontrack = ({streams}) => {
                const stream = streams[0]

                addNewClient({socketId: peerId, userId}, () => {
                })
                if (webRTCInterface.videoElements[peerId]) {
                    // @ts-ignore
                    webRTCInterface.videoElements[peerId].srcObject = null
                    // @ts-ignore
                    webRTCInterface.videoElements[peerId].srcObject = stream
                }
            }

            if (webRTCInterface.localMediaStream) {
                webRTCInterface.localMediaStream.getTracks().forEach(track => {
                    webRTCInterface.localMediaStream && webRTCInterface.peerConnections[peerId].addTrack(track, webRTCInterface.localMediaStream)
                })
            }

            if (!webRTCInterface.dataChannels[peerId] && (room.editors.handWr || room.editors.text)) {
                webRTCInterface.dataChannels[peerId] = webRTCInterface.peerConnections[peerId].createDataChannel(`data chanel for ${peerId}`)

                webRTCInterface.peerConnections[peerId].ondatachannel = (ev) => {
                    ev.channel.onmessage = receiveMessage
                }
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
    }, [webRTCInterface.localMediaStream])

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
            delete webRTCInterface.dataChannels[peerId]

            setClients((list: { socketId: string, userId: string }[]) => list.filter(client => client.socketId !== peerId))
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
            webRTCInterface.localMediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            })

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

    return {
        clients, provideMediaRef, controllers: {
            microphone: {
                mute: muteState,
                handler: muteHandler
            },
            deafen: {
                state: deafenState,
                handler: deafenHandler
            },
            video: {
                visible: videoState,
                handler: videoHandler
            },
            editor: {
                visible: editorsState.visible,
                editorType: editorsState.currentEditor,
                visualHandler: editorHandler,
                textEditorState,
                onChangeTextHandler,
                getCanvasDrawMethod,
                onChangeCanvasHandler
            },
            chat: {
                visible: chatState,
                handler: chatHandler
            }
        }
    }
}