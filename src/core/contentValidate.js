/*
  Commmon code to run Content Validation process.
*/
import * as csv from './csvMaker';

export async function contentValidate(rows, header, cvFunction, langId, bookID, resourceCode, validationPriority) {
  console.log("bookID", bookID);
  // first - create a string from the rows 2D array (table)
  let tableString = header;
  for (let i=0; i < rows.length; i++) {
	for (let j=0; j < rows[i].length; j++) {
	  tableString += rows[i][j];
	  if ( j < (rows[i].length - 1) ) {
		tableString += '\t';
	  }
	}
	tableString += '\n';
  }

  // second collect parameters needed by cv package
  /*
  const _name  = targetFile.name.split('_');
  const langId = _name[0];
  const bookID = _name[2].split('-')[1].split('.')[0];
  */
  const rawResults = await cvFunction(langId, resourceCode, bookID.toUpperCase(), 'dummy', tableString, '', {suppressNoticeDisablingFlag: false});
  console.log("rawResults:", rawResults);
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
        String(rowData.extract || ""),
        String(rowData.message),
        String(rowData.location),
      ])
    }
  });

  return data;

}
