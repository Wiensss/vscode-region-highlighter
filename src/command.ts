import vscode from 'vscode'
import { delimiter, EnumCommands } from "./typings"
import * as UTIL from "./util"

function triggerRegionDelimiter(
  command: EnumCommands,
  editBuilder: vscode.TextEditorEdit,
  activeTextEditor: vscode.TextEditor,
  regionCondition: delimiter | RegExp,
  regionName?: string,
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
    if (command === EnumCommands.MARK) {
      const indextationText = document.getText(new vscode.Range(
        firstLine.lineNumber,
        0,
        firstLine.lineNumber,
        firstLine.firstNonWhitespaceCharacterIndex
      ))

      let startRegionDelimiter = `${indextationText}${(regionCondition as delimiter).start}\n`
      const endRegionDelimiter = `\n${indextationText}${(regionCondition as delimiter).end}`

      if (regionName) {
        startRegionDelimiter = startRegionDelimiter.replace(
          /region/i,
          (match) => `${match} ${regionName}`
        )
      }

      editBuilder.insert(firstLine.range.start.with(undefined, 0), startRegionDelimiter)
      editBuilder.insert(lastLine.range.end, endRegionDelimiter)
    } else {
      const firstMatch = firstLine.text.match(regionCondition as RegExp) ?? null
      const lastMatch = lastLine.text.match(regionCondition as RegExp) ?? null

      if (firstMatch && lastMatch) {
        editBuilder.delete(firstLine.range)
        editBuilder.delete(lastLine.range)
      }
    }
  }
}

export async function registerMarkCommand() {
  const { activeTextEditor } = vscode.window
  if (!activeTextEditor) return

  const regionName = await vscode.window.showInputBox({ prompt: '(optional)Region Name' })

  const { document } = activeTextEditor
  const languageDelimiter = UTIL.execLanguageDelimiter(document.languageId)
  if (!languageDelimiter) {
    vscode.window.showWarningMessage(
      `[Region Highlighter]: This file language is not supported to mark region.
      visit https://code.visualstudio.com/docs/editor/codebasics#_folding for the currently supported file languags`
    )
    return
  }

  activeTextEditor.edit((editBuilder) => {
    triggerRegionDelimiter(EnumCommands.MARK, editBuilder, activeTextEditor, languageDelimiter, regionName)
  })
}

export function registerUnMarkCommand() {
  const { activeTextEditor } = vscode.window
  if (!activeTextEditor) return

  const { document } = activeTextEditor
  const languageRegExp = UTIL.execLanguageRegExp(document.languageId)
  if (!languageRegExp) return

  activeTextEditor.edit((editBuilder) => {
    triggerRegionDelimiter(EnumCommands.UNMARK, editBuilder, activeTextEditor, languageRegExp)
  })
}