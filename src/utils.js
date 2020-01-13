export function disableBackButton() {
  window.history.pushState(null, null, 'no-back-button');
  window.addEventListener('popstate', function () {
    window.history.pushState(null, null, 'no-back-button');
  });
}