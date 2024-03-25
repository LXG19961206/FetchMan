import EncodeOrDecord from "./encodeOrDecord";

export default () => {
  return (
    <EncodeOrDecord 
      supportBinary
      decodeHandler={atob}
      encodeHandler={btoa}>
    </EncodeOrDecord>
  )
}