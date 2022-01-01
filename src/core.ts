import * as vscode from "vscode"
import { DEFAULT_THEMES } from "./config"
import {
  position,
  positionStack,
  decoratePosition,
  decorationConfig,
  regionStyle,
  EnumLanguage,
  EnumBorderStyle,
  EnumContributes,
  EnumDefaultTheme,
  EnumDecorationStyle,
  EnumExtraColorStrategy
} from "./typings"
import * as UNIT from "./util"

let regionStyles: vscode.TextEditorDecorationType[] = []

function getLanguageRegExp(
  config: vscode.WorkspaceConfiguration,
  language: vscode.TextDocument["languageId"]
) {
  let expression: RegExp | null

  const allowLanguageIDs = config
    .get(EnumContributes.ALLOW_LANGUAGE_IDS, "")
    .split(",")

  // '*' flag means match all supported languageIDs
  const isEmptyLanguageIDs = allowLanguageIDs.indexOf("*") === -1 && !allowLanguageIDs.includes(language)
  if (allowLanguageIDs.length && isEmptyLanguageIDs) return null

  switch (language) {
    case EnumLanguage.BAT:
      expression = /^[ ]*(?:::|REM)\s*(?:(#region)|#endregion).*$/gm
      break
    case EnumLanguage.VISUAL_BASIC:
      expression = /^[ ]*(?:(#Region)|#End Region)(?:[^0-9a-zA-Z\n].*)*$/gm
      break
    case EnumLanguage.PYTHON:
      expression =
        /^[ ]*(?:(#\s*region)|#\s*endregion)(?:[^0-9a-zA-Z\n].*)*$/gm
      break
    case EnumLanguage.PERL:
      expression =
        /(?:^[ ]*(#region)(?:[^0-9a-zA-Z\n].*)*$|^(=pod)$)|^[ ]*#endregion(?:[^0-9a-zA-Z\n].*)*$|^=cut$/gm
      break
    case EnumLanguage.JAVA:
      expression =
        // eslint-disable-next-line max-len
        /^[ ]*\/\/\s*(?:(#region(?:[^0-9a-zA-Z\n].*)*|<editor-fold>(?:[^\n]*))|#endregion(?:[^0-9a-zA-Z\n].*)*|<\/editor-fold>(?:[^\n]*))$/gm
      break
    case EnumLanguage.C:
    case EnumLanguage.CPP:
      expression =
        /^[ ]*(?:(#pragma region)|#pragma endregion)(?:[^0-9a-zA-Z\n].*)*$/gm
      break
    case EnumLanguage.HTML:
    case EnumLanguage.MARKDOWN:
      expression =
        /^[ ]*<!--\s*(?:(#region)|#endregion)(?:[^0-9a-zA-Z\n].*)*-->(?:.*)*$/gm
      break
    case EnumLanguage.CSS:
    case EnumLanguage.LESS:
    case EnumLanguage.SCSS:
      expression =
        // eslint-disable-next-line max-len
        /^[ ]*(?:\/\*\s*(#region)(?:[^0-9a-zA-Z\n].*)*\*\/|\/\/\s*(#region)(?:[^0-9a-zA-Z\n].*)*|\/\*\s*#endregion(?:[^0-9a-zA-Z\n].*)*\*\/|\/\/\s*#endregion(?:[^0-9a-zA-Z\n].*)*)/gm
      break
    case EnumLanguage.PHP:
    case EnumLanguage.CSHARP:
    case EnumLanguage.POWERSHELL:
    case EnumLanguage.COFFEESCRIPT:
      expression = /^[ ]*(?:(#region)|#endregion)(?:[^0-9a-zA-Z\n].*)*$/gm
      break
    case EnumLanguage.VUE:
    case EnumLanguage.JREACT:
    case EnumLanguage.TREACT:
    case EnumLanguage.FSHARP:
    case EnumLanguage.JAVASCRIPT:
    case EnumLanguage.TYPESCRIPT:
      expression = /^[ ]*\/\/\s*(?:(#region)|#endregion)(?:[ ]+\S*)*$/gm
      break
    default:
      expression = null
  }

  return expression
}

function getRegionPositions(
  config: vscode.WorkspaceConfiguration,
  document: vscode.TextDocument,
  regexp: RegExp
) {
  const matchResult = document.getText().matchAll(regexp)

  let positionStacks = [...matchResult].reduce(
    (result: positionStack[], item: RegExpMatchArray) => {
      // get the match group index of regexp match array
      const matchIndex = item[0].includes(item[1])
        ? 1
        : item[0].includes(item[2]) ? 2 : 0

      if (matchIndex) {
        // get the match substring of start at the matchIndex string end index,
        // to check whether startat ignore flag
        const matchString = item[0]
          .slice(item[0].indexOf(item[matchIndex]) + item[matchIndex].length)
          .trim()

        result.push({
          isIgnore: matchString.startsWith(config.get(EnumContributes.IGNORE_FLAG, '')),
          startPos: document.positionAt(item.index as number),
          endPos: null
        })
      } else {
        const lastMatchPositionIndex = result
          .reverse()
          .findIndex((x) => !x.endPos)

        if (lastMatchPositionIndex !== -1) {
          result[lastMatchPositionIndex] = {
            ...result[lastMatchPositionIndex],
            endPos: document.positionAt(item.index as number)
          }
        }
      }

      return result
    }, [] as positionStack[])

  return positionStacks
    .filter((x: positionStack) => x.endPos)
    .sort((a, b) => a.startPos.line - b.startPos.line) as position[]
}

function getDecorationConfig(config: vscode.WorkspaceConfiguration): decorationConfig {
  const borderWidth: string = config.get(EnumContributes.BORDER_WIDTH, '1px')
  const borderStyle: string = config.get(EnumContributes.BORDER_STYLE, EnumBorderStyle.SOLID)
  const defaultTheme =
    config.get(EnumContributes.DEFAULT_THEME, EnumDefaultTheme.RAINBOW) as EnumDefaultTheme
  const decorationStyle =
    config.get(EnumContributes.DECORATION_STYLE, EnumDecorationStyle.BACKGROUND) as EnumDecorationStyle

  let currentTheme: regionStyle[] = []
  const isDefaultColorTheme = defaultTheme === EnumDefaultTheme.DEFAULT_COLOR

  if (!isDefaultColorTheme) {
    currentTheme = defaultTheme === EnumDefaultTheme.CUSTOM_THEME
      ? UNIT.formatThemeWrapper(config.get(EnumContributes.CUSTOM_THEME, []))
      : UNIT.formatThemeWrapper(DEFAULT_THEMES[defaultTheme])
  }

  return {
    defaultTheme: currentTheme,
    decorationStyle: `${decorationStyle}Color`,
    isDefaultColorTheme: defaultTheme === EnumDefaultTheme.DEFAULT_COLOR,
    ...(
      decorationStyle === EnumDecorationStyle.BORDER
      ? { borderStyle, borderWidth }
      : {})
  }
}

function getDecoratedRegions(
  config: vscode.WorkspaceConfiguration,
  decorationConfig: decorationConfig,
  positions: position[]
) {
  const defaultColor = config.get(EnumContributes.DEFAULT_COLOR, '#C9C4E930')
  const extraColorStrategy =
    config.get(EnumContributes.EXTRA_COLOR_STRATEGY, EnumExtraColorStrategy.CUSTOM_THEME_LAST_COLOR)

  return positions.reduce(
    (result: decoratePosition[], item: position, index: number) => {
      if (item?.isIgnore) return result
      
      const regionStyle = vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        [decorationConfig.decorationStyle]: UNIT.getRegionStyleColor(
          decorationConfig.defaultTheme,
          decorationConfig.isDefaultColorTheme,
          defaultColor,
          extraColorStrategy,
          index
        ),
        ...(decorationConfig?.borderWidth
          ? { borderWidth: decorationConfig.borderWidth }
          : {}),
        ...(decorationConfig?.borderStyle
          ? { borderStyle: decorationConfig.borderStyle }
          : {})
      })

      result.push({
        style: regionStyle,
        range: [{ range: new vscode.Range(item.startPos, item.endPos) }]
      })
      return result
    }, [])
}

function resetDecorationRegion() {
  regionStyles.forEach((item: vscode.TextEditorDecorationType) => {
    item.dispose()
  })
  regionStyles = []
}

export function syncTriggerDecorationRegion() {
  const { activeTextEditor } = vscode.window
  if (!activeTextEditor) return

  // aviod region rendering overlap
  resetDecorationRegion()

  const { document } = activeTextEditor
  const configuration = vscode.workspace.getConfiguration(EnumContributes.PLUGIN_PREFIX)

  const currentLanguageRegExp = getLanguageRegExp(configuration, document.languageId)
  if (!currentLanguageRegExp) return

  const regionPositions = getRegionPositions(configuration, document, currentLanguageRegExp)
  if (regionPositions.length === 0) return

  const decorationConfig = getDecorationConfig(configuration)
  const regionDecorates = getDecoratedRegions(configuration, decorationConfig, regionPositions)

  // re-maintain region rendering stack
  regionStyles = regionDecorates.map((item) => item.style)

  regionDecorates.forEach((item) => {
    activeTextEditor.setDecorations(item.style, item.range)
  })
}
