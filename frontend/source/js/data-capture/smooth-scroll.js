/* global $, window */

/**
 * This script alters the behavior of in-page linking to smoothly
 * scroll the user's browser. It preserves sequential focus navigation
 * to ensure that keyboard users aren't stranded.
 *
 * Implementation notes
 * --------------------
 *
 * We use `history.replaceState()` to remember the current scroll
 * position of the page, so that we can restore it when the user
 * presses their browser's back and forward buttons.
 *
 * When the user clicks on an in-page link, however, we want to use
 * `location.hash` to set the new URL instead of `history.pushState()`
 * for a few reasons:
 *
 * * Using `location.hash` will invoke the sequential focus
 *   navigation behavior of browsers, which keeps things
 *   nice and accessible for keyboard users.
 *
 * * Using `history.pushState()` doesn't invoke `:target`
 *   CSS selectors, at the time of this writing, which is
 *   unfortunate (for more details, see
 *   https://bugs.webkit.org/show_bug.cgi?id=83490).
 *
 * However, we still want to store the current scroll
 * offset for the new history entry, so to do that we'll
 * wait for the `hashchange` event to fire and then use
 * `history.replaceState()`.
 */

// This is the amount of time, in milliseconds, that we'll take to
// scroll the page from its current position to a new position.
const DEFAULT_SCROLL_MS = 500;

// This determines whether we have enough functionality in the browser to
// support smooth scrolling.
export const IS_SUPPORTED = window.history && window.history.replaceState;

function rememberCurrentScrollPosition(window) {
  window.history.replaceState({
    pageYOffset: window.pageYOffset,
  }, '');
}

function changeHash(window, hash, cb) {
  const currId = window.location.hash.slice(1);
  const newId = hash.slice(1);

  if (currId !== newId) {
    $(window).one('hashchange', cb);
  }
  window.location.hash = hash;  // eslint-disable-line no-param-reassign
}

function smoothScroll(window, scrollTop, scrollMs, cb) {
  // WebKit uses `<body>` for keeping track of scrolling, while
  // Firefox and IE use `<html>`, so we need to animate both.

  const $els = $('html, body', window.document);
  let callbacksLeft = $els.length;

  $els.stop().animate({
    scrollTop,
  }, scrollMs, () => {
    // This callback is going to be called multiple times because
    // we're animating on multiple elements, but we only want the
    // code to execute once--hence our use of `callbacksLeft`.

    if (--callbacksLeft === 0) {
      if (cb) {
        cb();
      }
    }
  });
}

export function activate(window, options = {}) {
  const scrollMs = options.scrollMs || DEFAULT_SCROLL_MS;
  const onScroll = options.onScroll || (() => {});

  $('body', window.document).on('click', 'a[href^="#"]', e => {
    const scrollId = $(e.target).attr('href').slice(1);
    const scrollTarget = window.document.getElementById(scrollId);

    if (scrollTarget) {
      e.preventDefault();
      rememberCurrentScrollPosition(window);
      smoothScroll(window, $(scrollTarget).offset().top, scrollMs, () => {
        changeHash(window, `#${scrollId}`, () => {
          rememberCurrentScrollPosition(window);
          onScroll();
        });
      });
    }
  });

  window.addEventListener('popstate', e => {
    if (e.state && 'pageYOffset' in e.state) {
      smoothScroll(window, e.state.pageYOffset, scrollMs, onScroll);
    }
  }, false);

  // https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';   // eslint-disable-line no-param-reassign
  }
}

if (IS_SUPPORTED) {
  activate(window);
}
