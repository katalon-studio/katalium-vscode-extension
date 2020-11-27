import * as vscode from "vscode";
import * as path from "path";

export default class MenuItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public readonly iconName: string = ''
  ) {
    super(label, collapsibleState);
  }

  iconPath = {
    light: path.join(
      __filename,
      "..",
      "..",
      "..",
      "..",
      "resources",
      "light",
      this.iconName
    ),
    dark: path.join(
      __filename,
      "..",
      "..",
      "..",
      "..",
      "resources",
      "dark",
      this.iconName
    )
  };
}
