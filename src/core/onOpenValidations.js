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