import * as vscode from 'vscode'
import {
 positionStack, position, decoratePosition, regionStyle, decorationConfig,
 EnumLanguage, EnumContributes, EnumDecorationStyle, EnumDefaultTheme, EnumExtraColorStrategy
} from './typings'
import { DEFAULT_THEMES } from './config'
import * as UNIT from './util'

let regionStyles: vscode.TextEditorDecorationType[] = []


/**
 * get the region regular expressions for lanuage param
 */
 function getLanguageRegionRegExp(
  config: vscode.WorkspaceConfiguration,
  language: vscode.TextDocument['languageId']) {
 let expression: RegExp | null
 const allowLanguageIDs = (config.get(EnumContributes.ALLOW_LANGUAGE_IDS) as string).split(',')
 const isEmptyMatchLanguages = !allowLanguageIDs.includes(language)

 if (allowLanguageIDs.length && isEmptyMatchLanguages) return null

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

/**
 * get the region decoration config
 */
function getDecorationConfig(config: vscode.WorkspaceConfiguration): decorationConfig {
  const borderStyle = config.get(EnumContributes.BORDER_STYLE) as string
  const borderWidth = config.get(EnumContributes.BORDER_WIDTH) as string
  const defaultTheme = config.get(EnumContributes.DEFAULT_THEME) as EnumDefaultTheme
  const decorationStyle = config.get(EnumContributes.DECORATION_STYLE) as EnumDecorationStyle
  
  const isDefaultColorTheme = defaultTheme === EnumDefaultTheme.DEFAULT_COLOR
  let currentTheme: regionStyle[]
  if (!isDefaultColorTheme) {
    currentTheme = defaultTheme === EnumDefaultTheme.CUSTOM_THEME
      ? UNIT.formatThemeWrapper(config.get(EnumContributes.CUSTOM_THEME) as any)
      : UNIT.formatThemeWrapper(DEFAULT_THEMES[defaultTheme])
  } else {
    currentTheme = []
  }
  
  return {
    defaultTheme: currentTheme,
    decorationStyle: `${decorationStyle}Color`,
    isDefaultColorTheme: defaultTheme === EnumDefaultTheme.DEFAULT_COLOR,
    ...(decorationStyle === EnumDecorationStyle.BORDER ? { borderStyle, borderWidth } : {})
  }
}


/**
 * get the region array of successful matches,
 * and convert into a interface<position> data structure
 */
function getMatchedRegions(
  config: vscode.WorkspaceConfiguration,
  document: vscode.TextDocument,
  regexp: RegExp
): position[] {
  const matchResult = document.getText().matchAll(regexp)
  let positionStacks = [...matchResult].reduce((prev: positionStack[], next: RegExpMatchArray) => {

    // get the match group index of regexp match array
    const matchIndex = next[0].includes(next[1]) ? 1 : next[0].includes(next[2]) ? 2 : 0

    if (matchIndex) {
      // get the match substring of start at the matchIndex string end index,
      // to check whether startat ignore flag
      const matchString = next[0].slice(next[0].indexOf(next[matchIndex]) + next[matchIndex].length).trim()

      prev.push({
        isIgnore: matchString.startsWith(config.get(EnumContributes.IGNORE_FLAG, '')),
        startPos: document.positionAt(next.index as number),
        endPos: null
      })
    } else {
      const lastMatchPositionIndex = prev.reverse().findIndex((item) => !item.endPos)

      if (lastMatchPositionIndex !== -1) {
        prev[lastMatchPositionIndex] = {
          ...prev[lastMatchPositionIndex],
          endPos: document.positionAt(next.index as number)
        }
      }
    }
    return prev
  }, [] as positionStack[])

  return positionStacks
    .filter((item: positionStack) => item.endPos)
    .sort((a, b) => a.startPos.line - b.startPos.line) as position[]
}

/**
 * get the array of decorated region
 */
function getDecoratedRegions(
  config: vscode.WorkspaceConfiguration,
  decorationConfig: decorationConfig,
  positions: position[]
) {
  const defaultColor = config.get(EnumContributes.DEFAULT_COLOR) as string
  const extraColorStrategy = config.get(EnumContributes.EXTRA_COLOR_STRATEGY) as EnumExtraColorStrategy

  return positions.reduce((prev: decoratePosition[], next: position, index: number) => {
    if (!next?.isIgnore) {
      const regionStyle = vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        [decorationConfig.decorationStyle]: UNIT.getRegionStyleColor(
          decorationConfig.defaultTheme,
          decorationConfig.isDefaultColorTheme,
          defaultColor,
          extraColorStrategy,
          index),
        ...(decorationConfig?.borderWidth ? { borderWidth: decorationConfig.borderWidth } : {}),
        ...(decorationConfig?.borderStyle ? { borderStyle: decorationConfig.borderStyle } : {})
      })
      prev.push({
        style: regionStyle,
        range: [{ range: new vscode.Range(next.startPos, next.endPos) }]
      })
    }
    return prev
  }, [])
}

/**
 * reset previous render decoration
 */
function resetDecorations() {
  regionStyles.forEach((item: vscode.TextEditorDecorationType) => {
    item.dispose()
  })
  regionStyles = []
}

/**
 * core logic
 */
export function syncTriggerDecorationRegion(editor?: vscode.TextEditor) {
  if (!editor) return
  
  // aviod region rendering overlap
  resetDecorations()

  const { document } = editor
  const configurations = vscode.workspace.getConfiguration('regionHighlighter')

  const languageRegExp = getLanguageRegionRegExp(configurations, document.languageId)
  if (!languageRegExp) return

  const regionPositions = getMatchedRegions(configurations, document, languageRegExp)
  
  if (regionPositions.length !== 0) {
    const decorationConfig = getDecorationConfig(configurations)
    const regionDecorates = getDecoratedRegions(configurations, decorationConfig, regionPositions)

    // re-maintain region rendering stack
    regionStyles = regionDecorates.map((item) => item.style)

    regionDecorates.forEach((item) => {
      editor.setDecorations(item.style, item.range)
    })
  }
}