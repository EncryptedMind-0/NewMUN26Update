


document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburger.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn-outline)');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function toggleNavbar() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    toggleNavbar();
    window.addEventListener('scroll', toggleNavbar, { passive: true });
});

function updateCountdown() {
    const target = new Date('October 3, 2026 08:00:00 GMT+3').getTime();
    const now = new Date().getTime();
    const diff = target - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl) return;

    if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

document.addEventListener('DOMContentLoaded', function () {
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!revealEls.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
});

document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('.count-num[data-target]');
    if (!counters.length) return;

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = value + suffix;
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target + suffix;
            }
        }
        requestAnimationFrame(tick);
    }

    const counterIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterIO.observe(el));
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.faq-item .question').forEach(q => {
        q.addEventListener('click', () => {
            q.parentElement.classList.toggle('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -9;
            const rotateY = ((x - cx) / cx) * 9;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) translateZ(12px) scale(1.015)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) translateZ(0) scale(1)';
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('waveBg');
    if (!container) return;


    function wavePath(width, period, amp, baseline) {
        const periods = width / period;
        let d = `M0,${baseline}`;
        for (let i = 0; i < periods; i++) {
            const x0 = i * period;
            d += ` C${x0 + period * 0.25},${baseline - amp} ${x0 + period * 0.75},${baseline + amp} ${x0 + period},${baseline}`;
        }
        return d;
    }

    const layers = [
        { period: 420, amp: 34, baseline: 60,  color: '#D4AF37', width: 3.5, opacity: 0.22, top: '10%',  duration: 22, reverse: false },
        { period: 520, amp: 46, baseline: 110, color: '#4f8dfd', width: 3,   opacity: 0.17, top: '42%',  duration: 30, reverse: true  },
        { period: 380, amp: 28, baseline: 70,  color: '#D4AF37', width: 2.5, opacity: 0.15, top: '74%',  duration: 26, reverse: false }
    ];

    const svgNS = 'http://www.w3.org/2000/svg';

    layers.forEach(layer => {
        const totalWidth = layer.period * 24;

        const wrap = document.createElement('div');
        wrap.className = 'wave-layer';
        wrap.style.top = layer.top;
        wrap.style.width = totalWidth + 'px';
        wrap.style.setProperty('--wave-shift', (layer.reverse ? '' : '-') + layer.period + 'px');
        wrap.style.animationDuration = layer.duration + 's';

        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', totalWidth);
        svg.setAttribute('height', 220);
        svg.setAttribute('viewBox', `0 0 ${totalWidth} 220`);

        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', wavePath(totalWidth, layer.period, layer.amp, layer.baseline));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', layer.color);
        path.setAttribute('stroke-width', layer.width);
        path.setAttribute('opacity', layer.opacity);

        svg.appendChild(path);
        wrap.appendChild(svg);
        container.appendChild(wrap);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    function toggleBtn() {
        btn.classList.toggle('visible', window.scrollY > 500);
    }
    toggleBtn();
    window.addEventListener('scroll', toggleBtn, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

document.addEventListener('DOMContentLoaded', function () {
    const wrap = document.getElementById('timelineModern');
    if (!wrap) return;

    const yearBtns = wrap.querySelectorAll('.tl-node');
    const mediaEl = document.getElementById('tlStageMedia');
    const yearEl = document.getElementById('tlStageYear');
    const descEl = document.getElementById('tlStageDesc');
    if (!yearBtns.length || !mediaEl || !yearEl || !descEl) return;

    function setStage(btn) {
        const icon = btn.getAttribute('data-icon');
        const desc = btn.getAttribute('data-desc');
        const year = btn.querySelector('.tl-node-year').textContent;

        yearBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        function applyContent() {
            mediaEl.innerHTML = '<i class="fas ' + icon + '"></i>';
            yearEl.textContent = year;
            descEl.textContent = desc;
        }

        if (typeof gsap !== 'undefined') {
            gsap.to([mediaEl.querySelector('i'), yearEl, descEl], {
                opacity: 0,
                duration: 0.15,
                onComplete: function () {
                    applyContent();
                    gsap.to([mediaEl.querySelector('i'), yearEl, descEl], { opacity: 1, duration: 0.25 });
                }
            });
        } else {
            applyContent();
        }
    }

    yearBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => setStage(btn));
        btn.addEventListener('click', () => setStage(btn));
        btn.addEventListener('focus', () => setStage(btn));
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const track = document.getElementById('councilToggle');
    if (!track) return;

    const seniorBtn = document.getElementById('toggleSenior');
    const juniorBtn = document.getElementById('toggleJunior');
    const seniorPanel = document.getElementById('seniorPanel');
    const juniorPanel = document.getElementById('juniorPanel');

    function setActive(which) {
        track.setAttribute('data-active', which);
        const isSenior = which === 'senior';
        seniorBtn.classList.toggle('active', isSenior);
        juniorBtn.classList.toggle('active', !isSenior);
        seniorPanel.classList.toggle('active', isSenior);
        juniorPanel.classList.toggle('active', !isSenior);

        const panel = isSenior ? seniorPanel : juniorPanel;
        const staggerEls = panel.querySelectorAll('.reveal-stagger');
        staggerEls.forEach(el => el.classList.add('visible'));
    }

    seniorBtn.addEventListener('click', () => setActive('senior'));
    juniorBtn.addEventListener('click', () => setActive('junior'));
});

document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.gallery-tab');
    if (!tabs.length) return;

    const items = document.querySelectorAll('.gallery-item[data-category]');

    function applyFilter(category) {
        items.forEach(item => {
            const matches = category === 'all' || item.getAttribute('data-category') === category;
            item.classList.toggle('gallery-visible', matches);
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            applyFilter(tab.getAttribute('data-filter'));
        });
    });

    const initial = document.querySelector('.gallery-tab.active');
    applyFilter(initial ? initial.getAttribute('data-filter') : 'all');
});

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, nodes;
    const NODE_COUNT = 46;
    const LINK_DIST = 150;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    function makeNodes() {
        nodes = Array.from({ length: NODE_COUNT }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.8
        }));
    }

    function step() {
        ctx.clearRect(0, 0, width, height);

        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DIST) {
                    ctx.strokeStyle = `rgba(212,175,55,${0.16 * (1 - dist / LINK_DIST)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(232,212,143,0.55)';
            ctx.fill();
        });

        if (!prefersReducedMotion) requestAnimationFrame(step);
    }

    resize();
    makeNodes();
    step();
    window.addEventListener('resize', () => {
        resize();
        makeNodes();
        if (prefersReducedMotion) step();
    });
});

(function () {


    const SESSION_KEY = 'newmunLoaderSeen';
    const hasSeenLoader = sessionStorage.getItem(SESSION_KEY) === '1';

    document.documentElement.classList.add('has-loader');
    document.addEventListener('DOMContentLoaded', function () {
        document.body.classList.add('loading');
    });

    const MIN_SHOW_MS = hasSeenLoader ? 150 : 1700;
    const MESSAGES = ['Assembling delegates', 'Drafting the agenda', 'Opening committees', 'Bridging horizons'];
    const started = Date.now();
    let dismissed = false;
    let msgTimer = null;

    function startLoaderSequence() {
        if (hasSeenLoader) return;
        const tagline = document.getElementById('loaderTagline');
        const fill = document.getElementById('loaderProgressFill');
        if (fill) requestAnimationFrame(() => { fill.style.width = '100%'; });
        if (!tagline) return;
        let i = 0;
        msgTimer = setInterval(() => {
            i = (i + 1) % MESSAGES.length;
            tagline.style.opacity = '0';
            setTimeout(() => {
                tagline.textContent = MESSAGES[i];
                tagline.style.opacity = '1';
            }, 200);
        }, 420);
    }
    startLoaderSequence();

    function dismissLoader() {
        if (dismissed) return;
        dismissed = true;
        sessionStorage.setItem(SESSION_KEY, '1');
        if (msgTimer) clearInterval(msgTimer);
        const loader = document.getElementById('loader');
        document.body.classList.remove('loading');
        playHeroEntrance();
        if (!loader) return;

        if (hasSeenLoader) {
            loader.classList.add('loader-fastskip');
        }
        loader.classList.add('loader-hidden');

        const half = loader.querySelector('.loader-half');
        let removed = false;
        function remove() {
            if (removed) return;
            removed = true;
            loader.remove();
        }
        if (half && !hasSeenLoader) {
            half.addEventListener('transitionend', remove, { once: true });
        }

        setTimeout(remove, hasSeenLoader ? 220 : 1100);
    }

    function playHeroEntrance() {
        const heroContent = document.querySelector('.hero-content');
        const heroLogo = document.querySelector('.hero-logo');
        if (!heroContent) return;

        const targets = [...heroContent.children];
        if (heroLogo) targets.push(heroLogo);
        if (!targets.length) return;

        if (typeof gsap !== 'undefined') {
            gsap.set(targets, { opacity: 0, y: 26 });
            gsap.to(targets, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        } else {

            targets.forEach(el => { el.style.opacity = '1'; });
        }
    }

    window.addEventListener('load', function () {
        const elapsed = Date.now() - started;
        const wait = Math.max(MIN_SHOW_MS - elapsed, 0);
        setTimeout(dismissLoader, wait);
    });

    setTimeout(dismissLoader, 4000);
})();

document.addEventListener('DOMContentLoaded', function () {
    const toc = document.getElementById('pageToc');
    if (!toc) return;
    const links = toc.querySelectorAll('a');
    const targets = Array.from(links)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    if (!targets.length) return;

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = '#' + entry.target.id;
                links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    targets.forEach(t => spy.observe(t));
});

function openModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}
document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open').forEach(overlay => closeModal(overlay.id));
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('particleNetwork');
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 90;
    const connectionDistance = isMobile ? 120 : 160;
    const mouseDistance = isMobile ? 150 : 200;

    let particles = [];
    let mouseX = null, mouseY = null;
    let canvas, ctx, width, height;

    canvas = document.createElement('canvas');
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    function resize() {
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    container.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    container.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            this.baseAlpha = Math.random() * 0.3 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouseX !== null && mouseY !== null) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseDistance) {
                    const force = (mouseDistance - dist) / mouseDistance;
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * 0.8;
                    const pushY = Math.sin(angle) * force * 0.8;
                    this.vx -= pushX * 0.02;
                    this.vy -= pushY * 0.02;
                }
            }

            const maxSpeed = 0.8;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > maxSpeed) {
                this.vx = (this.vx / speed) * maxSpeed;
                this.vy = (this.vy / speed) * maxSpeed;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.baseAlpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }
    animate();
});
