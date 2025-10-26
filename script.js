// script.js — event filtering by date
// Hides events whose data-date is before today (i.e., older than today).

function parseISODateLike(input) {
  // Accepts YYYY-M-D or YYYY-MM-DD reliably, falling back to Date parser.
  if (!input) return null;
  const s = input.trim();
  const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1; // monthIndex
    const d = Number(m[3]);
    return new Date(y, mo, d);
  }
  const parsed = new Date(s);
  return isNaN(parsed) ? null : parsed;
}

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize

  const items = document.querySelectorAll('#event-list li[data-date]');
  items.forEach(li => {
    const dateStr = li.getAttribute('data-date');
    const eventDate = parseISODateLike(dateStr);
    if (!eventDate) return; // can't parse, leave visible
    eventDate.setHours(0, 0, 0, 0);

    // Hide event if it is before today (i.e., older than today).
    if (eventDate < today) {
      li.classList.add('hidden');
    }
  });
});

// Smooth scroll handler for in-page nav links (with optional header offset)
document.addEventListener('DOMContentLoaded', () => {
  // Select nav links that point to anchors
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  if (!navLinks.length) return;

  // Configuration: if true, clicking a nav link will align the target
  // section to the very top of the viewport (offset = 0). If false,
  // the script will account for header+nav height so the section appears
  // below the sticky nav. Set to true if you want the section at the top.
  const ALIGN_SECTION_TO_TOP = true;

  // Include header and nav heights to compute an accurate offset so the
  // target section appears below the sticky nav when ALIGN_SECTION_TO_TOP is false.
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  const getHeaderOffset = () => {
    let offset = 0;
    if (header) offset += header.offsetHeight;
    if (nav) offset += nav.offsetHeight;
    return offset;
  };

  // Set scroll-padding-top so native anchor jumps (if any) respect the nav.
  const updateScrollPadding = () => {
    const pad = ALIGN_SECTION_TO_TOP ? 0 : getHeaderOffset();
    document.documentElement.style.scrollPaddingTop = pad + 'px';
  };
  updateScrollPadding();
  window.addEventListener('resize', updateScrollPadding);

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

  const offset = ALIGN_SECTION_TO_TOP ? 0 : getHeaderOffset();
  // Small tweak (in pixels) to adjust final scroll position when it lands
  // a little too far. Positive moves the page slightly further down (target
  // appears higher); negative moves it up (target appears lower). Tweak as needed.
  const SCROLL_TWEAK_PX = -60;
  const top = target.getBoundingClientRect().top + window.scrollY - offset + SCROLL_TWEAK_PX;

      window.scrollTo({ top, behavior: 'smooth' });

      // After the smooth scroll finishes (or nearly finishes), correct small
      // overshoot by computing the actual distance and nudging the window by
      // the difference. This prevents the final position from being a few
      // pixels off on some browsers/layouts.
      setTimeout(() => {
        const currentTop = target.getBoundingClientRect().top;
        const desiredTop = offset - SCROLL_TWEAK_PX; // math derived from scroll target
        const delta = currentTop - desiredTop;
        if (Math.abs(delta) > 2) {
          // instant correction to avoid another long animation
          window.scrollBy({ top: delta, behavior: 'auto' });
        }
      }, 450);

      // Update the URL hash without jumping
      if (history.pushState) {
        history.pushState(null, '', '#' + id);
      } else {
        // fallback
        location.hash = '#' + id;
      }

      // For accessibility, move focus to target after scrolling
      setTimeout(() => {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, 300);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const popup = document.getElementById("popup");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop default form behavior

    const formData = new FormData(form);

    try {
      await fetch("https://formsubmit.co/ajax/booktherealmusiczone@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });

      popup.classList.remove("hidden");
      form.reset();

      setTimeout(() => {
        popup.classList.add("hidden");
      }, 5000);
    } catch (error) {
      alert("Oops! Something went wrong.");
      console.error(error);
    }
  });
});

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

