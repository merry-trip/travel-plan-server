// app/utils/appendRows.js
const { google } = require('googleapis');
const auth = require('./auth');
const logger = require('./logger');

const spreadsheetId = process.env.SPREADSHEET_ID_SPOTS;

async function appendRows(rows, sheetName) {
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: rows,
    },
  });

  logger.logInfo('appendRows', `${rows.length} rows appended to sheet: ${sheetName}`);
}

module.exports = appendRows;
