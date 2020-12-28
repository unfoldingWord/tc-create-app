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