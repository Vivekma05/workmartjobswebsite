/* WorkMart site helpers — no dependencies.
   Builds a sticky "On this page" sidebar on policy pages (.legal): collects
   the page's h2 sections, gives them anchor ids, and highlights the section
   in view. Pages without .legal are untouched. */
(function () {
  var root = document.querySelector('.legal .wrap');
  if (!root) return;
  var heads = Array.prototype.slice.call(root.querySelectorAll('h2'));
  if (heads.length < 3) return;

  function slug(t) {
    return (t || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  }

  var seen = {};
  var aside = document.createElement('aside');
  aside.className = 'toc';
  aside.setAttribute('aria-label', 'On this page');
  var label = document.createElement('p');
  label.className = 'toc-title';
  label.textContent = 'On this page';
  var ul = document.createElement('ul');

  heads.forEach(function (h, i) {
    var s = slug(h.textContent);
    if (seen[s]) s += '-' + i;
    seen[s] = 1;
    h.id = s;
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + s;
    a.textContent = h.textContent;
    li.appendChild(a);
    ul.appendChild(li);
  });

  aside.appendChild(label);
  aside.appendChild(ul);
  root.insertBefore(aside, root.firstChild);

  // Wrap everything else so the grid sees exactly two columns.
  var body = document.createElement('div');
  body.className = 'docs-body';
  var next;
  while ((next = aside.nextSibling)) body.appendChild(next);
  root.appendChild(body);
  root.classList.add('has-toc');

  var links = ul.querySelectorAll('a');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            for (var k = 0; k < links.length; k++) {
              var on = links[k].getAttribute('href') === '#' + e.target.id;
              links[k].classList.toggle('active', on);
            }
          }
        });
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    heads.forEach(function (h) { obs.observe(h); });
  }
})();
