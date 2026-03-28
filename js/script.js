(function () {
  const body = document.body;
  const navToggle = document.querySelector('.nav-toggle');
  const navPanel = document.querySelector('.nav');

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', () => {
      const open = navPanel.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Active nav link
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Menu tabs
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.tab;
      document.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('[data-panel]').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.querySelector(`[data-panel="${key}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  // Carousel auto rotate
  const track = document.getElementById('carouselTrack');
  if (track) {
    let index = 0;
    const cards = [...track.children];
    const tick = () => {
      cards.forEach((card, i) => card.classList.toggle('active', i === index));
      const offset = index * -132;
      track.style.transform = `translateX(${offset}px)`;
      index = (index + 1) % cards.length;
    };
    tick();
    setInterval(tick, 2200);
  }

  // Orbit motion
  const stages = document.querySelectorAll('.orbit-stage');
  stages.forEach(stage => {
    const items = [...stage.querySelectorAll('.orbit-item')];
    const radius = Number(stage.dataset.radius || 160);
    const count = items.length;
    let start = performance.now();

    function frame(now) {
      const t = (now - start) / 1000;
      items.forEach((item, i) => {
        const base = (Math.PI * 2 * i) / count;
        const direction = stage.dataset.orbit === 'coffee' ? 1 : -1;
        const angle = base + t * 0.45 * direction;
        const wobble = Math.sin(t * 2 + i) * 8;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * (radius * 0.78) + wobble;
        const depth = (Math.sin(angle) + 1) / 2;
        const scale = 0.82 + depth * 0.42;
        item.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
        item.style.zIndex = Math.round(scale * 100);
        item.style.opacity = (0.55 + depth * 0.45).toFixed(2);
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });

  // Intro sequence (home only)
  const intro = document.getElementById('intro');
  if (intro) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const played = sessionStorage.getItem('foodbrewIntroPlayed') === '1';
    const skip = document.getElementById('skipIntro');

    function buildRice() {
      const box = document.getElementById('riceParticles');
      if (!box) return;
      const count = reduceMotion ? 10 : 26;
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.className = 'rice-dot';
        dot.style.left = `${12 + Math.random() * 76}%`;
        dot.style.animation = `drop ${1.4 + Math.random() * 1.4}s linear ${Math.random() * 1.3}s infinite`;
        dot.style.transform = `translateX(${(Math.random() * 14 - 7)}px) rotate(${Math.random() * 180}deg)`;
        box.appendChild(dot);
      }
    }

    buildRice();

    if (played || reduceMotion) {
      intro.classList.add('is-done');
      sessionStorage.setItem('foodbrewIntroPlayed', '1');
      return;
    }

    const rice = document.getElementById('introRice');
    const coffee = document.getElementById('introCoffee');
    const logo = document.getElementById('introLogo');
    const logoText = document.getElementById('introLogoText');
    const hyphen = document.getElementById('introHyphen');

    const steps = [
      () => rice.classList.add('is-active'),
      () => { rice.classList.remove('is-active'); coffee.classList.add('is-active'); },
      () => { coffee.classList.remove('is-active'); logo.classList.add('is-active'); },
      () => {
        logoText.classList.add('split');
        hyphen.animate(
          [
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: 'translateY(48px) rotate(-18deg)', opacity: 0 }
          ],
          { duration: 820, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
        );
        setTimeout(() => {
          logoText.innerHTML = '<span>FOOD</span><span class="hyphen" style="opacity:0">-</span><span>BREW</span>';
        }, 420);
      },
      () => {
        intro.classList.add('is-done');
        sessionStorage.setItem('foodbrewIntroPlayed', '1');
      }
    ];

    let delay = 0;
    steps.forEach((fn, index) => {
      setTimeout(fn, delay);
      delay += [1600, 1600, 1500, 1500, 1200][index];
    });

    if (skip) {
      skip.addEventListener('click', () => {
        intro.classList.add('is-done');
        sessionStorage.setItem('foodbrewIntroPlayed', '1');
      });
    }

    setTimeout(() => {
      intro.classList.add('is-done');
      sessionStorage.setItem('foodbrewIntroPlayed', '1');
    }, 7600);
  }

  // Add basic page load animation
  body.classList.add('loaded');
})();

