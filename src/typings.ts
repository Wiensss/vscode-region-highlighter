import * as vscode from 'vscode'

export enum EnumLanguage {
  C = 'c',
  R = 'r',
  GO = 'go',
  BAT = 'bat',
  PHP = 'php',
  SQL = 'sql',
  CPP = 'cpp',
  VUE = 'vue',
  CSS = 'css',
  LESS = 'less',
  SCSS = 'scss',
  DART = 'dart',
  PERL = 'perl',
  JAVA = 'java',
  HTML = 'html',
  RUST = 'rust',
  RUBY = 'ruby',
  SWIFT = 'swift',
  FSHARP = 'fsharp',
  CSHARP = 'csharp',
  PYTHON = 'python',
  JREACT = 'javascriptreact',
  TREACT = 'typescriptreact',
  MARKDOWN = 'markdown',
  POWERSHELL = 'powershall',
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  VISUAL_BASIC = 'vb',
  COFFEESCRIPT = 'coffeescript',
}

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