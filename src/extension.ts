import * as vscode from 'vscode'
import throttle from 'lodash.throttle'
import { syncTriggerDecorationRegion } from './core'

export function activate(context: vscode.ExtensionContext) {
  const throttleWrapper = throttle(syncTriggerDecorationRegion, 500)

  // initial trigger decorate region
  throttleWrapper()

  vscode.window.onDidChangeActiveTextEditor(() => {
    throttleWrapper()
  }, null, context.subscriptions)

  vscode.workspace.onDidChangeTextDocument(() => {
    throttleWrapper()
  }, null, context.subscriptions)

  vscode.workspace.onDidOpenTextDocument(() => {
    throttleWrapper()
  }, null, context.subscriptions)
}