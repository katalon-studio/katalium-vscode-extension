import {
  AUTHENTICATE_URL,
  SIGUP_URL,
  KA_CREDENTIAL_FILE_NAME
} from "../config/common";

const request = require("request-promise");
const homedir = require("homedir");
const fs = require("fs");
const path = require("path");

export default class {
  static authenticate(username: String, password: String) {
    const clientId = 'kit';
    const clientSecret = 'kit';
    const clientCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const options = {
      method: "POST",
      uri: AUTHENTICATE_URL,
      form: {
        username,
        password,
        grant_type: "password"
      },
      headers: {
        Authorization: `Basic ${clientCredentials}`,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      json: true
    };
    return request(options);
  }
  static isAuthenticated() {
    const homeDirectory = homedir();
    return fs.existsSync(path.join(homeDirectory,'.katalon', KA_CREDENTIAL_FILE_NAME));
  }

  static async signup(username: String, password: String) {
    const token = await this.getTokenRegister();
    const validToken = (token || "").replace(/\n|\r/g, "");

    const options = {
      method: "POST",
      uri: `${SIGUP_URL}?action=katalon_register&register-security=${validToken}`,
      body: JSON.stringify({
        user_email: username,
        user_pass: password,
        action: "katalon_register",
        "register-security": validToken
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    };
    return request(options); 
  }
  private static getTokenRegister() {
    const options = {
      method: "GET",
      uri: `${SIGUP_URL}?action=katalon_token_register`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      json: true
    };
    return request(options); 
  }
}