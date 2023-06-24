import React from "react";

export const Option: React.FC<{ when: boolean, children: React.ReactNode }> = (props: {
    when: boolean,
    children: React.ReactNode
}) => {
    return props.when ? <> { props.children} </> : <React.Fragment></React.Fragment>
}

export const Match = (props: {
    children: React.ReactNode,
    fallback?: React.ReactNode
}) => {
    const children = Array.isArray(props.children) ? props.children : [props.children]
    return (
        <> { children.find(child => child.props.when) || props.fallback } </>
    )
}

Match.Option = Option

