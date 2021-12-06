import * as readline from "readline"
import * as Utils from "../lib/Utils"

const {google} = require('googleapis')
import * as fs from "fs"
import {APIEndpoint} from "googleapis-common"
import {Exception} from "../lib/Exception";
import {hash} from "../lib/Utils";


export namespace Google {

    import oAuth2Client = Google.Sheets.oAuth2Client;
    export namespace Sheets {
        const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
        const clientSecret = "XHbb6Xszk1TAsP0rzbeSLt-6"
        const clientId = "374434631960-if8itp3dq659puncverhti499906ufd9.apps.googleusercontent.com"
        export const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, "http://localhost:8080")

        async function getAuthorizationCode(): Promise<string> {
            let code = ""
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            })
            console.log('Authorize this app by visiting this url:', authUrl)

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })

            rl.question("Enter code: ", answer => {
                code = answer
                rl.close()
            })

            while (code == "") await Utils.delay(1000)

            return code
        }

        export async function getAccessCredentials() {
            try {
                const savedTokens = fs.readFileSync('credentials.json')
                const tokens = JSON.parse(savedTokens.toString())
                oAuth2Client.setCredentials(tokens)
            } catch (error) {
                try {
                    const code: string = await getAuthorizationCode()
                    const credentials = await oAuth2Client.getToken(code)
                    oAuth2Client.setCredentials(credentials.tokens)
                    fs.writeFileSync("credentials.json", JSON.stringify(credentials.tokens))
                } catch (error) {
                    console.log("autorize error", error)
                }
            }
            return oAuth2Client
        }

        async function initMetadata(sheet: Sheet): Promise<void> {
            try {
                const sheets: APIEndpoint = google.sheets({version: 'v4', oAuth2Client})
                await sheets.spreadsheets.batchUpdate({
                    spreadsheetId: sheet.id,
                    resource: {
                        requests: [{
                            createDeveloperMetadata: {
                                developerMetadata: {
                                    metadataId: hash("title"),
                                    metadataKey: "title",
                                    metadataValue: sheet.title,
                                    location: {
                                        spreadsheet: true
                                    },
                                    visibility: "DOCUMENT"
                                }
                            }
                        }]
                    },
                    auth: oAuth2Client
                })

            } catch (error) {
                throw new InitMetadataException(sheet, error)
            }
        }

        export async function createSheet(): Promise<Sheet> {
            const sheets: APIEndpoint = google.sheets({version: 'v4', oAuth2Client})
            const response = await sheets.spreadsheets.create({
                auth: oAuth2Client
            })
            const sheet = new Sheet(sheets, response.data.spreadsheetId, response.data.spreadsheetUrl, response.data.properties.title)
            //initMetadata(sheet)
            return sheet
        }

        export async function getSheet<T extends Sheet>(id: string, type: { new(sheets: APIEndpoint, id: string, url: string, title: string): T}): Promise<T> {
            const sheets: APIEndpoint = google.sheets({version: 'v4', oAuth2Client})
            const response = await sheets.spreadsheets.get({
                spreadsheetId: id,
                auth: oAuth2Client
            })
            const sheet = new type(sheets, response.data.spreadsheetId, response.data.spreadsheetUrl, response.data.properties.title)
            //initMetadata(sheet)
            return sheet
        }

        class InitMetadataException extends Exception {
            constructor(sheet: Sheet, error: string) {
                super(`initMetadata(${sheet} ${error}`)
            }
        }
    }

    export namespace Sheet {

    }

    export class Sheet {
        id: string
        url: string
        title: string
        private sheets: APIEndpoint

        constructor(sheets: APIEndpoint, id: string, url: string, title: string) {
            this.id = id
            this.url = url
            this.title = title
            this.sheets = sheets
        }

        protected async updateRows(cell: string, values: Array<Array<string>>) {
            try {
                const valueRange = {
                    "range": cell,
                    "values": values
                }
                await this.sheets.spreadsheets.values.update({
                    auth: Sheets.oAuth2Client,
                    spreadsheetId: this.id,
                    valueInputOption: "USER_ENTERED",
                    range: valueRange.range,
                    resource: valueRange
                })
            } catch (error) {
                throw new Sheet.UpdateRowsException(this, cell, values, error)
            }

        }

        protected async updateCols(cell: string, values: Array<Array<string>>) {
            try {
                const valueRange = {
                    "range": cell,
                    "values": values,
                    "majorDimension": "COLUMNS"
                }
                await this.sheets.spreadsheets.values.update({
                    auth: Sheets.oAuth2Client,
                    spreadsheetId: this.id,
                    valueInputOption: "USER_ENTERED",
                    range: valueRange.range,
                    resource: valueRange
                })
            } catch (error) {
                throw new Sheet.UpdateColsException(this, cell, values, error)
            }
        }

        protected async getValue(namedRange: string): Promise<Array<Array<string>>> {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.id,
                range: namedRange,
                auth: Sheets.oAuth2Client
            })
            return response.data.values
        }

        static Exception = class extends Exception {
            constructor(sheet: Sheet, method: string, error: string) {
                super(`Sheet: ${sheet.url}, method: ${method}, error: ${error}`)
            }
        }

        static UpdateRowsException = class extends Sheet.Exception {
            constructor(sheet: Sheet, cell: string, values: Array<Array<string>>, error: string) {
                super(sheet, `updateRows(${cell})`, error)
            }
        }

        static UpdateColsException = class extends Sheet.Exception {
            constructor(sheet: Sheet, cell: string, values: Array<Array<string>>, error: string) {
                super(sheet, `updateCols(${cell})`, error)
            }
        }
    }
}
