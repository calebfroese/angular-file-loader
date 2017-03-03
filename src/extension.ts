'use strict';
import * as vscode from 'vscode';
import {TextDocument, Uri} from 'vscode';

let angularExtensions: string[] = ['ts', 'html', 'css', 'scss'];
export function activate(context: vscode.ExtensionContext) {
  let cmdOpen =
      vscode.commands.registerCommand('angularFileLoader.open', () => {
        let activeDocument: TextDocument =
            vscode.window.activeTextEditor.document;
        openRelevantFiles(getPath(activeDocument));
      });
  context.subscriptions.push(cmdOpen);
}

export function getPath(file: TextDocument) {
  // Get the file extension
  let ext = file.fileName.split('.').pop();
  // If the extension is not in the specified files to open, return
  if (angularExtensions.indexOf(ext) === -1) {
    return;
  }
  // Path in which similar named files will be named e.g.
  // `/src/app/home/home.component.*` if `home.component.ts` is opened
  let relatedFiles =
      file.fileName.substr(0, file.fileName.length - ext.length) + '*';
  return vscode.workspace.asRelativePath(relatedFiles);
}
export function openRelevantFiles(fileString: string) {
  // Iterate through relevant files and open them if they are within the set
  // extensions
  vscode.workspace.findFiles(fileString).then((files: Uri[]) => {
    files.forEach((f: Uri) => {
      if (angularExtensions.indexOf(f.path.split('.').pop()) !== -1) {
        openFile(f);
      }
    });
  })
}
export function openFile(uri: Uri) {
  // opens a file by its uri to the window
  vscode.workspace.openTextDocument(uri).then((document: TextDocument) => {
    vscode.window.showTextDocument(document);
  })
}