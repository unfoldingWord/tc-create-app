import * as cv from 'uw-content-validation';
import * as csv from '../core/csvMaker';

export const prepareDataForValidation = ({
  targetFileName,
  targetContent,
  delimiters,
  rows,
}) => {
  // sample name: en_tn_08-RUT.tsv
  // NOTE! the row data on-screen, in-memory does NOT include
  // the headers. So the initial value of tsvRows will be
  // the headers.
  const _name = targetFileName.split('_');
  const langId = _name[0];
  const bookId = _name[2].split('-')[1].split('.')[0];
  let tsvString = targetContent.substring(0, targetContent.indexOf(delimiters.row));

  tsvString = tsvString + rows.map((cells) => cells.join(delimiters.cell)).join(delimiters.row);
  return {
    langId,
    bookId,
    tsvString,
  };
};

export const onValidate = async ({
  targetFileName,
  targetContent,
  delimiters,
  organization,
  validationPriority,
  rows,
}) => {
  let validationResultData = [];

  if (targetFileName && targetContent && rows) {
    const {
      langId,
      bookId,
      tsvString,
    } = prepareDataForValidation({
      targetFileName,
      targetContent,
      delimiters,
      rows,
    });
    const rawResults = await cv.checkDeprecatedTN_TSV9Table(organization.username, langId, bookId, targetFileName, tsvString, { suppressNoticeDisablingFlag: false });
    const nl = rawResults.noticeList;
    let hdrs = ['Priority', 'Chapter', 'Verse', 'Line', 'Row ID', 'Details', 'Char Pos', 'Excerpt', 'Message', 'Location'];

    validationResultData.push(hdrs);
    let inPriorityRange = false;

    Object.keys(nl).forEach(key => {
      inPriorityRange = false; // reset for each
      const rowData = nl[key];

      if (validationPriority === 'med' && rowData.priority > 599) {
        inPriorityRange = true;
      } else if (validationPriority === 'high' && rowData.priority > 799) {
        inPriorityRange = true;
      } else if (validationPriority === 'low') {
        inPriorityRange = true;
      };

      if (inPriorityRange) {
        csv.addRow(validationResultData, [
          rowData.priority,
          rowData.C,
          rowData.V,
          rowData.lineNumber,
          rowData.rowID,
          rowData.fieldName,
          rowData.characterIndex,
          rowData.extract,
          rowData.message,
          rowData.location,
        ]);
      }
    });
  };
  return validationResultData;
};

export const downloadValidationResults = ({
  targetFileName,
  validationResultData,
}) => {
  let timestamp = new Date().toISOString();
  let filename = 'Validation-' + targetFileName + '-' + timestamp + '.csv';
  csv.download(filename, csv.toCSV(validationResultData));
};
