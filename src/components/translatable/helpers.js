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
    // find columIndex of Reference
    chapter = rowData[referenceIndex].split(delimiters.cell)[0].split(':')[0];
    verse = rowData[referenceIndex].split(delimiters.cell)[0].split(':')[1];
  } else if (chapterIndex && verseIndex) {
    // find columnIndex columnName "Chapter"
    chapter = rowData[chapterIndex].split(delimiters.cell)[0];
    // find columnIndex columnName "Verse"
    verse = rowData[verseIndex].split(delimiters.cell)[0];
  };

  if (uidIndex) {
    uid = rowData[uidIndex].split(delimiters.cell)[0];
  };

  return `header-${chapter}-${verse}-${uid}`;
};

export const compositeKeyIndicesFromColumnNames = ({ columnNames }) => {
  const columnNamesToUse = ['Reference', 'Chapter', 'Verse', 'ID'];

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
  const columnNamesToUse = ['Question', 'Response', 'SupportReference', 'OccurrenceNote', 'OrigWords', 'TWLink', 'Note'];

  const indices = columnNamesToUse.map(columnName => {
    const index = columnIndexOfColumnNameFromColumnNames({ columnNames, columnName });
    return index;
  });

  const columnsIndices = indices.filter(index => (index > -1));
  const columnsShowDefault = columnsIndices.map(index => (columnNames[index]));

  return columnsShowDefault;
};
