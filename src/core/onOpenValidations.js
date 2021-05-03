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
  return onOpenValidationTsvGeneric(content, url, tsvHeader, numColumns);
}
const onOpenValidationTn7 = (content, url) => {
  const tsvHeader = "Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tAnnotation";
  const numColumns = 7;
  return onOpenValidationTsvGeneric(content, url, tsvHeader, numColumns);
}
const onOpenValidationTwl = (content, url) => {
  const tsvHeader = "Reference\tID\tTags\tOrigWords\tOccurrence\tTWLink";
  const numColumns = 6;
  return onOpenValidationTsvGeneric(content, url, tsvHeader, numColumns);
}
const onOpenValidationTsvGeneric = (content, link, tsvHeader, numColumns) => {
  const rows = content.split('\n');
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
  console.log("Enter onOpenValidation() filename, content, url:",
    filename, content, url,
  );
  const link = url.replace('/src/', '/blame/');
  let criticalNotices = [];

  if ( filename.match(/^tn_...\.tsv$/) ) {
    criticalNotices = onOpenValidationTn7(content,link);
  } else if ( filename.match(/tn_..-...\.tsv$/) ) {
    criticalNotices = onOpenValidationTn9(content, link);
  } else if ( filename.match(/^twl_...\.tsv$/) ) {
    criticalNotices = onOpenValidationTwl(content, link);
  }
  console.log("Exit onOpenValidation() criticalNoties:",
    criticalNotices,
  );
  return criticalNotices;
}