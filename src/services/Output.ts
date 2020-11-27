import * as vscode from 'vscode';

export default class {
  private static outputChanel:vscode.OutputChannel = vscode.window.createOutputChannel("Katalium server");
  static show() {
    this.outputChanel.show();
  }
  static printLine(message:string) {
    this.outputChanel.appendLine(message);
  }
  static print(message:string) {
    this.outputChanel.append(message);
  }
}