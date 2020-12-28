const COMMIT_HASH = process.env.REACT_APP_COMMIT_HASH;

export function disableBackButton() {
  window.history.pushState(null, null, window.location.href);
  window.history.back();
  window.history.forward();
  window.onpopstate = function () {
    window.history.go(1);
  };
}

export function getCommitHash() {
  console.log('COMMIT_HASH', COMMIT_HASH);
  return (COMMIT_HASH || '').slice(0, 7).toUpperCase();
}