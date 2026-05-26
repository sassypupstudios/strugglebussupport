document.addEventListener('DOMContentLoaded', function () {
  var links = [
    ['contact.html','Contact'],
    ['privacy.html','Privacy Policy'],
    ['terms.html','Terms of Use'],
    ['disclaimer.html','Disclaimer'],
    ['accessibility.html','Accessibility']
  ];
  var footer = document.querySelector('.footer-links');
  if (footer) {
    links.forEach(function (item) {
      if (!footer.querySelector('a[href="' + item[0] + '"]')) {
        var a = document.createElement('a');
        a.href = item[0];
        a.appendChild(document.createTextNode(item[1]));
        footer.appendChild(a);
      }
    });
  }
  var nav = document.querySelector('.site-nav');
  if (nav && !nav.querySelector('a[href="contact.html"]')) {
    var c = document.createElement('a');
    c.href = 'contact.html';
    c.appendChild(document.createTextNode('Contact'));
    nav.appendChild(c);
  }
});
