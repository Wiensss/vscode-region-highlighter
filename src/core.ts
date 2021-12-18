import * as vscode from 'vscode'
import {
 positionStack, position, decoratePosition 
} from './typings'
import { DEFAULT_REGION_STYLES } from './config'
import { getRegionStyleColor, getLanguageRegionRegExp } from './util'

let regionStyles: vscode.TextEditorDecorationType[] = []

/**
 * get the region array of successful matches,
 * and convert into a interface<position> data structure
 */
function getMatchedRegions(document: vscode.TextDocument, regexp: RegExp): position[] {
  const matchResult = document.getText().matchAll(regexp)
  let positionStacks = [...matchResult].reduce((prev: positionStack[], next: RegExpMatchArray) => {
    if (next[0].includes(next[1])) {
      prev.push({
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
function getDecoratedRegions(positions: position[]) {
  return positions.reduce((prev: decoratePosition[], next: position, index: number) => {
    const regionStyle = vscode.window.createTextEditorDecorationType({
      isWholeLine: true,
      backgroundColor: getRegionStyleColor(DEFAULT_REGION_STYLES, index)
    })
    prev.push({
      style: regionStyle,
      range: [{ range: new vscode.Range(next.startPos, next.endPos) }]
    })
    return prev
  }, [])
}

function resetDecorations() {
  regionStyles.forEach((item: vscode.TextEditorDecorationType) => {
    item.dispose()
  })
  regionStyles = []
}

export function syncTriggerDecorationRegion(editor?: vscode.TextEditor) {
  if (!editor) return
  
  // aviod region rendering overlap
  resetDecorations()

  const { document } = editor
  const languageRegExp = getLanguageRegionRegExp(document.languageId)

  if (!languageRegExp) return
  const regionPositions = getMatchedRegions(document, languageRegExp)
  
  if (regionPositions.length !== 0) {
    const regionDecorates = getDecoratedRegions(regionPositions)
    // re-maintain region rendering stack
    regionStyles = regionDecorates.map((item) => item.style)
    regionDecorates.forEach((item) => {
      editor.setDecorations(item.style, item.range)
    })
  }
}