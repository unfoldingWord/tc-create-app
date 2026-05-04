export function disableBackButton() {
  window.history.pushState(null, null, window.location.href);
  window.history.back();
  window.history.forward();
  window.onpopstate = function () {
    window.history.go(1);
  };
}

export function getCommitHash() {
  return process.env.REACT_APP_BUILD_NUMBER;
}

/**
 * Normalizes a file path by removing leading slashes and dot-slashes,
 * then prepending './' to ensure a consistent format.
 *
 * @param {string} filepath - The file path to normalize
 * @returns {string} The normalized file path with './' prefix, or the original value if falsy
 */
export function normalizePath(filepath) {
  if (!filepath) {
    return filepath;
  }

  const stripped = filepath
    .replace(/^\.\/+/, '')
    .replace(/^\/+/, ''); // remove root path
  return './' + stripped; // make explicitly relative path
}

/**
 * Compares two file paths to determine if they refer to the same file.
 * Handles inconsistencies in path formatting by normalizing both paths
 * before comparison (e.g., paths that may start with '/' or './').
 *
 * @param {string} filepath - The first file path to compare
 * @param {string} sourceFile - The second file path to compare
 * @returns {boolean} True if the paths match (either directly or after normalization), false otherwise
 */
export function doFilesMatch(filepath, sourceFile) {
  let matchFound = filepath === sourceFile;
  if (!matchFound) { // TRICKY: some manifests are inconsistent on paths to file - it may start with `/` or `./`
    matchFound = normalizePath(filepath) === normalizePath(sourceFile);
  }
  return matchFound;
}

