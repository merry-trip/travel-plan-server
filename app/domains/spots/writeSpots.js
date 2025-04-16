// app/domains/spots/writeSpots.js
const { validateSpot } = require('./validateSpot');
const { mapSpotToRow } = require('./rowMapper');
const appendRows = require('../../utils/appendRows');
const logger = require('../../utils/logger');

const SHEET_NAME = 'spots';
const context = 'writeSpots';

async function writeSpots(spots) {
  try {
    if (!Array.isArray(spots)) {
      throw new Error('Input must be an array of spot objects');
    }

    const rows = [];

    for (const spot of spots) {
      validateSpot(spot);
      const row = mapSpotToRow(spot);
      rows.push(row);
    }

    await appendRows(rows, SHEET_NAME);
    logger.logInfo(context, `${rows.length} spot(s) written successfully`);
  } catch (err) {
    logger.logError(context, `Failed to write multiple spots: ${err.message}`);
    throw err;
  }
}

module.exports = {
  writeSpots,
};
