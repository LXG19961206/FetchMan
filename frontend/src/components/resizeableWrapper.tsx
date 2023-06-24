import interact from 'interactjs'
import React ,{JSX, useEffect, useRef} from "react";
import {px} from "../style";

export default (props: {
    left?: boolean | HTMLElement,
    min?: { width: number, height: number },
    max?: { width: number, height: number },
    style?: React.CSSProperties,
    right?: boolean | HTMLElement,
    top?: boolean | HTMLElement,
    maxWidth?: number,
    maxHeight?: number,
    bottom?: boolean | HTMLElement,
    children?: React.ReactNode,
    setSize?: (prop: { width: number, height: number }) => void
}) => {

    const wrapper = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!wrapper.current) return


        const resizeInstance = interact(wrapper.current).resizable({
            edges: {
                left: !!props.left,
                right: !!props.right,
                top: !!props.top,
                bottom: !!props.bottom
            },
            inertia: true,
            modifiers: (props.min || props.max) ? [
                // keep the edges inside the parent
                interact.modifiers.restrictSize({
                    min: props.min,
                    max: props.max
                })
            ] : [],
            listeners: {
                move (event) {
                    const  target = event.target
                    let x = (parseFloat(target.getAttribute('data-x')) || 0)
                    let y = (parseFloat(target.getAttribute('data-y')) || 0)
                    target.style.width = px(event.rect.width)
                    target.style.height = px(event.rect.height)
                    x += event.deltaRect.left
                    y += event.deltaRect.top
                    target.setAttribute('data-x', x.toString())
                    target.setAttribute('data-y', y.toString())
                    if (wrapper.current?.parentElement) {
                        wrapper.current!.parentElement!.style.height = px(event.rect.height)
                        wrapper.current!.parentElement!.style.width = px(event.rect.width)
                    }
                }
            }
        })

        return () => {
            resizeInstance.unset()
        }

    }, [props.min, props.max])

    return (
        <div style={props.style}>
            <div ref={wrapper} style={{ height: "inherit", width: "inherit" }}>
                { props.children }
            </div>
        </div>
    )
}