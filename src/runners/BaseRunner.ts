import {IRunner} from './IRunner';
import * as vscode from "vscode";
import {
  SAMPLE_PROJECT_URL,
  KATA_SERVER_STANALONE_JAR_URL,
  CREATE_PAGE_URL,
  CREATE_TEST_CASE_URL,
  REPO_URL,
  PORT,
  SERVER_JAR_FILE_NAME
} from "../config/common";

const fs = require("fs");
const download = require("download");
const AdmZip = require("adm-zip");
const { exec } = require("child_process");
const portscanner = require("portscanner");
const kill = require("kill-port");
const path = require("path");

export class BaseRunner implements IRunner {
  public createProject(): void {
    if (!vscode.workspace.rootPath) {
      vscode.window.showInformationMessage("Open Workspace folder to start your project.");
      return;
    }
    const items = fs.readdirSync(vscode.workspace.rootPath);
    const isEmptyWorkspce = items.filter((item: String) => !item.startsWith(".")).length === 0;

    if (isEmptyWorkspce) {
      try {
        download(SAMPLE_PROJECT_URL).then((file: any) => {
          const zip = new AdmZip(file);
          zip.getEntries()
            .filter((zipEntry: any) => !zipEntry.isDirectory)
            .forEach((zipEntry: any) => {
              fs.writeFile(path.join(vscode.workspace.rootPath, zipEntry.name),zipEntry.getData(),
                (err: any) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            });
          vscode.window.showInformationMessage("Create project successfully.");
        });
      } catch (e) {
        console.log(e);
      }
      return;
    }
    vscode.window.showInformationMessage("Clean your Workspace folder before creating a new project.");
  }
  public createPage(): void {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(CREATE_PAGE_URL));
  }
  public createTestCase(): void {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(CREATE_TEST_CASE_URL));
  }
  public startServer(): void {
    portscanner.checkPortStatus(PORT, "127.0.0.1", (error: any, status: any) => {
      const serverFilePath = path.join(vscode.workspace.rootPath, SERVER_JAR_FILE_NAME);
      if(status === 'open') {
        vscode.window.showInformationMessage("Port 4444 is aldready in use.");
        return;
      }
      if (fs.existsSync(serverFilePath)) {
        this.executeStartServerCommand();
        return;
      }

      download(KATA_SERVER_STANALONE_JAR_URL).then((file: any) => {
        fs.writeFileSync(
          serverFilePath,
          file
        );
        this.executeStartServerCommand();
      });
    });
  }

  private executeStartServerCommand():void {
    exec(`java -jar ${path.join(vscode.workspace.rootPath, SERVER_JAR_FILE_NAME)}`,
    { maxBuffer : 500 * 1024 },
      (err: any, stdout: any, stderr: any) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(stdout);
    });
    vscode.window.showInformationMessage("Start server successfully!");
  }

  public stopServer(): void {
    portscanner.checkPortStatus(PORT, "127.0.0.1", (error: any, status: any) => {
      if(status === 'open') {
        kill(PORT, "tcp")
          .then(() => vscode.window.showInformationMessage("Stop server successfully!"))
          .catch((error:any) => console.log(error));
      }
    });
  }

  public openRepo(): void {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(REPO_URL));
  }
}