import {
  CREATE_API_KEY_URL
} from "../config/common";

const request = require("request-promise");

export default class {
  static createApiKey(token: String) {
    const options = {
      method: "POST",
      uri: CREATE_API_KEY_URL,
      headers: {
        Accept: "application/json",
        Authorization: ` Bearer ${token}`
      },
      body: {
        name: "Katalium"
      },
      json: true
    };
    return request(options).then((data:any) => data.key); 
  }
}