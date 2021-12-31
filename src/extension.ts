import * as vscode from 'vscode'
import throttle from 'lodash.throttle'
import { syncTriggerDecorationRegion } from './core'

export function activate(context: vscode.ExtensionContext) {
  const throttleCallCoreFunction = throttle(syncTriggerDecorationRegion, 500)

  // initial trigger decorate region
  throttleCallCoreFunction()

  vscode.window.onDidChangeActiveTextEditor(() => {
    throttleCallCoreFunction()
  }, null, context.subscriptions)

  vscode.workspace.onDidChangeTextDocument(() => {
    throttleCallCoreFunction()
  }, null, context.subscriptions)

  vscode.workspace.onDidOpenTextDocument(() => {
    throttleCallCoreFunction()
  }, null, context.subscriptions)
}