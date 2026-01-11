
const tabs = document.querySelectorAll("nav li");
const sections = document.querySelectorAll(".tab");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});


(function() {
  const lightboxEl = document.getElementById('lightbox');
  const lightboxImgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const closeBtn = lightboxEl.querySelector('.close');
  const prevBtn = lightboxEl.querySelector('.lightbox-prev');
  const nextBtn = lightboxEl.querySelector('.lightbox-next');

  
  const allPhotos = Array.from(document.querySelectorAll('.photo-gallery img'));
  if (!allPhotos.length) return;

  let activeNodes = []; 
  let current = 0;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getCaptionFrom(imgEl) {
    const fig = imgEl.closest('figure');
    if (fig) {
      const cap = fig.querySelector('figcaption');
      if (cap && cap.innerText.trim()) return cap.innerText.trim();
    }
    return imgEl.alt || '';
  }

  function showActiveIndex(idx) {
    if (!activeNodes.length) return;
    current = ((idx % activeNodes.length) + activeNodes.length) % activeNodes.length;
    const img = activeNodes[current];
    lightboxImgEl.src = img.src;
    lightboxImgEl.alt = img.alt || '';
    captionEl.textContent = getCaptionFrom(img);
    document.body.classList.add('lightbox-open');
    
    try {
      if (window.starfieldControl && typeof window.starfieldControl.pause === 'function') {
        window.starfieldControl.pause();
      }
    } catch (e) { }

    if (!prefersReduced) void lightboxEl.offsetWidth;
    lightboxEl.classList.add('show');
    lightboxEl.setAttribute('aria-hidden', 'false');
  }

  function openGalleryAt(img) {
    const gallery = img.closest('.photo-gallery') || document.querySelector('.photo-gallery');
    activeNodes = Array.from(gallery.querySelectorAll('img'));
    const idx = activeNodes.indexOf(img);
    showActiveIndex(idx >= 0 ? idx : 0);
  }

  
  allPhotos.forEach(img => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      openGalleryAt(img);
    });
  });

  function closeLightbox() {
    lightboxEl.classList.remove('show');
    lightboxEl.setAttribute('aria-hidden', 'true');
    const restore = () => {
      document.body.classList.remove('lightbox-open');
      lightboxImgEl.src = '';
      captionEl.textContent = '';
      activeNodes = [];
      current = 0;
      
      try {
        if (window.starfieldControl && typeof window.starfieldControl.resume === 'function') {
          window.starfieldControl.resume();
        }
      } catch (e) {  }
    };
    if (prefersReduced) restore();
    else {
      const onEnd = (e) => {
        if (e.target === lightboxEl && e.propertyName === 'opacity') {
          lightboxEl.removeEventListener('transitionend', onEnd);
          restore();
        }
      };
      lightboxEl.addEventListener('transitionend', onEnd);
      setTimeout(restore, 800);
    }
  }

  function prev() { if (activeNodes.length) showActiveIndex(current - 1); }
  function next() { if (activeNodes.length) showActiveIndex(current + 1); }

  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });

  lightboxEl.addEventListener('click', (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightboxEl.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  });

 
  let startX = null;
  lightboxEl.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) startX = e.touches[0].clientX;
  }, { passive: true });
  lightboxEl.addEventListener('touchend', (e) => {
    if (!startX || !e.changedTouches || !e.changedTouches[0]) { startX = null; return; }
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { if (dx > 0) prev(); else next(); }
    startX = null;
  });

})();


const hobbyCards = document.querySelectorAll(".hobby-card");
const hobbyDetails = document.querySelector(".hobby-details");
const subtabs = document.querySelectorAll(".subtab");
const backButtons = document.querySelectorAll(".back-btn");

hobbyCards.forEach(card => {
  card.addEventListener("click", () => {
    const subtabId = card.dataset.subtab;

    hobbyDetails.style.display = "block";
    subtabs.forEach(st => st.classList.remove("active"));

    document.getElementById(subtabId).classList.add("active");
    card.parentElement.style.display = "none";
  });
});

backButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    hobbyDetails.style.display = "none";
    document.querySelector(".hobbies-grid").style.display = "grid";

    subtabs.forEach(st => st.classList.remove("active"));

    const writingFull = document.querySelector(".writing-full");
    const writingPreview = document.querySelector(".writing-preview");

    if (writingFull && writingPreview) {
      writingFull.style.display = "none";
      writingPreview.style.display = "block";
    }
  });
});


const showMore = document.querySelector(".show-more");

if (showMore) {
  showMore.addEventListener("click", () => {
    const full = document.querySelector(".writing-full");
    const preview = document.querySelector(".writing-preview");

    if (full && preview) {
      full.style.display = "block";
      preview.style.display = "none";
    }
  });
}


