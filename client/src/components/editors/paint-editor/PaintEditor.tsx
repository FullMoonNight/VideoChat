import React, {useCallback, useEffect, useRef} from 'react';
import './PaintEditor.css'

interface Props {
    onChange: (value: string, event?: any) => void,
    value: string
}

export const PaintEditor = ({value, onChange}: Props) => {
    const canvas = useRef<HTMLCanvasElement | null>(null)

    const canvasResize = useCallback(() => {
        if (canvas.current && canvas.current.width && canvas.current.height) {
            const canvasBlockRect = canvas.current.getBoundingClientRect()
            canvas.current.width = canvasBlockRect.width
            canvas.current.height = canvasBlockRect.height
        }
    }, [])

    const draw = useCallback((data: { x: number, y: number, }) => {
        const ctx = canvas.current?.getContext('2d')
        if (ctx) {
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
            canvas.current?.dispatchEvent(new CustomEvent('change', {detail: ctx.getImageData(0, 0, canvas.current.width, canvas.current.height)}))
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
                    const ctx = canvas.current?.getContext('2d')
                    if (ctx) {
                        draw({x: e.offsetX, y: e.offsetY})
                    }
                }

                canvas.current?.addEventListener('mousemove', handler)

                window.addEventListener('mouseup', () => {
                    canvas.current?.removeEventListener('mousemove', handler)
                }, {once: true})
            }
        }
    }, [])

    useEffect(() => {
        const handler = (e: any) => {
            // onChange(JSON.stringify(e.detail))
        }

        canvas.current?.addEventListener('change', handler)

        return () => {
            canvas.current?.removeEventListener('change', handler)
        }
    }, [])


    return (
        <div className='paint-editor-wrapper'>
            <div className="toolbar">
                <button>clear</button>
            </div>
            <canvas ref={canvas}/>
        </div>
    );
};