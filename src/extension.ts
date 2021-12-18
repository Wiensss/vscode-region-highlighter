import * as vscode from 'vscode'
import { syncTriggerDecorationRegion } from './core'

export function activate(context: vscode.ExtensionContext) {
  // initial trigger decorate region
  syncTriggerDecorationRegion(vscode.window.activeTextEditor)

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    syncTriggerDecorationRegion(editor)
  }, null, context.subscriptions)

  vscode.workspace.onDidChangeTextDocument(() => {
    syncTriggerDecorationRegion(vscode.window.activeTextEditor)
  }, null, context.subscriptions)
}
