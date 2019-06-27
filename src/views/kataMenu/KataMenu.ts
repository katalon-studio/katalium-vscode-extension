import * as vscode from "vscode";
import MenuItem from "./MenuItem";
import AuthenticatorService from '../../services/Authenticator';

export default class KataMenuViewProvider
  implements vscode.TreeDataProvider<MenuItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<MenuItem | undefined> = new vscode.EventEmitter<MenuItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<MenuItem | undefined> = this._onDidChangeTreeData.event;
  private menuItems = [
    new MenuItem("Create Project", vscode.TreeItemCollapsibleState.None, 
      {
        command: "kata.createProject",
        title: "Create Project",
      }, "create-project.png"),
    new MenuItem("Create Page", vscode.TreeItemCollapsibleState.None, {
      command: "kata.createPage",
      title: "Create Page"
    }, "create-page.png"),
    new MenuItem("Create Test Case", vscode.TreeItemCollapsibleState.None, {
      command: "kata.createTestCase",
      title: "Create Test Case"
    }, "create-test-case.png"),
     new MenuItem("Github", vscode.TreeItemCollapsibleState.None, {
      command: "kata.openRepo",
      title: "Open Github"
    }, "open-github.png")
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
    if(AuthenticatorService.isAuthenticated()) {
      return this.menuItems;
    }
    return [
      new MenuItem("Activate", vscode.TreeItemCollapsibleState.None, {
        command: "kata.signin",
        title: "Activate"
      }, "activate.png")
    ];
  }
}
