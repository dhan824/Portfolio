/* ============================================================
   DHANUJA VIDYA T — PORTFOLIO SCRIPT
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   1. THEME TOGGLE
   ---------------------------------------------------------- */
const themeBtn = document.getElementById('theme-btn');
const html     = document.documentElement;

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

/* ----------------------------------------------------------
   2. NAVBAR SCROLL + ACTIVE LINK
   ---------------------------------------------------------- */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 30);

  // Back-to-top
  const btt = document.getElementById('back-to-top');
  if (btt) btt.classList.toggle('visible', window.scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

/* ----------------------------------------------------------
   3. MOBILE MENU
   ---------------------------------------------------------- */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ----------------------------------------------------------
   4. TYPING ANIMATION
   ---------------------------------------------------------- */
const typedEl = document.getElementById('typed-text');
const words   = [
  'AI/ML Systems',
  'Deep Learning Models',
  'NLP Pipelines',
  'Full-Stack Apps',
  'Computer Vision'
];

let wordIdx  = 0;
let charIdx  = 0;
let isErasing = false;
const TYPING_SPEED  = 90;
const ERASE_SPEED   = 50;
const PAUSE_AFTER   = 1800;
const PAUSE_BEFORE  = 300;

function type() {
  const word = words[wordIdx];

  if (!isErasing) {
    typedEl.textContent = word.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === word.length) {
      isErasing = true;
      setTimeout(type, PAUSE_AFTER);
      return;
    }
    setTimeout(type, TYPING_SPEED);
  } else {
    typedEl.textContent = word.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isErasing = false;
      wordIdx   = (wordIdx + 1) % words.length;
      setTimeout(type, PAUSE_BEFORE);
      return;
    }
    setTimeout(type, ERASE_SPEED);
  }
}

setTimeout(type, 600);

/* ----------------------------------------------------------
   5. SCROLL REVEAL
   ---------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // staggered delay based on sibling index
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx      = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ----------------------------------------------------------
   6. SKILL BARS
   ---------------------------------------------------------- */
const skillFills   = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const pct  = fill.getAttribute('data-pct');
      fill.style.width = pct + '%';
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ----------------------------------------------------------
   7. CONTACT FORM
   ---------------------------------------------------------- */
const contactForm   = document.getElementById('contact-form');
const formSuccess   = document.getElementById('form-success');
const formSubmitBtn = document.getElementById('form-submit');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message) {
      shakeForm();
      return;
    }

    // Simulate sending
    const btnSpan = formSubmitBtn.querySelector('span');
    btnSpan.textContent = 'Sending…';
    formSubmitBtn.disabled = true;

    setTimeout(() => {
      contactForm.classList.add('hidden');
      formSuccess.classList.remove('hidden');
    }, 1400);
  });
}

function shakeForm() {
  contactForm.style.animation = 'shake 0.4s ease';
  contactForm.addEventListener('animationend', () => {
    contactForm.style.animation = '';
  }, { once: true });
}

// Inject shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ----------------------------------------------------------
   8. PARTICLE CANVAS
   ---------------------------------------------------------- */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');

  let W, H, particles;
  const PARTICLE_COUNT = 80;
  const MAX_DIST       = 130;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      this.r    = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = ['#6366f1','#a855f7','#ec4899','#06b6d4'][Math.floor(Math.random()*4)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${0.25 * (1 - dist/MAX_DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();
})();

/* ----------------------------------------------------------
   9. SMOOTH SCROLL (fallback for browsers)
   ---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ----------------------------------------------------------
   10. PROJECT CARD — 3D TILT ON HOVER
   ---------------------------------------------------------- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width / 2;
    const cy     = rect.height / 2;
    const rotX   = ((y - cy) / cy) * -6;
    const rotY   = ((x - cx) / cx) * 6;
    card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});

/* ----------------------------------------------------------
   11. ANIMATED COUNTER (Highlight Numbers)
   ---------------------------------------------------------- */
function animateCounter(el, target, duration = 1200, suffix = '') {
  let start     = 0;
  const isFloat = String(target).includes('.');
  const step    = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const val      = isFloat
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const highlightNums = document.querySelectorAll('.highlight-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el      = entry.target;
      const text    = el.textContent.trim();
      const suffix  = text.replace(/[\d.]/g, '');   // e.g. '+', '%'
      const value   = parseFloat(text);
      animateCounter(el, value, 1200, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });

highlightNums.forEach(n => counterObserver.observe(n));
