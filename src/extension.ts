'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {TextDocument, Uri} from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let angularExtensions: string[] = ['ts', 'html', 'css', 'scss'];
export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onDidOpenTextDocument(
      (file: any) => {openRelevantFiles(file)});
  let cmdOpen =
      vscode.commands.registerCommand('angularFileLoader.open', () => {
        vscode.workspace.openTextDocument().then(file => {
          openRelevantFiles(file);
        });
      });
  context.subscriptions.push(cmdOpen);
}

export function openRelevantFiles(file: TextDocument) {
  // get the extension
  let ext = file.fileName.split('.').pop();
  // if the extension is not in the specified files to open, return
  if (angularExtensions.indexOf(ext) === -1) {
    return;
  }
  let relatedFiles =
      file.fileName.substr(0, file.fileName.length - ext.length) + '*';
  let relativeRelatedFiles = vscode.workspace.asRelativePath(relatedFiles);
  console.log(relativeRelatedFiles)
  vscode.workspace.findFiles(relativeRelatedFiles).then((files: Uri[]) => {
    files.forEach((f: Uri) => {
      if (angularExtensions.indexOf(f.path.split('.').pop()) !== -1) {
        vscode.workspace.openTextDocument(f).then((document: TextDocument) => {
          vscode.window.showTextDocument(document).then(() => {
            console.log('FILE OPENED!', f.fsPath);
          });
        })
      }
    });
  })
}