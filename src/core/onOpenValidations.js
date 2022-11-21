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

// legacy note format 
const onOpenValidationTn9 = (content, url) => {
  console.log("... on open matched a legacy note format.")
  const tsvHeader = "Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote";
  const numColumns = 9;
  const idcolumn = 3; //zero based
  return onOpenValidationTsvGeneric(content, url, tsvHeader, numColumns, idcolumn);
}

// Note TSV formats
const onOpenValidationTn7 = (content, url) => {
  console.log("... on open matched a Note format.")
  const tsvHeader = "Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote";
  const numColumns = 7;
  const idcolumn = 1; //zero based
  return onOpenValidationTsvGeneric(content, url, tsvHeader, numColumns, idcolumn);
}
const onOpenValidationSn = (content, url) => {
  // same as 7 col TN
  return onOpenValidationTn7(content, url);
}
const onOpenValidationObsSn = (content, url) => {
  // same as 7 col TN
  return onOpenValidationTn7(content, url);
}
const onOpenValidationObsTn = (content, url) => {
  // same as 7 col TN
  return onOpenValidationTn7(content, url);
}

// Word list formats
const onOpenValidationTwl = (content, url) => {
  console.log("... on open matched a TWL format.")
  const tsvHeader = "Reference\tID\tTags\tOrigWords\tOccurrence\tTWLink";
  const numColumns = 6;
  const idcolumn = 1; //zero based
  return onOpenValidationTsvGeneric(content, url, tsvHeader, numColumns, idcolumn);
}

// Questions formats
const onOpenValidationTq = (content, url) => {
  console.log("... on open matched a Question format.")
  const tsvHeader = "Reference\tID\tTags\tQuote\tOccurrence\tQuestion\tResponse";
  const numColumns = 7;
  const idcolumn = 1; //zero based
  return onOpenValidationTsvGeneric(content, url, tsvHeader, numColumns, idcolumn);
}
const onOpenValidationSq = (content, url) => {
  // same as tQ
  return onOpenValidationTq(content, url);
}
const onOpenValidationObsTq = (content, url) => {
  // same as tQ
  return onOpenValidationTq(content, url);
}
const onOpenValidationObsSq = (content, url) => {
  // same as tQ
  return onOpenValidationTq(content, url);
}

/*
  Actual checking happens here after the above compute the extra info needed
*/
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
        idarrayline.push(i + 1);
      } else {
        criticalNotices.push([
          `${link}#L${line}`,
          `${line}`,
          `Row ID ${cols[idcolumn]} is a duplicate of ID on row ${idarrayline[location]}`
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
  console.log("Number of on open notices found:", criticalNotices.length)
  return criticalNotices;
}

export const onOpenValidation = (filename, content, url) => {
  const link = url.replace('/src/', '/blame/');
  let criticalNotices = [];

  // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", filename)
  // if (filename.startsWith("en")) {
  //   criticalNotices.push(["tC Create cannot continue to open this file because it is in an outdated format. Please contact your administrator to update the repository's files to the latest format."])
  // }
  if (filename.match(/^tn_OBS\.tsv$/)) {
    criticalNotices = onOpenValidationObsTn(content, link);
  } else if (filename.match(/^tn_...\.tsv$/)) {
    criticalNotices = onOpenValidationTn7(content, link);
  } else if (filename.match(/tn_..-...\.tsv$/)) {
    criticalNotices = onOpenValidationTn9(content, link);
  } else if (filename.match(/^sn_OBS\.tsv$/)) {
    criticalNotices = onOpenValidationObsSn(content, link);
  } else if (filename.match(/^sn_...\.tsv$/)) {
    criticalNotices = onOpenValidationSn(content, link);
  } else if (filename.match(/^twl_...\.tsv$/)) {
    criticalNotices = onOpenValidationTwl(content, link);
  } else if (filename.match(/^tq_OBS\.tsv$/)) {
    criticalNotices = onOpenValidationObsTq(content, link);
  } else if (filename.match(/^tq_...\.tsv$/)) {
    criticalNotices = onOpenValidationTq(content, link);
  } else if (filename.match(/^sq_OBS\.tsv$/)) {
    criticalNotices = onOpenValidationObsSq(content, link);
  } else if (filename.match(/^sq_...\.tsv$/)) {
    criticalNotices = onOpenValidationSq(content, link);
  }



  return criticalNotices;
}
