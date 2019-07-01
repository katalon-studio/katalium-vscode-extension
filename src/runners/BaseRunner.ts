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
import OutPutService from "../services/Output";

const fs = require("fs-extra");
const download = require("download");
const AdmZip = require("adm-zip");
const { exec } = require("child_process");
const portscanner = require("portscanner");
const { kill } = require("cross-port-killer");
const homeDir = require("homedir")();
const path = require("path");

const serverFilePath = path.join(homeDir, ".katalon", SERVER_JAR_FILE_NAME);

export class BaseRunner implements IRunner {
  public createProject(): void {
    if (!vscode.workspace.rootPath) {
      OutPutService.printLine("Open Workspace folder to start your project.");
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
              fs.writeFile(path.join(vscode.workspace.rootPath, zipEntry.entryName),zipEntry.getData(),
                (err: any) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            });
          OutPutService.printLine("Create project successfully!");
          vscode.window.showInformationMessage("Create project successfully!");
        });
      } catch (e) {
        console.log(e);
      }
      return;
    }
  }
  public createPage(): void {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(CREATE_PAGE_URL));
  }
  public createTestCase(): void {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(CREATE_TEST_CASE_URL));
  }
  public startServer(): void {
    portscanner.checkPortStatus(PORT, "127.0.0.1", (error: any, status: any) => {
      if(status === 'open') {
        OutPutService.printLine("Port 4444 is aldready in use.");
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
    exec(`java -jar ${serverFilePath}`,
    { maxBuffer : 500 * 1024 },
      (err: any, stdout: any, stderr: any) => {
        if (err) {
          console.log(err);
          return;
        }
        OutPutService.printLine(stdout);
        OutPutService.printLine(stderr);
    });
    OutPutService.printLine("Start server successfully!");
    vscode.window.showInformationMessage("Start server successfully!");
  }

  public stopServer(): void {
    portscanner.checkPortStatus(PORT, "127.0.0.1", (error: any, status: any) => {
      if(status === 'open') {
        kill(PORT)
          .then(() => {
            OutPutService.printLine("Stop server successfully!");
            vscode.window.showInformationMessage("Stop server successfully!");
          }).catch((error: any) => console.log(error));
      }
    });
  }

  public openRepo(): void {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(REPO_URL));
  }
}