// --- Star layer with parallax ---
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (!header) return;

  // create star layer container
  let layer = header.querySelector('.star-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'star-layer';
    header.appendChild(layer);
  }

  const STAR_COUNT = 18; // adjust density
  const colors = ['rgba(255,255,255,0.95)', 'rgba(220,180,255,0.9)', 'rgba(200,150,255,0.85)', 'rgba(180,120,255,0.8)'];

  // generate stars only if not already generated
  if (!layer.dataset.generated) {
    for (let i = 0; i < STAR_COUNT; i++) {
      const el = document.createElement('span');
      el.className = 'star';
      // size class
      const sizeRand = Math.random();
      if (sizeRand < 0.6) el.classList.add('small');
      else if (sizeRand < 0.9) el.classList.add('med');
      else el.classList.add('large');

      // position
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      el.style.left = left + '%';
      el.style.top = top + '%';

      // color and opacity
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.opacity = (0.6 + Math.random() * 0.4).toString();

      // twinkle duration and delay
      const dur = 1.8 + Math.random() * 2.2; // faster, stronger twinkle
      el.style.animation = `star-twinkle ${dur}s ease-in-out ${Math.random() * dur}s infinite`;

      layer.appendChild(el);
    }
    layer.dataset.generated = '1';
  }

  // parallax: use mousemove for desktops, scroll offset for subtle effect
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  const strength = 12; // px of max translation

  function onMove(clientX, clientY) {
    const r = header.getBoundingClientRect();
    const nx = (clientX - (r.left + r.width / 2)) / (r.width / 2); // -1..1
    const ny = (clientY - (r.top + r.height / 2)) / (r.height / 2);
    targetX = nx * strength * -1; // invert for parallax
    targetY = ny * strength * -1;
  }

  // mousemove
  header.addEventListener('mousemove', (e) => {
    onMove(e.clientX, e.clientY);
  });

  // touch move: use center point
  header.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  // scroll-based subtle parallax
  window.addEventListener('scroll', () => {
    const rect = header.getBoundingClientRect();
    const pct = Math.min(Math.max((window.scrollY - rect.top) / (rect.height + 1), -1), 1);
    targetY += pct * 6; // small vertical shift with scroll
  }, { passive: true });

  // smooth lerp update
  function raf() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    layer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});

// --- Site-wide star layer (twinkle + gentle parallax) ---
document.addEventListener('DOMContentLoaded', () => {
  // create or reuse the site layer
  let site = document.querySelector('.site-star-layer');
  if (!site) {
    site = document.createElement('div');
    site.className = 'site-star-layer';
    document.body.insertBefore(site, document.body.firstChild);
  }

  // generate stars for the site layer
  if (!site.dataset.generated) {
    const SITE_STAR_COUNT = 60; // density for entire page
    const colors = ['rgba(255,255,255,0.95)', 'rgba(220,180,255,0.85)', 'rgba(200,150,255,0.75)'];

    const w = window.innerWidth;
    const h = Math.max(window.innerHeight, 300);

    for (let i = 0; i < SITE_STAR_COUNT; i++) {
      const s = document.createElement('span');
      s.className = 'star';

      // size variety
      const r = Math.random();
      if (r < 0.7) s.style.width = s.style.height = '2px';
      else if (r < 0.95) s.style.width = s.style.height = '3.5px';
      else s.style.width = s.style.height = '5px';

      // random position across viewport
      s.style.left = (Math.random() * 100) + '%';
      s.style.top = (Math.random() * 100) + '%';

      // color + opacity
      s.style.background = colors[Math.floor(Math.random() * colors.length)];
      s.style.opacity = (0.45 + Math.random() * 0.55).toString();

      // slower multiphase twinkle
      const dur = 2.8 + Math.random() * 3.5;
      s.style.animation = `star-twinkle ${dur}s ease-in-out ${Math.random() * dur}s infinite`;

      site.appendChild(s);
    }

    site.dataset.generated = '1';
  }

  // gentle parallax for site layer: responds to mouse and scroll, small strength
  let tx = 0, ty = 0, cx = 0, cy = 0;
  const strength = 6; // smaller movement site-wide

  function updateTargetFromMouse(clientX, clientY) {
    const nx = (clientX / window.innerWidth) - 0.5; // -0.5..0.5
    const ny = (clientY / window.innerHeight) - 0.5;
    tx = nx * strength * -1;
    ty = ny * strength * -1;
  }

  window.addEventListener('mousemove', (e) => {
    updateTargetFromMouse(e.clientX, e.clientY);
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) updateTargetFromMouse(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight || 1000);
    ty = ty + (pct - 0.5) * 0.6; // tiny vertical nudge with scroll
  }, { passive: true });

  function rafSite() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    site.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(rafSite);
  }
  requestAnimationFrame(rafSite);
});