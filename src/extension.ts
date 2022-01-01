import * as vscode from 'vscode'
import throttle from 'lodash.throttle'
import { EnumCommands, EnumContributes } from './typings'
import { syncTriggerDecorationRegion } from './core'
import { registerMarkCommand, registerUnMarkCommand } from './command'

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

  const markCommand = vscode.commands.registerCommand(
    `${EnumContributes.PLUGIN_PREFIX}.${EnumCommands.MARK}`,
    () => { registerMarkCommand() }
  )

  const unmarkCommand = vscode.commands.registerCommand(
    `${EnumContributes.PLUGIN_PREFIX}.${EnumCommands.UNMARK}`,
    () => { registerUnMarkCommand() }
  )

  context.subscriptions.push(markCommand, unmarkCommand)
}