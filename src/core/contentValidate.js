/*
  Commmon code to run Content Validation process.
*/
import * as csv from './csvMaker';
import * as tsvParser from 'uw-tsv-parser';

export async function contentValidate(rows, header, cvFunction, langId, bookID, 
  resourceCode, validationPriority, checkingOptions) {
  // first - create a string from the rows 2D array (table)
  let tableString = header;
  const tsvObject = tsvParser.tableToTsvString(rows);
  tableString += tsvObject.data;

  // second run the cv API
  const rawResults = await cvFunction(langId, resourceCode, bookID.toUpperCase(), 
    'dummy', tableString, '', 
    {suppressNoticeDisablingFlag: false, ...checkingOptions}
  );
  const nl = rawResults.noticeList;
  let hdrs =  ['Priority','Chapter','Verse','Line','Row ID','Details','Char Pos','Excerpt','Message','Location'];
  let data = [];
  data.push(hdrs);
  let inPriorityRange = false;
  Object.keys(nl).forEach ( key => {
    inPriorityRange = false; // reset for each
    const rowData = nl[key];
    if ( validationPriority === 'med' && rowData.priority > 599 ) {
      inPriorityRange = true;
    } else if ( validationPriority === 'high' && rowData.priority > 799 ) {
      inPriorityRange = true;
    } else if ( validationPriority === 'low' ) {
      inPriorityRange = true;
    }
    if ( inPriorityRange ) {
      csv.addRow( data, [
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
