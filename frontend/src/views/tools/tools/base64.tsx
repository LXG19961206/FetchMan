import EncodeOrDecord from "./encodeOrDecord";

export default () => {
  return (
    <EncodeOrDecord 
      supportBinary
      decodeHandler={atob.bind(window)}
      encodeHandler={btoa.bind(window)}>
    </EncodeOrDecord>
  )
}