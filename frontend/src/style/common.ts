import { px, percent, Position, BoxSizing, Display, createStyle, BorderType, FlexXY, vw, vh } from './index'

const genRandomRgbValue = () => Math.floor(Math.random() * 255)

export const PosCenter = createStyle({
  position: Position.absolute,
  top: percent(50),
  left: percent(50),
  transform: `translate(${percent(-50)}, ${percent(-50)})`
})

export const FlexCenter = createStyle({
  display: Display.flex,
  justifyContent: FlexXY.center,
  alignItems: FlexXY.center
})

export const Reset = createStyle({ 
  padding: percent(0), 
  margin: percent(0), 
  boxSizing: BoxSizing.borderBox 
})

export const RandomRgb = () => `rgb(${genRandomRgbValue},${genRandomRgbValue}, ${genRandomRgbValue})`

export const RandomRgba = () => `rgba(${genRandomRgbValue},${genRandomRgbValue}, ${genRandomRgbValue}, ${Math.random()})`

export const MaginAuto = (offset: string) => createStyle({ margin: `${ offset || 0 } auto` })

export const CoverFather = createStyle({
  width: percent(100),
  height: percent(100)
})

export const FullScreen = createStyle({
  width: vw(100),
  height: vh(100)
})

export const marginX = (offset: string) => createStyle({
  marginLeft: offset,
  marginRight: offset
})


export const marginY = (offset: string | number) => createStyle({
  marginTop: offset,
  marginBottom: offset
})

export const paddingY = (offset: string | number) => createStyle({
  paddingTop: offset,
  paddingBottom: offset
})

export const paddingX = (offset: string | number) => createStyle({
  paddingLeft: offset,
  paddingRight: offset
})

export const border = (size: string,color: string,type: string = BorderType.solid) => (
  `${size} ${type} ${color}`
)

export const getWindowWidth = () => window.innerWidth

export const getWindowHeight = () => window.innerHeight