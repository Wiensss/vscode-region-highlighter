import { regionStyle } from "../typings"

/**
 * get the regionStyle.color according to index param,
 * if index param exceeds the regionStyle length,
 * the last item color of the regionStyle will be taken by default
 */
 export function getRegionStyleColor(colors: regionStyle[], index: number) {
  if (!colors.length) {
    return ''
  }

  const lastIndex = colors.length - 1
  const curIndex = index > lastIndex
    ? lastIndex
    : index

  return colors[curIndex].color
}