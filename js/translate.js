/**
 * Language selector — injects a 🌐 dropdown into .site-nav
 * Uses Google Translate proxy (no API key needed, no external scripts loaded at startup)
 */
(function () {
  'use strict';

  const LANGUAGES = [
    { code: 'es',    label: 'Español',           name: 'Spanish' },
    { code: 'fr',    label: 'Français',           name: 'French' },
    { code: 'ru',    label: 'Русский',            name: 'Russian' },
    { code: 'pt',    label: 'Português',          name: 'Portuguese' },
    { code: 'ht',    label: 'Kreyòl ayisyen',     name: 'Haitian Creole' },
    { code: 'vi',    label: 'Tiếng Việt',         name: 'Vietnamese' },
    { code: 'ar',    label: 'العربية',            name: 'Arabic' },
    { code: 'zh-CN', label: '中文 (简体)',         name: 'Chinese Simplified' },
    { code: 'ko',    label: '한국어',              name: 'Korean' },
    { code: 'my',    label: 'မြန်မာဘာသာ',          name: 'Burmese' },
    { code: 'so',    label: 'Soomaali',           name: 'Somali' },
    { code: 'am',    label: 'አማርኛ',              name: 'Amharic' },
  ];

  // If already on a Google Translate proxied page, extract the original URL
  function getSourceUrl() {
    const href = location.href;
    if (href.includes('translate.google.com')) {
      try {
        return new URLSearchParams(href.split('?')[1]).get('u') || href;
      } catch (e) { return href; }
    }
    return href;
  }

  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'lang-wrapper';
  wrapper.setAttribute('role', 'navigation');
  wrapper.setAttribute('aria-label', 'Language selection');

  wrapper.innerHTML = [
    '<button class="lang-btn" type="button" aria-haspopup="listbox"',
    '  aria-expanded="false" aria-controls="lang-menu"',
    '  aria-label="Translate this page">',
    '  🌐 <span aria-hidden="true">▾</span>',
    '</button>',
    '<div class="lang-menu" id="lang-menu" role="listbox"',
    '     aria-label="Select language" hidden>',
    '  <div class="lang-menu-header">Translate this page</div>',
    LANGUAGES.map(function (l) {
      return [
        '<a class="lang-option" href="#" role="option"',
        '   data-lang="' + l.code + '"',
        '   aria-label="Translate to ' + l.name + '">',
        l.label,
        '</a>',
      ].join('');
    }).join(''),
    '</div>',
  ].join('');

  nav.appendChild(wrapper);

  var btn  = wrapper.querySelector('.lang-btn');
  var menu = wrapper.querySelector('.lang-menu');

  function openMenu()  { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { menu.hidden = true;  btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.hidden ? openMenu() : closeMenu();
  });

  menu.addEventListener('click', function (e) {
    var opt = e.target.closest('[data-lang]');
    if (!opt) return;
    e.preventDefault();
    var url = 'https://translate.google.com/translate?sl=en&tl='
      + opt.dataset.lang + '&u=' + encodeURIComponent(getSourceUrl());
    window.location.href = url;
  });

  document.addEventListener('click', function (e) {
    if (!wrapper.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();
