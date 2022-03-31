/*
  On Open Validation implements a minimal set of checks
  to ensure that the file can be opened successfully.

  These checks are at present only for TSV formats, of
  which there are a few. Each of which has its own unique
  set of checks, even tho the checks are conceptually the
  same set.

  As of this writing, those checks are three in number:

  1. is the header row correct?
  2. does each row have the correct number of columns?
  3. are there any duplicate row IDs?
*/
import * as tsvparser from 'uw-tsv-parser';

const onOpenValidationTn9 = (content, url) => {
  const tsvHeader = "Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote";
  const numColumns = 9;
  const idcolumn = 3; //zero based
  return onOpenValidationTsvGeneric(content, url, tsvHeader, numColumns, idcolumn);
}
const onOpenValidationTn7 = (content, url) => {
  const tsvHeader = "Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote";
  const numColumns = 7;
  const idcolumn = 1; //zero based
  return onOpenValidationTsvGeneric(content, url, tsvHeader, numColumns, idcolumn);
}
const onOpenValidationTwl = (content, url) => {
  const tsvHeader = "Reference\tID\tTags\tOrigWords\tOccurrence\tTWLink";
  const numColumns = 6;
  const idcolumn = 1; //zero based
  return onOpenValidationTsvGeneric(content, url, tsvHeader, numColumns, idcolumn);
}
const onOpenValidationTsvGeneric = (content, link, tsvHeader, numColumns, idcolumn) => {
  const { data, header } = tsvparser.tsvStringToTable(content);
  let idarray = [];
  let idarrayline = [];
  let criticalNotices = [];
  const incomingTsvHeader = header.join('\t');

  // is the content correct?
  if (tsvHeader !== incomingTsvHeader) {
    criticalNotices.push([
      `${link}#L1`,
      '1',
      `Bad TSV Header, expecting:"${tsvHeader.replaceAll('\t', ', ')}"` +
      `, found:"${header.join(', ').slice(0, tsvHeader.length) + "..."}"`
    ]);
  }

  // if content not correct, where is the first difference?
  if (tsvHeader !== incomingTsvHeader) {
    let firstdiff = -1;
    let maxlength = Math.max(tsvHeader.length, incomingTsvHeader.length);
    for (let i = 0; i < maxlength; i++) {
      //console.log("s vs t:", tsvHeader[i], rows[0][i]);
      if (tsvHeader.charCodeAt(i) !== incomingTsvHeader.charCodeAt(i)) {
        firstdiff = i;
        break;
      }
    }
    if (firstdiff !== -1) {
      let ch1 = tsvHeader.charCodeAt(firstdiff).toString(16);
      if (tsvHeader.length < firstdiff) ch1 = 'undefined';
      let ch2 = incomingTsvHeader.charCodeAt(firstdiff).toString(16);
      if (ch2.length === 1) ch2 = '0' + ch2;
      if (ch1.length === 1) ch1 = '0' + ch1;
      ch2 = 'x' + ch2.toUpperCase();
      ch1 = 'x' + ch1.toUpperCase();
      criticalNotices.push([
        `${link}#L1`,
        '1',
        `Headers different at character ${firstdiff + 1}: ` +
        `${tsvHeader.charAt(firstdiff)} (${ch1}) vs ${incomingTsvHeader.charAt(firstdiff)} (${ch2})`
      ]);
    }
  }

  // does it have the correct length?
  if (tsvHeader.length !== incomingTsvHeader.length) {
    criticalNotices.push([
      `${link}#L1`,
      '1',
      `TSV Header has incorrect length, should be ${tsvHeader.length}; found ${incomingTsvHeader.length}`
    ]);
  }

  if (data.length > 1) {
    for (let i = 0; i < data.length; i++) {
      let line = i + 1;
      let cols = data[i];
      // look for duplicate ids
      let location = idarray.indexOf(cols[idcolumn]);
      if (location === -1) {
        idarray.push(cols[idcolumn]);
        idarrayline.push(i);
      } else {
        criticalNotices.push([
          `${link}#L${line}`,
          `${line}`,
          `Row ID ${cols[idcolumn]} is a duplicate of ID on row ${idarrayline[location + 1]}`
        ])
      }


      if (cols.length < numColumns) {
        criticalNotices.push([
          `${link}#L${line}`,
          `${line}`,
          `Not enough columns, expecting ${numColumns}, found ${cols.length}`
        ])
      } else if (cols.length > numColumns) {
        criticalNotices.push([
          `${link}#L${line}`,
          `${line}`,
          `Too many columns, expecting ${numColumns}, found ${cols.length}`
        ])
      }
    }
  }

  return criticalNotices;
}

export const onOpenValidation = (filename, content, url) => {
  const link = url.replace('/src/', '/blame/');
  let criticalNotices = [];

  if (filename.match(/^tn_...\.tsv$/)) {
    criticalNotices = onOpenValidationTn7(content, link);
  } else if (filename.match(/tn_..-...\.tsv$/)) {
    criticalNotices = onOpenValidationTn9(content, link);
  } else if (filename.match(/^twl_...\.tsv$/)) {
    criticalNotices = onOpenValidationTwl(content, link);
  }
  return criticalNotices;
}