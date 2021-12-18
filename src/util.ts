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
    case EnumLanguage.BAT:
      expression = /^[ ]*(?:::|REM)\s*(?:(#region)|#endregion).*$/mg
      break
    case EnumLanguage.VISUAL_BASIC:
      expression = /^[ ]*(?:(#Region)|#End Region)(?:[^0-9a-zA-Z\n].*)*$/mg
      break
    case EnumLanguage.PYTHON:
      expression = /^[ ]*(?:(#\s*region)|#\s*endregion)(?:[^0-9a-zA-Z\n].*)*$/mg
      break
    case EnumLanguage.PERL:
      expression = /(?:^[ ]*(#region)(?:[^0-9a-zA-Z\n].*)*$|^(=pod)$)|^[ ]*#endregion(?:[^0-9a-zA-Z\n].*)*$|^=cut$/mg
      break
    case EnumLanguage.JAVA:
      // eslint-disable-next-line max-len
      expression = /^[ ]*\/\/\s*(?:(#region(?:[^0-9a-zA-Z\n].*)*|<editor-fold>(?:[^\n]*))|#endregion(?:[^0-9a-zA-Z\n].*)*|<\/editor-fold>(?:[^\n]*))$/mg
      break
    case EnumLanguage.C:
    case EnumLanguage.CPP:
      expression = /^[ ]*(?:(#pragma region)|#pragma endregion)(?:[^0-9a-zA-Z\n].*)*$/mg
      break
    case EnumLanguage.HTML:
    case EnumLanguage.MARKDOWN:
      expression = /^[ ]*<!--\s*(?:(#region)|#endregion)(?:[^0-9a-zA-Z\n].*)*-->(?:.*)*$/mg
      break
    case EnumLanguage.CSS:
    case EnumLanguage.LESS:
    case EnumLanguage.SCSS:
      // eslint-disable-next-line max-len
      expression = /^[ ]*(?:\/\*\s*(#region)(?:[^0-9a-zA-Z\n].*)*\*\/|\/\/\s*(#region)(?:[^0-9a-zA-Z\n].*)*|\/\*\s*#endregion(?:[^0-9a-zA-Z\n].*)*\*\/|\/\/\s*#endregion(?:[^0-9a-zA-Z\n].*)*)/mg
      break
    case EnumLanguage.PHP:
    case EnumLanguage.CSHARP:
    case EnumLanguage.POWERSHELL:
    case EnumLanguage.COFFEESCRIPT:
      expression = /^[ ]*(?:(#region)|#endregion)(?:[^0-9a-zA-Z\n].*)*$/mg
      break
    case EnumLanguage.VUE:
    case EnumLanguage.JREACT:
    case EnumLanguage.TREACT:
    case EnumLanguage.FSHARP:
    case EnumLanguage.JAVASCRIPT:
    case EnumLanguage.TYPESCRIPT:
      expression = /^[ ]*\/\/\s*(?:(#region)|#endregion)(?:[ ]+\S*)*$/mg
      break
    default:
      expression = null
  }

  return expression
}