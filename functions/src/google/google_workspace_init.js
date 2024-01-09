const fs = require("fs");
const readline = require("readline");
const {google} = require("googleapis");
const {extensionX} = require("../admin/extensionToMimeType");
google.options({http2: true});

// If modifying these scopes, delete tokenGoogleWorkSpace.json.
const SCOPES = [
  "https://mail.google.com",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/postmaster.readonly",
];
// The file tokenGoogleWorkSpace.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_DRIVE_PATH = "tokenGoogleWorkSpace.json";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return Promise.reject(new Error(`Error loading client secret file. ${err.code}: ${err.message}`));
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), uploadFile);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  // eslint-disable-next-line camelcase
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    // eslint-disable-next-line camelcase
    client_id, client_secret, redirect_uris[1]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_DRIVE_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_DRIVE_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_DRIVE_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function uploadFile(auth) {
  const drive = google.drive({version: "v3", auth});
  const fileMetadata = {
    "name": " INIT", // "entities" folder init id 1hDjupFR5Znyq8CoM34kSO17T3VvGq4ct
    "mimeType": extensionX.folder,
  };
  drive.files.create({
    resource: fileMetadata,
    fields: "id",
  }, (err, file) => {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log(file);
    }
  });
}

