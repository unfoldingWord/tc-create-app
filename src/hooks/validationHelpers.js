import * as cv from 'uw-content-validation';
import * as csv from '../core/csvMaker';


// This function was copied from a prior version of the
// code base and adapted. 
// Since tc-create only validates TSV files at this time,
// then the type of resource can be computed 
// from the filename.
// 
// If any of the markdown resources are supported,
// then another way will have to be used to compute
// the resource code. gatewayAdmin, for example, relies
// on the repo standard naming conventions to make
// this determination.

function resourceCodeFromFilename(filename) {
  let resourceCode = '';

  const isTSV = !!filename.match(/\.tsv$/);
  const isOBS = !!filename.match(/_OBS/);
  const isTN = !!filename.match(/^tn_/);
  const isTQ = !!filename.match(/^tq_/);
  const isSQ = !!filename.match(/^sq_/);
  const isSN = !!filename.match(/^sn_/);
  const isTWL = !!filename.match(/^twl_/);

  if (isTSV) {
    if (isTN) {
      resourceCode = 'TN';
    } else if (isTQ) {
      resourceCode = 'TQ';
    } else if (isSQ) {
      resourceCode = 'SQ';
    } else if (isSN) {
      resourceCode = 'SN';
    } else if (isTWL) {
      resourceCode = 'TWL';
    } else {
      resourceCode = 'TN9';
    };

    if (isOBS) {
      resourceCode = 'OBS-' + resourceCode;
    };
  } else {
    resourceCode = null
  };

  if (resourceCode) {
    console.log('validationHelpers.resourceCodeFromFilename: ', resourceCode);
  } else {
    console.log("validationHelpers.resourceCodeFromFilename: Unsupported file selected");
  };

  return resourceCode;
};

// this function copied from gatewayAdmin
// it will return the CV function to use for the given
// resource code. Note that tc-create does not support
// validation of all the types shown below.
function selectCvFunction(resourceCode) {
  let cvFunction
  switch (resourceCode) {
    case 'OBS':
      return cvFunction = cv.checkMarkdownFileContents
    case 'TN9':
      return cvFunction = cv.checkDeprecatedTN_TSV9Table
    case 'TN':
    case 'OBS-TN':
      return cvFunction = cv.checkTN_TSV7Table
    case 'SN':
    case 'OBS-SN':
      return cvFunction = cv.checkSN_TSV7Table
    case 'TQ':
    case 'OBS-TQ':
      return cvFunction = cv.checkTQ_TSV7Table
    case 'SQ':
    case 'OBS-SQ':
      return cvFunction = cv.checkSQ_TSV7Table
    case 'TWL':
    case 'OBS-TWL':
      return cvFunction = cv.checkTWL_TSV6Table
    case 'TA':
      return cvFunction = cv.checkTA_markdownArticle
    case 'TW':
      return cvFunction = cv.checkTW_markdownArticle
    case 'ULT':
    case 'GLT':
    case 'UST':
    case 'GST':
      return cvFunction = cv.checkUSFMText
    default:
      console.log(`Resource Id not yet supported ${resourceCode}.`);
      cvFunction = null;
  }
  return cvFunction;
}

// a simple filter to discard certain rows
// returns true to include and false to exclude.
// The CV package was written with English in mind.
// This filter takes cares of some of the non-English
// errors it reports. Makes it easier on the GLs.
function cvFilter(rowData, filename) {
  if (String(rowData.priority) === '20') {
    // discard these since they only state that
    // all linked documents are not being processed
    return false
  }
  if ((filename.startsWith("tq") || filename.startsWith("sq"))
    && String(rowData.priority) === '119'
    && String(rowData.fieldName) === 'Quote') {
    // discard - TQ does not use the Quote field
    return false
  }
  // to handle this false error for Spanish
  // Unexpected ¿ character at start of line
  if (String(rowData.message).startsWith('Unexpected ¿')) {
    return false
  }
  // to handle this false error for Spanish
  // Unexpected ¡ character at start of line
  if (String(rowData.message).startsWith('Unexpected ¡')) {
    return false
  }
  return true
}

function bookIdFromFilename(filename) {
  // the naming convention for TSV resources is:
  // (resourceCode)_(bookId.toUpperCase()).tsv
  // only the legacy 9 column translation notes uses 
  // a different naming convention.

  // First, assume not the legacy case:
  let bookId
  if (filename.match(/^(..|...)_...\.tsv$/)) {
    // this is the latest naming convention
    bookId = filename.split('_')[1].split('.')[0]
  } else {
    // legacy 9 column convention
    const _name = filename.split('_');
    //const langId = _name[0];
    bookId = _name[2].split('-')[1].split('.')[0];
  }
  return bookId;
}

export const prepareDataForValidation = ({
  targetFileName,
  targetContent,
  delimiters,
  rows,
}) => {
  // NOTE! the row data on-screen, in-memory does NOT include
  // the headers. So the initial value of tsvRows will be
  // the headers.
  // const _name = targetFileName.split('_');
  // const langId = _name[0];
  // const bookId = _name[2].split('-')[1].split('.')[0];
  const bookId = bookIdFromFilename(targetFileName);
  let tsvString = targetContent.substring(0, targetContent.indexOf(delimiters.row)) + '\n';

  tsvString = tsvString + rows.map((cells) => cells.join(delimiters.cell)).join(delimiters.row);

  const resourceCode = resourceCodeFromFilename(targetFileName);
  const cvFunction = selectCvFunction(resourceCode)

  // language is not part of the file anymore (except for legacy case).
  // however if we are not chasing links, then I suspect we don't need
  // either org or language. So let's return an empty string
  // and see what happens
  const langId = "";

  return {
    langId,
    bookId,
    tsvString,
    cvFunction,
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
      cvFunction,
    } = prepareDataForValidation({
      targetFileName,
      targetContent,
      delimiters,
      rows,
    });

    // in gatewayAdmin, we speed up things by not chasing and validating
    // linked resources. Whence the following option is used:
    const options = {
      disableAllLinkFetchingFlag: true,
    }

    // note: it is possible that cvFunction is null. This will happen
    // if the resource cannot be determined from the filename.
    // This "shouldn't happen" since tc-create stricly supports only a 
    // subset of resource types and is in control of the data passed 
    // into this onValidate function.
    const rawResults = await cvFunction(organization.username, langId, bookId, targetFileName, tsvString, options);
    const nl = rawResults.noticeList;
    let hdrs = ['Priority', 'Chapter', 'Verse', 'Line', 'Row ID', 'Details', 'Char Pos', 'Excerpt', 'Message', 'Location'];

    validationResultData.push(hdrs);
    let inPriorityRange = false;

    Object.keys(nl).forEach(key => {
      inPriorityRange = false; // reset for each
      const rowData = nl[key];
      const includeFlag = cvFilter(rowData, targetFileName)
      if (includeFlag) {
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
