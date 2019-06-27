import * as vscode from 'vscode';
import KataMenuViewProvider from '../kataMenu/KataMenu';
import AuthenticatorService from '../../services/Authenticator';
import CredentialService from "../../services/Credential";

export default class SigninPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: SigninPanel | undefined;

  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(context: vscode.ExtensionContext, kataMenuViewProvider: KataMenuViewProvider) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;
    if (SigninPanel.currentPanel) {
      SigninPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "SigninPanel",
      "Activate",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );

    SigninPanel.currentPanel = new SigninPanel(panel, context, kataMenuViewProvider);
  }

  private constructor(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext,
    kataMenuViewProvider: KataMenuViewProvider
  ) {
      // Listen for when the panel is disposed
      // This happens when the user closes the panel or when the panel is closed programatically
      this._panel = panel;
      this._panel.onDidDispose(
        () => this.dispose(),
        null,
        this._disposables
      );
      this._panel = panel;
      this._panel.webview.html = this.getWebviewContent();
      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        message => {
          switch (message.command) {
            case "authenticate": {
              const username:String = message.username;
              const password:String = message.password;
              if (!username || !password) {
                vscode.window.showInformationMessage("Please enter email and password");
              }
              AuthenticatorService.authenticate(username, password).then((data:any) => {
                const token = data.access_token;
                CredentialService.writeKACredentialFile(username, token).then(() => {
                  kataMenuViewProvider.refresh();
                  panel.dispose();
                });     
              }).catch((error:any) => {
                if(error.statusCode === 401 || error.statusCode === 400) {
                  vscode.window.showInformationMessage("Invalid username or password");
                  return;
                }
                CredentialService.writeKACredentialFile(username, '').then(() => {
                  kataMenuViewProvider.refresh();
                  panel.dispose();
                }); 
              });
            }
          }
        },
        undefined,
        context.subscriptions
      );
    }

  private getWebviewContent() {
    return `<!DOCTYPE html>
          <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Signin</title>
            </head>
            <body>
              <form class="container" onsubmit="authenticate()">
                <h3 class="header">Please enter your Katalon username and password to enable this feature.</h3>
                <div class="block">
                  <label class="input-label">Email</label> <br/><br/>
                  <input class="username" id="username" type="text" width="300px"/> 
                </div>
                <div class="block">
                  <label class="input-label">Password</label> <br/><br/>
                  <input class="password" id="password" type="password" width="300px"/>
                </div>
                <div class="footer">
                  <button type="submit" class="btn btn-signin" id="btn-signin">Sign in</button>
                  <a href="https://www.katalon.com/create-account/" class="signup-link" id="btn-signup">Don't have an account?</a>
                </div>
              </form>
                <script>
                  const vscode = acquireVsCodeApi();
                  (function init() {
                    document.vscode = vscode;
                  })();
                </script>
                <script>
                  function authenticate() {
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                    document.vscode.postMessage({command: 'authenticate',username: username, password: password})
                  }
                  function signup() {
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                    document.vscode.postMessage({command: 'signup',username: username, password: password})
                  }
                </script>
            </body>
            <style>
              .container {
                padding-left: 20px;
              }
              .header {
                margin-top: 20px;
                margin-bottom: 20px;
                color: #AAAEB3;
                font-size: 14px;
                font-weight: normal;
              }
              .block {
                margin-bottom: 20px;
              }
              .username, .password {
                background-color: rgba(194,199,203,0.2); 
                border-radius: 24px; 
                height: 38px; 
                width: 300px; 
                border:none; 
                font-size: 16px;
                padding-left: 20px
              }
              input:focus
                border:none;
              }
              .input-label {
                font-size: 14px;
                display: inline;
                margin-bottom 10px;
                color: #98A5B3;
              }
              .btn {
                box-shadow: 0 0 10px 0 rgba(0,0,0,0.5);
                border-radius: 20px;
                width: 120px;
                height: 40px;
                font-size: 14px;
                font-weight: 500;
                border:none;
                cursor: pointer
              }
              .footer {
                margin-top: 20px;
              }
              .btn-signin {
                background-color: #00A9FF;
                color: #FFFFFF;
              }
              .btn-signup {
                background-color: #E6E6E6;
                color: #98A5B3;
                margin-left: 15px;
              }
              .signup-link {
                color: #00A9FF;
                font-size: 14px;
                font-weight: 500;
                margin-left: 15px;
                text-decoration: none;
              }
              body.vscode-light .username, body.vscode-light .password {
                color: #616466;
              }
              body.vscode-dark .username, body.vscode-dark .password {
                color: #C2C7CC;
              }
            </style>
          </html>`;
  }

  public dispose() {
    SigninPanel.currentPanel = undefined;
    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const panel = this._disposables.pop();
      if (panel) {
        panel.dispose();
      }
    }
  }

}
