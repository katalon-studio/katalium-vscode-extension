import * as vscode from "vscode";
import MenuItem from "./MenuItem";

export default class KataMenuViewProvider
  implements vscode.TreeDataProvider<MenuItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<MenuItem | undefined> = new vscode.EventEmitter<MenuItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<MenuItem | undefined> = this._onDidChangeTreeData.event;
  private menuItems = [
    new MenuItem(
      "Start Katalium server",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.startServer",
        title: "Start Katalium server",
      },
      "debug-start.svg"
    ),
    new MenuItem(
      "Stop Katalium server",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.stopServer",
        title: "Stop Katalium server",
      },
      "debug-stop.svg"
    ),
    new MenuItem(
      "Create a new Project",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.createProject",
        title: "Create a new Project",
      },
      "add.svg"
    ),
    new MenuItem(
      "Create a new Test Case",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.createTestCase",
        title: "Create a new Test Case"
      },
      "file-symlink-file.svg"
    ),
    new MenuItem(
      "Create a new Page",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.createPage",
        title: "Create a new Page"
      },
      "file-symlink-file.svg"
    ),
    new MenuItem(
      "Record & Generate Code",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.recordGenerateCode",
        title: "Record & Generate Code"
      },
      "chrome-filled.svg"
    ),
    new MenuItem(
      "Visit Katalon TestOps Dashboard",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.visitKatalonTestOps",
        title: "Visit Katalon TestOps Dashboard"
      },
      "project.svg"
    ),
    new MenuItem(
      "Feedback",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.openRepo",
        title: "Feedback"
      },
      "github-inverted.svg"
    )
  ];

  constructor(private context: vscode.ExtensionContext) {

  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: MenuItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MenuItem): Thenable<MenuItem[]> {
    return Promise.resolve(this.getMenuItems());
  }

  private getMenuItems() {
    return this.menuItems;
  }
}
