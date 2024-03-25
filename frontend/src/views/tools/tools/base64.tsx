import EncodeOrDecord from "./encodeOrDecord";

export default () => {
  return (
    <EncodeOrDecord 
      decodeHandler={btoa}
      encodeHandler={atob}>
    </EncodeOrDecord>
  )
}