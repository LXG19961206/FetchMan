import { useEffect, useLayoutEffect, useState } from "react"

export function useAutoHeight<T extends HTMLElement = HTMLDivElement>() {

  const [el, setEl] = useState<T | void>()
  const [height, setHeight] = useState(100)

  useLayoutEffect(() => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    setHeight(window.innerHeight - rect.top - 180)
  }, [el])

  return {
    bindWrapper: setEl,
    height
  }

}