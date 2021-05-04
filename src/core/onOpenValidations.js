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

const onOpenValidationTn9 = (content, url) => {
  const tsvHeader = "Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote";
  const numColumns = 9;
  const idcolumn = 3; //zero based
  return onOpenValidationTsvGeneric(content, url, tsvHeader, numColumns, idcolumn);
}
const onOpenValidationTn7 = (content, url) => {
  const tsvHeader = "Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tAnnotation";
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
  const rows = content.split('\n');
  let idarray = [];
  let idarrayline = [];
  let criticalNotices = [];

  if (tsvHeader !== rows[0]) {
    criticalNotices.push([
      `${link}#L1`,
      '1',
      `Bad TSV Header, expecting "${tsvHeader.replaceAll('\t', ', ')}"`]);
  }

  if (rows.length > 1) {
    for (let i = 0; i < rows.length; i++) {
      let line = i + 1;
      // ignore, skip empty rows
      if ( rows[i] === undefined || rows[i] === '' ) {
        continue;
      }
      let cols = rows[i].split('\t');
      let location = idarray.indexOf(cols[idcolumn]);
      if ( location === -1 ) {
        idarray.push(cols[idcolumn]);
        idarrayline.push(i);
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

  return criticalNotices;
}

export const onOpenValidation = (filename, content, url) => {
  const link = url.replace('/src/', '/blame/');
  let criticalNotices = [];

  if ( filename.match(/^tn_...\.tsv$/) ) {
    criticalNotices = onOpenValidationTn7(content,link);
  } else if ( filename.match(/tn_..-...\.tsv$/) ) {
    criticalNotices = onOpenValidationTn9(content, link);
  } else if ( filename.match(/^twl_...\.tsv$/) ) {
    criticalNotices = onOpenValidationTwl(content, link);
  }
  return criticalNotices;
}