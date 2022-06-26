import vscode from 'vscode'
import { delimiter, EnumCommands } from "./typings"
import * as UTIL from "./util"

function triggerRegionDelimiter(
  command: EnumCommands,
  editBuilder: vscode.TextEditorEdit,
  activeTextEditor: vscode.TextEditor,
  regionCondition: RegExp,
  regionDelimter: delimiter,
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

        let startRegionDelimiter = `${indextationText}${(regionDelimter).start}\n`
        const endRegionDelimiter = `\n${indextationText}${(regionDelimter).end}`

        if (regionName) {
          startRegionDelimiter = startRegionDelimiter.replace(
            /region/i,
            (match) => `${match} ${regionName}`
            )
          }

          editBuilder.insert(firstLine.range.start.with(undefined, 0), startRegionDelimiter)
          editBuilder.insert(lastLine.range.end, endRegionDelimiter)
    } else {
      let firstMatch = firstLine.text.match(regionCondition) ?? null
      let lastMatch = lastLine.text.match(regionCondition) ?? null
      if ((firstMatch && lastMatch) && (firstLine.lineNumber != lastLine.lineNumber)) {
        let [upRange, downRange] = getDeleteRanges(document, firstLine.range, lastLine.range)
        editBuilder.delete(upRange)
        editBuilder.delete(downRange)
        return
      }

      let firstEnd = firstMatch?.[0].includes(regionDelimter.start)
      let lastEnd = lastMatch?.[0].includes(regionDelimter.end)
      let upNum = firstLine.lineNumber, downNum = lastLine.lineNumber
      let nextUp = undefined, nextDown = undefined

      while (!(firstEnd && lastEnd)) {
        if (upNum < 0 || downNum === document.lineCount) return
        if (!firstEnd) { upNum -= 1 }
        if (!lastEnd) { downNum += 1 }

        nextUp = document.lineAt(upNum); nextDown = document.lineAt(downNum)
        firstEnd = nextUp.text.includes(regionDelimter.start); lastEnd = nextDown.text.includes(regionDelimter.end)
      }

      if ((firstEnd && nextUp) && (lastEnd && nextDown)) {
        let [upRange, downRange] = getDeleteRanges(document, nextUp.range, nextDown.range)
        editBuilder.delete(upRange)
        editBuilder.delete(downRange)
      }
    }
  }
}

function getDeleteRanges(
  document: vscode.TextDocument,
  lUp: vscode.Range,
  lDown: vscode.Range
) {
  let checkUp = (lUp.start.line-1 >= 0) ? 1 : 0, checkDown = (lDown.start.line+1 <= document.lineCount-1) ? 1 : 0
  let lineUp = document.lineAt(lUp.start.line-checkUp).text, lineDown = document.lineAt(lDown.start.line+checkDown).text
  let upRange = (lineUp === "")
    ? new vscode.Range(lUp.start.line-checkUp, lUp.start.character, lUp.end.line, lUp.end.character) : lUp
  let downRange = (lineDown === "")
    ? new vscode.Range(lDown.start.line, lDown.start.character, lDown.end.line+checkDown, lDown.end.character) : lDown

  return [upRange, downRange]
}

export async function registerMarkCommand() {
  const { activeTextEditor } = vscode.window
  if (!activeTextEditor) return

  const regionName = await vscode.window.showInputBox({ prompt: '(optional)Region Name' })

  const { document } = activeTextEditor
  const languageRegExp = UTIL.execLanguageRegExp(document.languageId)
  const languageDelimiter = UTIL.execLanguageDelimiter(document.languageId)
  if (!languageDelimiter || !languageRegExp) {
    vscode.window.showWarningMessage(
      `[Region Highlighter]: This file language is not supported to mark region.
      visit https://code.visualstudio.com/docs/editor/codebasics#_folding for the currently supported file languags`
    )
    return
  }

  activeTextEditor.edit((editBuilder) => {
    triggerRegionDelimiter( EnumCommands.MARK,editBuilder,activeTextEditor,languageRegExp,languageDelimiter,regionName)
  })
}

export function registerUnMarkCommand() {
  const { activeTextEditor } = vscode.window
  if (!activeTextEditor) return

  const { document } = activeTextEditor
  const languageRegExp = UTIL.execLanguageRegExp(document.languageId)
  const languageDelimiter = UTIL.execLanguageDelimiter(document.languageId)
  if (!languageRegExp || !languageDelimiter) return

  activeTextEditor.edit((editBuilder) => {
    triggerRegionDelimiter(EnumCommands.UNMARK, editBuilder, activeTextEditor, languageRegExp, languageDelimiter)
  })
}