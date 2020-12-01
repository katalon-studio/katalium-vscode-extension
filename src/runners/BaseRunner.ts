import {IRunner} from './IRunner';
import * as vscode from "vscode";
import {
  SAMPLE_PROJECT_URL,
  KATA_SERVER_STANDALONE_JAR_URL,
  CREATE_PAGE_URL,
  CREATE_TEST_CASE_URL,
  RECORD_GENERATE_CODE_URL,
  KATALON_TESTOPS_URL,
  REPO_URL,
  PORT,
  SERVER_JAR_FILE_NAME
} from "../config/common";
import OutputService from "../services/Output";

const fs = require("fs-extra");
const download = require("download");
const AdmZip = require("adm-zip");
const { spawn } = require("child_process");
const portscanner = require("portscanner");
const { kill } = require("cross-port-killer");
const homeDir = require("homedir")();
const path = require("path");

const serverFilePath = path.join(homeDir, ".katalon", SERVER_JAR_FILE_NAME);

export class BaseRunner implements IRunner {
  public createProject(): void {
    if (!vscode.workspace.rootPath) {
      OutputService.printLine("Open Workspace folder to start your project.");
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
              fs.outputFile(path.join(vscode.workspace.rootPath, zipEntry.entryName),zipEntry.getData(),
                (err: any) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            });
          OutputService.printLine("Create project successfully!");
          vscode.window.showInformationMessage("Create project successfully!");
        });
      } catch (e) {
        console.log(e);
      }
      return;
    }
    vscode.window.showInformationMessage("Clean your Workspace folder before creating a new project.");
    OutputService.printLine("Clean your Workspace folder before creating a new project.");
  }
  public createPage(): void {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(CREATE_PAGE_URL));
  }
  public createTestCase(): void {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(CREATE_TEST_CASE_URL));
  }
  public recordGenerateCode(): void {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(RECORD_GENERATE_CODE_URL));
  }
  public visitKatalonTestOps(): void {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(KATALON_TESTOPS_URL));
  }
  public startServer(): void {
    OutputService.show();
    portscanner.checkPortStatus(PORT, "127.0.0.1", (error: any, status: any) => {
      if(status === 'open') {
        OutputService.printLine("Port 4444 is already in use.");
        vscode.window.showInformationMessage("Port 4444 is already in use.");
        return;
      }
      if (fs.existsSync(serverFilePath)) {
        this.executeStartServerCommand();
        return;
      }
      OutputService.printLine("Downloading Katalium server...");
      download(KATA_SERVER_STANDALONE_JAR_URL).then((file: any) => {
        fs.outputFileSync(
          serverFilePath,
          file
        );
        this.executeStartServerCommand();
      });
    });
  }

  private executeStartServerCommand():void {
    var child = spawn('java', ['-jar', serverFilePath, '-port', '4444'], {stdio: ['ignore', null, null]});
    child.stdout.on("data", (data: any) => {
      OutputService.printLine(data);
    });

    child.stderr.on("data", (data: any) => {
      OutputService.printLine(data);
    });

    child.on("close", (code: any) => {
      console.log(`child process exited with code ${code}`);
    });
    OutputService.printLine("Start server successfully!");
    vscode.window.showInformationMessage("Start server successfully!");
  }

  public stopServer(): void {
    OutputService.show();
    portscanner.checkPortStatus(PORT, "127.0.0.1", (error: any, status: any) => {
      if(status === 'open') {
        kill(PORT)
          .then(() => {
            OutputService.printLine("Stop server successfully!");
            vscode.window.showInformationMessage("Stop server successfully!");
          }).catch((error: any) => console.log(error));
      }
    });
  }

  public openRepo(): void {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(REPO_URL));
  }
}