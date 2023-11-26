import React, {JSX} from "react";

export const RenderIf = (props: {
    when: boolean,
    children: React.ReactNode,
    fallback?: React.ReactNode
}) => {
    return (
        <> { props.when ? props.children : props.fallback } </>
    )
}