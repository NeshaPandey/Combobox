import { useMemo } from "react"

export interface VirtualRange {
  startIndex: number
  endIndex: number
  offsetTop: number
  totalHeight: number
}

interface VirtualTreeOptions {
  itemCount: number
  itemHeight: number
  containerHeight: number
  scrollTop: number
  overscan?: number
}

export function useVirtualTree({
  itemCount,
  itemHeight,
  containerHeight,
  scrollTop,
  overscan = 3
}: VirtualTreeOptions): VirtualRange {
  return useMemo(() => {
    const totalHeight = itemCount * itemHeight

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    )

    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const endIndex = Math.min(
      itemCount - 1,
      startIndex + visibleCount + overscan * 2
    )

    const offsetTop = startIndex * itemHeight

    return {
      startIndex,
      endIndex,
      offsetTop,
      totalHeight
    }
  }, [itemCount, itemHeight, containerHeight, scrollTop, overscan])
}
