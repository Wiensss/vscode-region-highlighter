import * as vscode from 'vscode'
import { EnumLanguage, regionStyle } from "./typings"

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

/**
 * get the region regular expressions for lanuage param
 */
export function getLanguageRegionRegExp(language: vscode.TextDocument['languageId']) {
  let expression: RegExp | null

  switch (language) {
    // case EnumLanguage.VISUAL_BASIC:
    //   expression = /(?:(#Region)|#End Region)\s+\w*/g
    //   break
    // case EnumLanguage.PERL:
    //   expression = /^(?:(#region|=pod)|(?:#endregion|=cut))\s+\w*/gm
    //   break
    // case EnumLanguage.FSHARP:
    //   expression = /(?:\/\/\s*(?:(#region)|#endregion))|(?:\s*(#_region)|#_endregion)\s+\w*/g
    //   break
    // case EnumLanguage.BAT:
    //   regexp = /[]/h
      // expression = /([::|REM]\s*#(?:end)?region)\s+\w*/g
      // break
    // case EnumLanguage.JAVA:
    //   expression = /(\/\/\s*#region.*|\/\/\s*<editor-fold>.*)|(\/\/\s*#endregion.*|\/\/\s*<\/editor-fold>.*)/g
    //   break
    // case EnumLanguage.C:
    // case EnumLanguage.CPP:
    //   expression = /(#pragma\s+region.*)|(#pragma\s+endregion.*)/g
    //   break
    // case EnumLanguage.HTML:
    // case EnumLanguage.MARKDOWN:
    //   expression = /(<!--\s*#region\s*.*-->)|(<!--\s*#endregion\s*.*-->)/g
    //   break
    // case EnumLanguage.CSS:
    // case EnumLanguage.LESS:
    // case EnumLanguage.SCSS:
    //   expression = /(\/\*\s*#region.*\*\/.*)|(\/\*\s*#endregion.*\*\/.*)/g
    //   break
    // case EnumLanguage.PHP:
    // case EnumLanguage.CSHARP:
    // case EnumLanguage.POWERSHELL:
    // case EnumLanguage.COFFEESCRIPT:
    //   expression = /(#region.*)|(#endregion.*)/g
    //   break
    case EnumLanguage.VUE:
    case EnumLanguage.JREACT:
    case EnumLanguage.TREACT:
    case EnumLanguage.JAVASCRIPT:
    case EnumLanguage.TYPESCRIPT:
      expression = /\/\/\s*(?:(#region)|#endregion)\s+\w*/g
      break
    default:
      expression = null
  }

  return expression
}