var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1iGXTpvXXRtZhkcv-G6RY4uFfn-y7_R3LfscYzbct96Y');

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {

  // Get all of the rows from the spreadsheet.
  doc.getRows(1, function (err, rows) {
    console.log(rows);
  });

  var newRow = {
    name: 'thomasmaclean',
    email: 'thomas@macelan.be',
    address: 'zandloperstraat',
    piano: "white",
    distance:6.7,
    date: Date.now(),
};
doc.addRow(1, newRow, function(err) {
    if (err) {
        console.log(err);
    }
    return newRow;
});

});