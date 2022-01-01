import vscode from 'vscode'
import {
  delimiter,
  EnumLanguage
} from "./typings"

function getLanguageDelimiter(language: vscode.TextDocument['languageId']) {
  let delimiter = null

  switch(language) {
    case EnumLanguage.BAT:
      delimiter = {
        start: '::#region',
        end: '::#endregion'
      }
      break
    case EnumLanguage.VISUAL_BASIC:
      delimiter = {
        start: '#Region',
        end: '#End Region'
      }
      break
    case EnumLanguage.C:
    case EnumLanguage.CPP:
      delimiter = {
        start: '#pragma region',
        end: '#pragma endregion'
      }
      break
    case EnumLanguage.CSS:
    case EnumLanguage.LESS:
    case EnumLanguage.SCSS:
      delimiter = {
        start: '/* #region */',
        end: '/* #endregion */'
      }
      break
    case EnumLanguage.PHP:
    case EnumLanguage.PERL:
    case EnumLanguage.CSHARP:
    case EnumLanguage.PYTHON:
    case EnumLanguage.POWERSHELL:
    case EnumLanguage.COFFEESCRIPT:
      delimiter = {
        start: '#region',
        end: '#endregion'
      }
      break
    case EnumLanguage.VUE:
    case EnumLanguage.JAVA:
    case EnumLanguage.JREACT:
    case EnumLanguage.TREACT:
    case EnumLanguage.FSHARP:
    case EnumLanguage.JAVASCRIPT:
    case EnumLanguage.TYPESCRIPT:
      delimiter = {
        start: '// #region',
        end: '// #endregion'
      }
      break
    default:
      delimiter = null
  }

  return delimiter
}

function injectRegionDilimiter(
  editBuilder: vscode.TextEditorEdit,
  activeTextEditor: vscode.TextEditor,
  regionDelimiter: delimiter,
  regionName: string = ''
) {
  let firstLine = undefined
  let lastLine = undefined

  const { selection, document } = activeTextEditor

  for (let index = selection.start.line; index <= selection.end.line; index++) {
    const line = document.lineAt(index)

    if (!line.isEmptyOrWhitespace) {
      if (!firstLine) firstLine = line

      lastLine = line
    }
  }

  if (firstLine && lastLine) {
    const indextationText = document.getText(new vscode.Range(
      firstLine.lineNumber,
      0,
      firstLine.lineNumber,
      firstLine.firstNonWhitespaceCharacterIndex
    ))
  
    let startRegionDelimiter = `${indextationText}${regionDelimiter.start}\n`
    const endRegionDelimiter = `\n${indextationText}${regionDelimiter.end}`

    if (regionName) {
      startRegionDelimiter = startRegionDelimiter.replace(
        /region/i,
        (match) => `${match} ${regionName}`
      )
    }
  
    editBuilder.insert(firstLine.range.start.with(undefined, 0), startRegionDelimiter)
    editBuilder.insert(lastLine.range.end, endRegionDelimiter)
  }
}

export async function registerMarkCommand() {
  const regionName = await vscode.window.showInputBox({ prompt: '(optional)Region Name' })

  const { activeTextEditor } = vscode.window
  if (!activeTextEditor) return

  const { document } = activeTextEditor
  const languageDelimiter = getLanguageDelimiter(document.languageId)
  if (!languageDelimiter) {
    vscode.window.showWarningMessage(
      `[Region Highlighter]: This file language is not supported to mark region.
      visit https://code.visualstudio.com/docs/editor/codebasics#_folding for the currently supported file languags`
    )
    return
  }

  activeTextEditor.edit((editBuilder) => {
    injectRegionDilimiter(editBuilder, activeTextEditor, languageDelimiter, regionName)
  })
}

export function registerUnMarkCommand() {
  console.log('registerUnMarkCommand')
}