import React, {useMemo, JSX} from "react";


type Strategies = {
    [strategy: string]: React.FC | ((props: unknown) => JSX.Element) | React.ExoticComponent,
    default: React.FunctionComponent | ((props: unknown) => JSX.Element) | React.ExoticComponent
}

export default (props: {
    strategies: Strategies,
    value: string,
    children?: React.ReactNode
}) => {

    const Matched = useMemo(() => {

        const matchRes = Object.keys(props.strategies)
            .find(strategy => strategy === props.value)

        return matchRes
            ? props.strategies[matchRes]
            : (props.strategies.default || React.Fragment)

    }, [props.value, props.strategies])

    return (
        <Matched></Matched>
    )

}