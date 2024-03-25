import EncodeOrDecord from "./encodeOrDecord";

export default () => {
  return (
    <EncodeOrDecord 
      supportBinary
      decodeHandler={btoa}
      encodeHandler={atob}>
    </EncodeOrDecord>
  )
}