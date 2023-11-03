import { parseReferenceToList } from 'bible-reference-range'
import { versesInChapter } from '../../core/bcv'

/**
 * helper function to check if the reference string starts with a chapter specification
 **/
export const startsWithChapterSpec = (refStr) => {
  let retVal = false
  const splitCh = ':'
  if (refStr?.includes(splitCh)) {
    const startsWith = refStr.substring(0, refStr.indexOf(splitCh))
    const strLen = startsWith.length
    retVal = /^\d+$/.test(startsWith) && (strLen > 0) && (strLen <= 3)
  }
  return retVal
}

/**
 * helper function to get a bcvQuery structure based on a reference string
 * with the help of reference chunks (from the bible-reference-range rcl)
 * -> requirement:
 * each entry in the chunks array must have the following format:
 * {chapter, verse, endChapter, endVerse}
 **/
export const getBcvQueryBasedOnRefStr = (refStr,bookId) => {
  let book = {}

  if (bookId) {
    book[bookId] = { ch: {} }
    const refChunks = parseReferenceToList(refStr)
    refChunks && refChunks.forEach(chunk => {
      const endCh = chunk.endChapter || chunk.chapter
      for (let chNum = chunk.chapter; chNum <= endCh; chNum++) {
        if (chNum) {
          if (!book[bookId].ch[chNum]) {
            book[bookId].ch[chNum] = { v: {} }
          }

          if (chunk.endVerse) {
            const endV = (chNum===endCh) 
                          ? chunk.endVerse
                          : versesInChapter({bookId, chapter: chNum})
            const begV = (chNum===chunk.chapter) ? chunk.verse : 1
            for (let i = begV; i <= endV; i++) {
              book[bookId].ch[chNum].v[i] = {}
            }
          } else if (chunk.verse) {
            book[bookId].ch[chNum].v[chunk.verse] = {}
          }
        }
      }
    })
  }
  return { book }
}

export const columnsLineFromContent = ({ content, delimiters }) => {
  const columnsLine = content.substring(0, content.indexOf(delimiters.row));
  return columnsLine;
};

export const columnNamesFromContent = ({ content, delimiters }) => {
  const columnsLine = columnsLineFromContent({ content, delimiters });
  const _columnNames = columnsLine.split(delimiters.cell);
  return _columnNames;
};

export const columnIndexOfColumnNameFromColumnNames = ({ columnNames, columnName }) => {
  const columnIndex = columnNames.indexOf(columnName);
  return columnIndex;
};

export const generateRowId = ({
  rowData,
  columnNames,
  delimiters,
}) => {
  let chapter, verse, uid;

  // add 1 to column indexes to account for "rowHeader" Hack
  const referenceIndex = columnIndexOfColumnNameFromColumnNames({ columnNames, columnName: 'Reference' }) + 1;
  const chapterIndex = columnIndexOfColumnNameFromColumnNames({ columnNames, columnName: 'Chapter' }) + 1;
  const verseIndex = columnIndexOfColumnNameFromColumnNames({ columnNames, columnName: 'Verse' }) + 1;
  const uidIndex = columnIndexOfColumnNameFromColumnNames({ columnNames, columnName: 'ID' }) + 1;

  if (referenceIndex) {
    const splitCh = ':'
    // find columIndex of Reference
    const [referenceFromOriginal, referenceFromTranslation] = rowData[referenceIndex].split(delimiters.cell);
    const reference = referenceFromOriginal || referenceFromTranslation;
    const [_chapter, ...rest] = reference.split(splitCh)
    chapter = _chapter
    verse = rest.join(splitCh)

  } else if (chapterIndex && verseIndex) {
    // find columnIndex columnName "Chapter"
    const [chapterFromOriginal, chapterFromTranslation] = rowData[chapterIndex].split(delimiters.cell);
    chapter = chapterFromOriginal || chapterFromTranslation
    // find columnIndex columnName "Verse"
    const [verseFromOriginal, verseFromTranslation] = rowData[verseIndex].split(delimiters.cell);
    verse = verseFromOriginal || verseFromTranslation;
  };

  if (uidIndex) {
    const [uidFromOriginal, uidFromTranslation] = rowData[uidIndex].split(delimiters.cell);
    uid = uidFromOriginal || uidFromTranslation;
  };

  return `header-${chapter}-${verse}-${uid}`;
};

export const compositeKeyIndicesFromColumnNames = ({ columnNames }) => {
  // const columnNamesToUse = ['Reference', 'Chapter', 'Verse', 'ID'];
  const columnNamesToUse = ['ID'];

  const indices = columnNamesToUse.map(columnName => {
    const index = columnIndexOfColumnNameFromColumnNames({ columnNames, columnName });
    return index;
  });

  const compositeKeyIndices = indices.filter(index => (index > -1));

  return compositeKeyIndices;
};

export const columnsFilterFromColumnNames = ({ columnNames }) => {
  const columnNamesToUse = ['Reference', 'Chapter', 'Verse', 'SupportReference'];

  const indices = columnNamesToUse.map(columnName => {
    const index = columnIndexOfColumnNameFromColumnNames({ columnNames, columnName });
    return index;
  });

  const columnsIndices = indices.filter(index => (index > -1));
  const columnsFilter = columnsIndices.map(index => (columnNames[index]));

  return columnsFilter;
};

export const columnsShowDefaultFromColumnNames = ({ columnNames }) => {
  const retrievedData = (localStorage.getItem("StoredColumn"))
  if (retrievedData){
    const splitString = retrievedData.split(',');
    const columnNamesToUse = [...splitString];
    const indices = columnNamesToUse.map(columnName => {
    const index = columnIndexOfColumnNameFromColumnNames({ columnNames, columnName });
      return index;
    });
    const columnsIndices = indices.filter(index => (index > -1));
    const columnsShowDefault = columnsIndices.map(index => (columnNames[index]));
      return columnsShowDefault;
  }else{
    const columnNamesToUse = [];
    const indices = columnNamesToUse.map(columnName => {
    const index = columnIndexOfColumnNameFromColumnNames({ columnNames, columnName });
      return index;
    });
    const columnsIndices = indices.filter(index => (index > -1));
    const columnsShowDefault = columnsIndices.map(index => (columnNames[index]));
      return columnsShowDefault;
  }
};
