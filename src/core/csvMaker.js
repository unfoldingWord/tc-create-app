// CSV Package

// download to local a CSV file
// with filename and content (text as string)
export function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export function addRow( csvdata, csvrow) {
  // Rules below are a relaxed version of
  // https://tools.ietf.org/html/rfc4180
  // Specifically, no checks are made to ensure that all rows
  // have the same number of columns.

  // This function add a new row of strings to an existing 2D array.

  // Rules:
  // 1. if a cell contains a quote, then the quote must doubled (rfc4180#7)
  // 2. if a cell contains commas, quotes, or line breaks, then the string must quoted (rfc4180#6)
  //  a line break will mean a carriage return (CR) or line feed (LF)
  const row = csvrow.map(_cell => {
    let cell = String(_cell || '');

    if ( cell.includes('"') ) {
      // double the quotes
      cell = cell.replace(/"/g,'""');
    };

    if ( cell.includes('"') || cell.includes('\n') || cell.includes('\r') || cell.includes(',')) {
      cell = '"' + cell + '"';
    };
    // replace value
    return cell;
  });
  // push new row onto csv data
  csvdata.push(row);
};

export function toCSV( csvdata ) {
  // Rules below are a relaxed version of
  // https://tools.ietf.org/html/rfc4180
  // Specifically, no checks are made to ensure that all rows
  // have the same number of columns.

  // This function combines all the rows into a single string
  // suitable for downloading or importing into a spreadsheet

  // Rules:
  // 1. join cells in a row with a comma (rfc4180#4);
  //  no comma after last cell
  // 2. join rows with a \r\n (CRLF) (rfc4180#1)
  //  use CRLF after last row

  let data = '\uFEFF';
  data = data + csvdata.map(rowCells => rowCells.join(',') ).join('\r\n');

  return data;
};