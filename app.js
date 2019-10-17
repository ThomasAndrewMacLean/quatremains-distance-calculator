var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1iGXTpvXXRtZhkcv-G6RY4uFfn-y7_R3LfscYzbct96Y');

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {

  // Get all of the rows from the spreadsheet.
  doc.getRows(1, function (err, rows) {
    const firstEmptyRow = rows.indexOf(rows.find(row => row.name === ""))

    console.log(firstEmptyRow);
  });

});