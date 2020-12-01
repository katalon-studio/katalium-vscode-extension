import * as vscode from "vscode";
import KataMenuViewProvider from "./views/kataMenu/KataMenu";
import MenuItem from "./views/kataMenu/MenuItem";
import { BaseRunner } from './runners/BaseRunner';

export function activate(context: vscode.ExtensionContext) {
  const runner: BaseRunner = new BaseRunner();

  const kataMenuViewProvider = new KataMenuViewProvider(context);
  context.subscriptions.push(vscode.window.registerTreeDataProvider("kataMenu", kataMenuViewProvider));


  context.subscriptions.push(vscode.commands.registerCommand("kata.refreshMenu", () =>
    kataMenuViewProvider.refresh()
  ));
  context.subscriptions.push(vscode.commands.registerCommand("kata.startServer", () => {
    runner.startServer();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.stopServer", () => {
    runner.stopServer();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.createProject", () => {
    runner.createProject();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.createPage", (node: MenuItem) => {
    runner.createPage();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.createTestCase", (node: MenuItem) => {
    runner.createTestCase();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.recordGenerateCode", () => {
    runner.recordGenerateCode();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.visitKatalonTestOps", () => {
    runner.visitKatalonTestOps();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("kata.openRepo", () => {
    runner.openRepo();
  }));
}

export function deactivate(context: vscode.ExtensionContext) {
}
 