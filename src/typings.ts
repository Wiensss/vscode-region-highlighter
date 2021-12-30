import * as vscode from 'vscode'

export enum EnumContributes {
  IGNORE_FLAG = 'ignoreFlag',
  BORDER_WIDTH = 'borderWidth',
  BORDER_STYLE = 'borderStyle',
  CUSTOM_THEME = 'customTheme',
  PLUGIN_PREFIX = 'regionHighlighter',
  DEFAULT_COLOR = 'defaultColor',
  DEFAULT_THEME = 'defaultTheme',
  TRIGGER_DELAY = 'triggerDelay',
  DECORATION_STYLE = 'decorationStyle',
  ALLOW_LANGUAGE_IDS = 'allowLanguageIDs',
  EXTRA_COLOR_STRATEGY = 'extraColorStrategy'
}

export enum EnumDecorationStyle {
  BORDER = 'border',
  BACKGROUND = 'background',
}

export enum EnumBorderStyle {
  SOLID = 'solid',
  DASHED = 'dashed',
  DOTTED = 'dotted',
  DOUBLE = 'double',
  GROOVE = 'groove'
}

export enum EnumDefaultTheme {
  RAINBOW = 'Rainbow',
  MORANDI = 'Morandi',
  DAY3024 = 'Day3024',
  CUSTOM_THEME = 'Custom Theme',
  DEFAULT_COLOR = 'Default Color',
}

export enum EnumExtraColorStrategy {
  DEFAULT_COLOR = 'Default Color',
  CUSTOM_THEME_LAST_COLOR = 'Custom Theme Last Color',
  CUSTOM_THEME_FIRST_COLOR = 'Custom Theme First Color',
}

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

export type customTheme = Array<regionStyle | string>

export type positionStack = {
  isIgnore: boolean
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

export interface decorationConfig {
  defaultTheme: regionStyle[]
  decorationStyle: string
  isDefaultColorTheme: boolean
  borderStyle?: string
  borderWidth?: string
}