import {
  delimiter,
  regionStyle,
  EnumLanguage,
  EnumExtraColorStrategy
} from "./typings"

export function throttle(fn: Function, wait: number) {
  let lastFn: NodeJS.Timeout
  let lastTime: number
  let inThrottle: boolean

  return function() {
    // @ts-ignore
    const context = this
    const args = arguments

    if (!inThrottle) {
      fn.apply(context, args)
      lastTime = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFn)
      lastFn = setTimeout(function () {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args)
          lastTime = Date.now()
        }
      }, Math.max(wait - (Date.now() - lastTime), 0))
    }
  }
}

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

export function execLanguageRegExp(language: string) {
  switch (language) {
    case EnumLanguage.BAT:
      return /^[ ]*(?:::|REM)\s*(?:(#region)|#endregion).*$/gm
    case EnumLanguage.VISUAL_BASIC:
      return /^[ ]*(?:(#Region)|#End Region)(?:[^0-9a-zA-Z\n].*)*$/gm
    case EnumLanguage.PYTHON:
      return /^[ ]*(?:(#\s*region)|#\s*endregion)(?:[^0-9a-zA-Z\n].*)*$/gm
    case EnumLanguage.PERL:
      return /(?:^[ ]*(#region)(?:[^0-9a-zA-Z\n].*)*$|^(=pod)$)|^[ ]*#endregion(?:[^0-9a-zA-Z\n].*)*$|^=cut$/gm
    case EnumLanguage.JAVA:
      // eslint-disable-next-line max-len
      return /^[ ]*\/\/\s*(?:(#region(?:[^0-9a-zA-Z\n].*)*|<editor-fold>(?:[^\n]*))|#endregion(?:[^0-9a-zA-Z\n].*)*|<\/editor-fold>(?:[^\n]*))$/gm
    case EnumLanguage.C:
    case EnumLanguage.CPP:
      return /^[ ]*(?:(#pragma region)|#pragma endregion)(?:[^0-9a-zA-Z\n].*)*$/gm
    case EnumLanguage.HTML:
    case EnumLanguage.MARKDOWN:
      return /^[ ]*<!--\s*(?:(#region)|#endregion)(?:[^0-9a-zA-Z\n].*)*-->(?:.*)*$/gm
    case EnumLanguage.CSS:
    case EnumLanguage.LESS:
    case EnumLanguage.SCSS:
      // eslint-disable-next-line max-len
      return /^[ ]*(?:\/\*\s*(#region)(?:[^0-9a-zA-Z\n].*)*\*\/|\/\/\s*(#region)(?:[^0-9a-zA-Z\n].*)*|\/\*\s*#endregion(?:[^0-9a-zA-Z\n].*)*\*\/|\/\/\s*#endregion(?:[^0-9a-zA-Z\n].*)*)/gm
    case EnumLanguage.PHP:
    case EnumLanguage.CSHARP:
    case EnumLanguage.POWERSHELL:
    case EnumLanguage.COFFEESCRIPT:
      return /^[ ]*(?:(#region)|#endregion)(?:[^0-9a-zA-Z\n].*)*$/gm
    case EnumLanguage.GO:
    case EnumLanguage.VUE:
    case EnumLanguage.RUST:
    case EnumLanguage.JREACT:
    case EnumLanguage.TREACT:
    case EnumLanguage.FSHARP:
    case EnumLanguage.JAVASCRIPT:
    case EnumLanguage.TYPESCRIPT:
      return /^[ ]*\/\/\s*(?:(#region)|#endregion)(?:[ ]+\S*)*$/gm
    default:
      return null
  }
}

export function execLanguageDelimiter(language: string): delimiter | null {
  switch(language) {
    case EnumLanguage.BAT:
      return {
        start: '::#region',
        end: '::#endregion'
      }
    case EnumLanguage.VISUAL_BASIC:
      return {
        start: '#Region',
        end: '#End Region'
      }
    case EnumLanguage.C:
    case EnumLanguage.CPP:
      return {
        start: '#pragma region',
        end: '#pragma endregion'
      }
    case EnumLanguage.CSS:
    case EnumLanguage.LESS:
    case EnumLanguage.SCSS:
      return {
        start: '/* #region */',
        end: '/* #endregion */'
      }
    case EnumLanguage.PHP:
    case EnumLanguage.PERL:
    case EnumLanguage.CSHARP:
    case EnumLanguage.PYTHON:
    case EnumLanguage.POWERSHELL:
    case EnumLanguage.COFFEESCRIPT:
      return {
        start: '#region',
        end: '#endregion'
      }
    case EnumLanguage.GO:
    case EnumLanguage.RUST:
    case EnumLanguage.VUE:
    case EnumLanguage.JAVA:
    case EnumLanguage.JREACT:
    case EnumLanguage.TREACT:
    case EnumLanguage.FSHARP:
    case EnumLanguage.JAVASCRIPT:
    case EnumLanguage.TYPESCRIPT:
      return {
        start: '// #region',
        end: '// #endregion'
      }
    default:
      return null
  }
}