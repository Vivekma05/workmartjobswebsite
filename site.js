/* WorkMart website — progressive enhancement only. Everything is readable
   without this file; with it: glass header on scroll, phone menu, scroll
   reveals, hero tilt/parallax, the How-it-works progress line, a smooth FAQ
   accordion, and the "On this page" sidebar on policy pages.
   Motion is skipped entirely under prefers-reduced-motion. */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  if (reduce) doc.classList.add('no-motion');

  /* ── Header: transparent over the hero, glass once scrolled ── */
  var nav = document.querySelector('.nav');
  var hero = document.querySelector('.hero, .page-hero');
  function setSolid() {
    if (!nav) return;
    var limit = hero ? hero.offsetHeight - 90 : 0;
    nav.classList.toggle('is-solid', window.scrollY > Math.max(40, limit * 0.15) || !hero);
  }
  setSolid();
  window.addEventListener('scroll', setSolid, { passive: true });

  /* ── Phone menu ── */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mnav');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle && toggle.setAttribute('aria-expanded', 'false');
    toggle && toggle.querySelector('use').setAttribute('href', 'assets/icons.svg#i-menu');
    setTimeout(function () { if (!menu.classList.contains('open')) menu.hidden = true; }, 300);
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = !menu.classList.contains('open');
      if (open) {
        menu.hidden = false;
        requestAnimationFrame(function () { menu.classList.add('open'); });
        document.body.classList.add('menu-open');
        nav.classList.add('is-solid');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.querySelector('use').setAttribute('href', 'assets/icons.svg#i-x');
      } else { closeMenu(); setSolid(); }
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); setSolid(); } });
  }

  /* ── Scroll reveal (staggered by --i inside each group) ── */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  revealEls.forEach(function (el) {
    var group = el.parentElement;
    var sibs = group ? Array.prototype.filter.call(group.children, function (c) { return c.hasAttribute('data-reveal'); }) : [];
    var idx = sibs.indexOf(el);
    if (idx > 0 && !el.style.getPropertyValue('--i')) el.style.setProperty('--i', Math.min(idx, 5));
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ── Hero: pointer tilt + depth parallax, scroll drift ── */
  var visual = document.querySelector('.hero-visual');
  if (visual && !reduce) {
    var device = visual.querySelector('.device');
    var layers = Array.prototype.slice.call(visual.querySelectorAll('[data-depth]'));
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    function frame() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      if (device) {
        device.style.setProperty('--ry', (-10 + cx * 10).toFixed(2) + 'deg');
        device.style.setProperty('--rx', (4 - cy * 7).toFixed(2) + 'deg');
      }
      var drift = Math.min(window.scrollY, 600) * 0.06;
      layers.forEach(function (l) {
        var d = parseFloat(l.getAttribute('data-depth')) || 1;
        l.style.transform = 'translate3d(' + (cx * d * 10).toFixed(1) + 'px,' + (cy * d * 10 - drift * d * 0.6).toFixed(1) + 'px,0)';
      });
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(frame); else raf = 0;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    if (finePointer) {
      window.addEventListener('pointermove', function (e) {
        var r = visual.getBoundingClientRect();
        tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width)));
        ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height)));
        kick();
      }, { passive: true });
    }
    window.addEventListener('scroll', kick, { passive: true });
  }

  /* ── How it works: the line fills as you scroll through the steps ── */
  var steps = document.querySelector('.steps');
  var line = steps && steps.querySelector('.steps-line i');
  if (steps && line) {
    var tick = false;
    function fill() {
      tick = false;
      var r = steps.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.6 - r.top) / r.height;
      line.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(fill); } }, { passive: true });
    fill();
  }

  /* ── FAQ: animate open/close height ── */
  Array.prototype.forEach.call(document.querySelectorAll('.faq details'), function (d) {
    var sum = d.querySelector('summary');
    var ans = d.querySelector('.ans');
    if (!sum || !ans || reduce || !ans.animate) return;
    sum.addEventListener('click', function (e) {
      e.preventDefault();
      if (d.dataset.anim) return;
      d.dataset.anim = '1';
      if (!d.open) {
        d.open = true;
        var h = ans.offsetHeight;
        ans.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' })
          .onfinish = function () { delete d.dataset.anim; };
      } else {
        var h2 = ans.offsetHeight;
        var a = ans.animate([{ height: h2 + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.4,0,1,1)' });
        a.onfinish = function () { d.open = false; delete d.dataset.anim; };
      }
    });
  });

  /* ── Year in the footer ── */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) { el.textContent = new Date().getFullYear(); });

  /* ── Policy pages: sticky "On this page" sidebar ── */
  var root = document.querySelector('.legal .wrap');
  if (!root) return;
  var heads = Array.prototype.slice.call(root.querySelectorAll('h2'));
  if (heads.length < 3) return;
  function slug(t) { return (t || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section'; }
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
  var body = document.createElement('div');
  body.className = 'docs-body';
  var next;
  while ((next = aside.nextSibling)) body.appendChild(next);
  root.appendChild(body);
  root.classList.add('has-toc');
  var links = ul.querySelectorAll('a');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          for (var k = 0; k < links.length; k++) links[k].classList.toggle('active', links[k].getAttribute('href') === '#' + e.target.id);
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    heads.forEach(function (h) { obs.observe(h); });
  }
})();
