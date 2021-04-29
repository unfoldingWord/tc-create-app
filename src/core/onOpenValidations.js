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

}

export const onOpenValidation = ({filename, content, html_url}) => {
  if ( filename.match(/^tn_...\.tsv$|tn_..-...\.tsv$|^twl_...\.tsv$/) ) {
    const link = html_url.replace('/src/', '/blame/');
    let criticalNotices = [];
    let tsvFile = content;
    // Split into an array of rows
    let rows = tsvFile.split('\n');
    // Is the first row correct (must have the correct headers)
    let tsvHeader = "Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote";
    const tsvHeader7= "Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tAnnotation";
    const tsvHeader6= "Reference\tID\tTags\tOrigWords\tOccurrence\tTWLink";
    const tsvFormat = rows[0].split('\t').length;
    if ( tsvFormat === 7 ) {
      tsvHeader = tsvHeader7;
    } else if ( tsvFormat === 6 ) {
      tsvHeader = tsvHeader6;
    } else if ( tsvFormat === 9 ) {
      // good to go... must be either 7 or 9
    } else {
      criticalNotices.push([
        `${link}#L1`,
        '1',
        `Bad TSV Header, must have 7 or 9 columns`]);
    }
    // NOTE: there are cases where invisible characters are at the end 
    // of the row. This line ensures that the header row only has the
    // number of characters needed. Only then are they compared.
    rows[0] = rows[0].slice(0,tsvHeader.length);
    if (tsvHeader !== rows[0]) {
      criticalNotices.push([
        `${link}#L1`,
        '1',
        `Bad TSV Header, expecting "${tsvHeader.replaceAll('\t', ', ')}"`]);
    }
  
    if (rows.length > 1) {
      for (let i = 1; i < rows.length; i++) {
        let line = i + 1;
        // ignore, skip empty rows
        if ( rows[i] === undefined || rows[i] === '' ) {
          continue;
        }
        let cols = rows[i].split('\t');
        if (cols.length < tsvFormat) {
          criticalNotices.push([
            `${link}#L${line}`,
            `${line}`,
            `Not enough columns, expecting ${tsvFormat}, found ${cols.length}`
          ])
        } else if (cols.length > 9) {
          criticalNotices.push([
            `${link}#L${line}`,
            `${line}`,
            `Too many columns, expecting ${tsvFormat}, found ${cols.length}`
          ])
        }
      }
    }
  
    if (criticalNotices.length > 0) {
      onCriticalErrors(criticalNotices);
    } else {
      onValidated(true);
    }
  } else {
    onValidated(true)
  }
}

