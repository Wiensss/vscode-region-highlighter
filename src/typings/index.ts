import * as vscode from 'vscode'

export type positionStack = {
  startPos: vscode.Position
  endPos: vscode.Position | null
}

export interface position extends positionStack {
  endPos: vscode.Position
}

export interface decoratePosition {
  style: vscode.TextEditorDecorationType
  range: vscode.DecorationOptions[]
}

export type regionStyle = {
  label: string
  color: string
}