import React, {useCallback, useEffect, useRef} from 'react';
import './PaintEditor.css'

interface Props {
    onChange: (value: string, event?: any) => void,
    getDrawMethod: (func: (data: string) => void) => void
}

export const PaintEditor = ({getDrawMethod, onChange}: Props) => {
    const canvas = useRef<HTMLCanvasElement | null>(null)
    const lastPoint = useRef<{ x: number, y: number }>()

    const canvasResize = useCallback(() => {
        if (canvas.current && canvas.current.width && canvas.current.height) {
            const canvasBlockRect = canvas.current.getBoundingClientRect()
            canvas.current.width = canvasBlockRect.width
            canvas.current.height = canvasBlockRect.height
        }
    }, [])

    const draw = useCallback((data: { x: number, y: number, lastPoint: { x: number, y: number } }) => {
        const ctx = canvas.current?.getContext('2d')
        if (ctx) {
            ctx.beginPath()
            ctx.lineTo(data.lastPoint.x, data.lastPoint.y)
            ctx.lineTo(data.x, data.y);
            ctx.closePath()
            ctx.stroke();
        }
    }, [])

    const clear = useCallback(() => {
        const ctx = canvas.current?.getContext('2d')
        if (ctx && canvas.current) {
            ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
        }
    }, [])

    const setValue = useCallback((data) => {
        if (!data) return
        const msg = JSON.parse(data)
        switch (msg.action) {
            case 'draw':
                draw(msg.data)
                break;
            case 'clear':
                clear()
                break;
        }
    }, [])

    //resize listener
    useEffect(() => {
        canvasResize()
        window.onresize = () => {
            canvasResize()
        }

        return () => {
            window.onresize = null
        }
    })

    //draw listener
    useEffect(() => {
        if (canvas.current) {
            canvas.current.onmousedown = (e: MouseEvent) => {
                e.preventDefault()
                const handler = (e: MouseEvent) => {

                    if (!lastPoint.current) {
                        lastPoint.current = {x: e.offsetX, y: e.offsetY}
                    }
                    const ctx = canvas.current?.getContext('2d')
                    if (ctx) {
                        const drawParam = {x: e.offsetX, y: e.offsetY, lastPoint: lastPoint.current}
                        draw(drawParam)
                        onChange(JSON.stringify({action: 'draw', data: drawParam}))
                    }

                    lastPoint.current = {x: e.offsetX, y: e.offsetY}
                }

                canvas.current?.addEventListener('mousemove', handler)

                window.addEventListener('mouseup', () => {
                    lastPoint.current = undefined
                    canvas.current?.removeEventListener('mousemove', handler)
                }, {once: true})
            }
        }
    }, [])

    useEffect(() => {
        getDrawMethod(setValue)
    }, [])

    const clearHandler = () => {
        clear()
        onChange(JSON.stringify({action: 'clear'}))
    }

    return (
        <div className='paint-editor-wrapper'>
            <div className="toolbar">
                <button onClick={clearHandler}>clear</button>
            </div>
            <canvas ref={canvas}/>
        </div>
    );
};