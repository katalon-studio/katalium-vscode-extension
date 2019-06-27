import * as vscode from "vscode";
import KataMenuViewProvider from "./views/kataMenu/KataMenu";
import AuthenticatorService from "./services/Authenticator";
import MenuItem from "./views/kataMenu/MenuItem";
import { BaseRunner } from './runners/BaseRunner';
import SigninPanel from "./views/signinPanel/SigninPanel";
import OutPutService from './services/Output';


let statusBarItem : vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  const runner: BaseRunner = new BaseRunner();

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = `$(beaker)`;
  // statusBarItem.command = "kata.signout";
  statusBarItem.show();

  const kataMenuViewProvider = new KataMenuViewProvider(context);
  context.subscriptions.push(vscode.window.registerTreeDataProvider("kataMenu", kataMenuViewProvider));


  context.subscriptions.push(vscode.commands.registerCommand("kata.refreshMenu", () =>
    kataMenuViewProvider.refresh()
  ));
  context.subscriptions.push(vscode.commands.registerCommand("kata.createProject", () => {
    runner.createProject();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.createPage", (node: MenuItem) => {
    runner.createPage();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.createTestCase", (node: MenuItem) => {
    runner.createPage();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.signin", (node: MenuItem) => {
    SigninPanel.createOrShow(context, kataMenuViewProvider);
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.signout", (node: MenuItem) => {

  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.startServer", () => {
    if (!AuthenticatorService.isAuthenticated()) {
      OutPutService.printLine("Please activate to enable this feature");
      vscode.window.showInformationMessage("Please activate to enable this feature");
      return;
    }
    runner.startServer();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.openRepo", () => {
    runner.openRepo();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.stopServer", () => {
    if (!AuthenticatorService.isAuthenticated()) {
      OutPutService.printLine("Please activate to enable this feature");
      vscode.window.showInformationMessage("Please activate to enable this feature");
      return;
    }
    runner.stopServer();
  }));
}

export function deactivate(context: vscode.ExtensionContext) {
  if (SigninPanel.currentPanel) {
    SigninPanel.currentPanel.dispose();
  }
  if(statusBarItem) {
    statusBarItem.dispose();
  }
}
 