(() => {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  const TRAIL_COUNT = 3;
  const trails = [];
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const t = document.createElement('div');
    t.className = 'cursor-trail';
  
    if (i > 3) t.classList.add('xxsmall');
    else if (i > 1) t.classList.add('xsmall');
    else t.classList.add('small');
    document.body.appendChild(t);
    trails.push({el: t, x: window.innerWidth / 2, y: window.innerHeight / 2});
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  function animate() {
    
    for (let i = 0; i < trails.length; i++) {
      const p = trails[i];
      const targetX = i === 0 ? mouseX : trails[i - 1].x;
      const targetY = i === 0 ? mouseY : trails[i - 1].y;
      
      const factor = 0.34 - (i * 0.04);
      p.x = lerp(p.x, targetX, Math.max(0.12, factor));
      p.y = lerp(p.y, targetY, Math.max(0.12, factor));
      p.el.style.left = p.x + 'px';
      p.el.style.top = p.y + 'px';
      
      const baseOpacity = 0.9;
      p.el.style.opacity = String(baseOpacity - i * 0.12);
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  
  const hoverSelector = 'a, button, input, textarea, select, label, nav li, .hobby-card';
  document.querySelectorAll(hoverSelector).forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('grow'));
    el.addEventListener('mouseleave', () => dot.classList.remove('grow'));
  });

  
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    trails.forEach(t => t.el.style.opacity = '0');
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    trails.forEach((t, i) => t.el.style.opacity = String(0.9 - i * 0.12));
  });
})();


(() => {
  const btn = document.getElementById('gym-play');
  const audio = document.getElementById('gym-audio');
  if (!btn || !audio) return;

  
  function setPlaying(yes) {
    if (yes) {
      btn.classList.add('playing');
      btn.textContent = '❚❚';
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('playing');
      btn.textContent = '►';
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  
  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {  });
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  
  btn.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'mouse' || e.pointerType === 'touch') {
     
      setTimeout(() => btn.blur(), 60);
    }
  });

  
  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
})();


(() => {
  const el = document.getElementById('amman-clock');
  if (!el) return;

 
  el.innerHTML = '<div class="time">--:--:--</div><div class="label">AMMAN</div>';
  const timeEl = el.querySelector('.time');

  const fmtTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Amman',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

 
  const fmtDate = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Amman',
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  });

  function update() {
    const now = new Date();
    timeEl.textContent = fmtTime.format(now);
   
    el.setAttribute('title', `${fmtDate.format(now)} · ${timeEl.textContent} (Amman)`);
  }

  update();
  setInterval(update, 1000);
})();


(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;


  let running = true;
  let rafId = null;


  const STAR_DENSITY = 1 / 30000;
  let STAR_COUNT = Math.min(30, Math.floor(W * H * STAR_DENSITY));

  const stars = [];
  let t = 0;

  const rand = (a, b) => Math.random() * (b - a) + a;

  function initStars() {
    stars.length = 0;
    STAR_COUNT = Math.min(300, Math.floor(W * H * STAR_DENSITY));
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: rand(-0.02, 0.02),
        vy: rand(-0.02, 0.02),
        r: rand(0.4, 1.6),
        baseA: rand(0.25, 0.9),
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  initStars();


  const mouse = { x: W / 2, y: H / 2, moved: false };
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.moved = true;
  }, { passive: true });


  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
  });

  function drawStar(s, alpha) {

    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
    g.addColorStop(0, `rgba(255,255,255,${alpha})`);
    g.addColorStop(0.2, `rgba(255,255,255,${alpha * 0.5})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2);
    ctx.fill();


    ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha * 1.2)})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate() {
    if (!running) return;
    t += 0.016;

    ctx.clearRect(0, 0, W, H);

    const now = performance.now();

    const INFLUENCE = Math.max(80, Math.min(220, Math.hypot(W, H) * 0.06));
    const STRENGTH = 0.9; 

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];


      const tw = 0.5 + 0.5 * Math.sin(s.phase + t * (0.6 + (s.r * 0.18)));
      const alpha = s.baseA * (0.6 + tw * 0.4);


      s.x += s.vx;
      s.y += s.vy;


      s.vx *= 0.995;
      s.vy *= 0.995;

      if (s.x < -10) s.x = W + 10;
      if (s.x > W + 10) s.x = -10;
      if (s.y < -10) s.y = H + 10;
      if (s.y > H + 10) s.y = -10;


      if (mouse.moved) {
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < INFLUENCE && dist > 0.1) {

          const fall = (1 - (dist / INFLUENCE)) ** 2;
          const push = 0.6 * STRENGTH * fall;
          s.vx += (dx / dist) * push * (0.9 + Math.random() * 0.4);
          s.vy += (dy / dist) * push * (0.9 + Math.random() * 0.4);

          s.x += (dx / dist) * push * 0.2;
          s.y += (dy / dist) * push * 0.2;
        }
      }


      const vmax = 2.4;
      if (s.vx > vmax) s.vx = vmax;
      if (s.vx < -vmax) s.vx = -vmax;
      if (s.vy > vmax) s.vy = vmax;
      if (s.vy < -vmax) s.vy = -vmax;

      drawStar(s, alpha);
    }


    mouse.moved = Math.max(false, false);

    requestAnimationFrame(animate);
  }


  rafId = requestAnimationFrame(animate);


  function pause() {
    if (!running) return;
    running = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function resume() {
    if (running) return;
    running = true;
    if (!rafId) rafId = requestAnimationFrame(animate);
  }

  try {
    window.starfieldControl = { pause, resume, isRunning: () => running };
  } catch (e) {  }
})();
