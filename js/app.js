/**
 * app.js — App-level init (service worker registration)
 * Loaded on every page.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function (err) {
      // SW registration failed silently — site still works without it
    });
  });
}
