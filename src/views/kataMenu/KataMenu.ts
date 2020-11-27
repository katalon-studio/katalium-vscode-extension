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
      "start-server.png"
    ),
    new MenuItem(
      "Stop Katalium server",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.stopServer",
        title: "Stop Katalium server",
      },
      "stop-server.png"
    ),
    new MenuItem(
      "Create Project",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.createProject",
        title: "Create Project",
      },
      "create-project.png"
    ),
    new MenuItem(
      "Create Page",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.createPage",
        title: "Create Page"
      },
      "create-page.png"
    ),
    new MenuItem(
      "Create Test Case",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.createTestCase",
        title: "Create Test Case"
      },
      "create-test-case.png"
    ),
    new MenuItem(
      "Github",
      vscode.TreeItemCollapsibleState.None,
      {
        command: "kata.openRepo",
        title: "Open Github"
      },
      "open-github.png"
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
