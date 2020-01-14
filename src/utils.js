export function disableBackButton() {
  window.addEventListener('load', function () {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function () {
      window.history.pushState(null, document.title, window.location.href);
    });
  })
}