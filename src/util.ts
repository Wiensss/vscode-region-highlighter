import { regionStyle, EnumExtraColorStrategy } from "./typings"

export function formatThemeWrapper(theme: regionStyle[]): regionStyle[] {
  if (!theme?.length) return []

  return theme.map((item: regionStyle) => {
    // to support only string as custom theme
    const isString = typeof item === 'string'

    return {
      label: isString ? '' : item?.label ?? '',
      color: isString ? item : item?.color ?? ''
    }
  })
}

/**
 * get the regionStyle.color according to index param,
 * if index param exceeds the regionStyle length,
 * the last item color of the regionStyle will be taken by default
 */
 export function getRegionStyleColor(
   colors: regionStyle[],
   isDefaultColorTheme: boolean,
   defaultColor: string,
   extraStrategy: EnumExtraColorStrategy,
   index: number
  ) {
  if (isDefaultColorTheme || !colors.length) return defaultColor
  
  const lastIndex = colors.length - 1
  if (index <= lastIndex) return colors[index]?.color ?? ''

  let result = null
  switch (extraStrategy) {
    case EnumExtraColorStrategy.DEFAULT_COLOR:
      result = defaultColor
      break
    case EnumExtraColorStrategy.CUSTOM_THEME_FIRST_COLOR:
      result = colors[0]?.color ?? ''
      break
    case EnumExtraColorStrategy.CUSTOM_THEME_LAST_COLOR:
      result = colors[lastIndex]?.color ?? ''
      break
  }

  return result  
}