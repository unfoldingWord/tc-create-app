/*
  Commmon code to run Content Validation process.
*/
import * as csv from './csvMaker';
import * as tsvParser from 'uw-tsv-parser';

function processNoticeList(notices, validationPriority) {
  let hdrs = ['Priority', 'Chapter', 'Verse', 'Line', 'Row ID', 'Details', 'Char Pos', 'Excerpt', 'Message', 'Location'];
  let data = [];
  data.push(hdrs);
  let inPriorityRange = false;
  Object.keys(notices).forEach(key => {
    inPriorityRange = false; // reset for each
    const rowData = notices[key];
    if (validationPriority === 'med' && rowData.priority > 599) {
      inPriorityRange = true;
    } else if (validationPriority === 'high' && rowData.priority > 799) {
      inPriorityRange = true;
    } else if (validationPriority === 'low') {
      inPriorityRange = true;
    }
    if (inPriorityRange) {
      csv.addRow(data, [
        String(rowData.priority),
        String(rowData.C),
        String(rowData.V),
        String(rowData.lineNumber),
        String(rowData.rowID),
        String(rowData.fieldName || ""),
        String(rowData.characterIndex || ""),
        String(rowData.excerpt || ""),
        String(rowData.message),
        String(rowData.location),
      ])
    }
  });

  return data;
}


/*
  The TSV function signatures all resemble this one:
  export async function checkSN_TSV7Table(username, languageCode, bookID, filename, tableText, checkingOptions)

  The two Markdown function signatures resemble this one:
  export async function checkTW_markdownArticle(username, languageCode, articleFilepathInRepo, articleFileContent, checkingOptions)

*/

export async function contentValidateTSV(rows, header, username, langId, bookID, filename, cvFunction, options, validationPriority) {
  // first - create a string from the rows 2D array (table)
  let tableString = header;
  const tsvObject = tsvParser.tableToTsvString(rows);
  tableString += tsvObject.data;

  // second run the cv API
  // const rawResults = await cvFunction(langId, resourceCode, bookID.toUpperCase(), 
  //   'dummy', tableString, '', 
  //   {suppressNoticeDisablingFlag: false, ...checkingOptions}
  // );
  // default checking options are fine in the wrapper functions
  const rawResults = await cvFunction(username, langId, bookID, filename, tableString, options)
  const nl = rawResults.noticeList;
  let data = processNoticeList(nl, validationPriority);
  return data;
}
