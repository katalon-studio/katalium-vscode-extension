import ApiKeyService from './ApiKey';
import { KA_CREDENTIAL_FILE_NAME } from "../config/common";

const homedir = require("homedir");
const fs = require("fs");
const path = require("path");

export default class {
  static async writeKACredentialFile(username: String, token: String) {
    const apiKey = token ? await ApiKeyService.createApiKey(token) : "";
    const data = `KATALON_API_KEY: ${apiKey}\nKATALON_EMAIL: ${username}`;
    const homeDirectory = homedir();
    const katalonPropertiesPath = path.join(homeDirectory, ".katalon");
    if (!fs.existsSync(katalonPropertiesPath)) {
      fs.mkdirSync(katalonPropertiesPath);
    }
    return fs.writeFileSync(path.join(homeDirectory,'.katalon', KA_CREDENTIAL_FILE_NAME), data);
  }
}