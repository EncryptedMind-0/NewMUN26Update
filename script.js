// =========================================================
// NewMUN 2026 — Site scripts
// Vanilla JS: nav, scroll reveals, counters, particle network, tilt
// =========================================================

// ===== HAMBURGER MENU =====
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

// ===== ACTIVE NAV LINK =====
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

// ===== NAVBAR GLASS-MORPHISM ON SCROLL =====
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

// ===== COUNTDOWN TIMER =====
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

// ===== SCROLL-TRIGGERED REVEALS (IntersectionObserver) =====
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

// ===== ANIMATED COUNTERS =====
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
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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

// ===== FAQ ACCORDION (used on faq-resources.html) =====
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.faq-item .question').forEach(q => {
        q.addEventListener('click', () => {
            q.parentElement.classList.toggle('active');
        });
    });
});

// ===== 3D TILT ON HOVER (cards with class "tilt-card") =====
document.addEventListener('DOMContentLoaded', function () {
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return; // skip tilt on touch devices

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

// ===== FLOWING WAVE BACKGROUND (seamless loop, built for perfect tiling) =====
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('waveBg');
    if (!container) return;

    // Builds a smooth repeating wave path. `width` MUST be an exact multiple of `period`
    // so that shifting the whole layer left by exactly one `period` loops with zero seam.
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
        const totalWidth = layer.period * 24; // wide enough for ultra-wide screens, always a clean multiple of period

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

// ===== BACK-TO-TOP SCROLL ARROW =====
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

// ===== THEME LAB (live color / gradient / glass / font customizer) =====
document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('themeLabToggle');
    const drawer = document.getElementById('themeLabDrawer');
    if (!toggleBtn || !drawer) return;

    const root = document.documentElement;
    const DEFAULTS = {
        navy: '#0A1128', navy2: '#150f30', violet: '#3a1768', violet2: '#5b2a9e',
        gold: '#D4AF37', goldLight: '#f0d78c',
        angle: 125, blur: 20, opacity: 5.5, fontPair: 'playfair-inter'
    };

    const FONT_PAIRS = {
        'playfair-inter': { heading: 'Playfair Display', body: 'Inter', gf: 'Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&family=Inter:wght@400;500;600;700;800;900' },
        'cormorant-manrope': { heading: 'Cormorant Garamond', body: 'Manrope', gf: 'Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Manrope:wght@400;500;600;700;800' },
        'fraunces-work': { heading: 'Fraunces', body: 'Work Sans', gf: 'Fraunces:ital,wght@0,600;0,700;0,800;1,600&family=Work+Sans:wght@400;500;600;700;800' },
        'marcellus-jost': { heading: 'Marcellus', body: 'Jost', gf: 'Marcellus&family=Jost:wght@400;500;600;700;800' },
        'baskerville-source': { heading: 'Libre Baskerville', body: 'Source Sans Pro', gf: 'Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+Pro:wght@400;500;600;700;800' },
        'bodoni-dm': { heading: 'Bodoni Moda', body: 'DM Sans', gf: 'Bodoni+Moda:ital,wght@0,600;0,700;0,800;1,600&family=DM+Sans:wght@400;500;600;700;800' }
    };

    let blurStyleEl = document.getElementById('tlBlurOverrideStyle');
    if (!blurStyleEl) {
        blurStyleEl = document.createElement('style');
        blurStyleEl.id = 'tlBlurOverrideStyle';
        document.head.appendChild(blurStyleEl);
    }
    const GLASS_SELECTORS = '.glass, .glass-card, .council-card, .oc-card, .faq-item, .resource-card, .step-card, .register-card, .sponsor-card, .modal-box, .navbar, .navbar.scrolled, .site-footer, .tl-stage, .toggle-track, .gallery-tab, .price-card, .venue-box, .message-box, .legacy-stats .stat, .council-preview-card, .testimonial-card, .council-media, #themeLabDrawer';

    function applyGradient() {
        const angle = els.angle.value;
        document.body.style.background =
            `linear-gradient(${angle}deg, var(--navy) 0%, var(--violet) 45%, var(--navy-2) 75%, var(--violet-2) 100%)`;
        document.body.style.backgroundSize = '320% 320%';
    }

    function applyBlurOpacity() {
        const blur = els.blur.value;
        const op = (els.opacity.value / 100).toFixed(3);
        blurStyleEl.textContent = `${GLASS_SELECTORS} { backdrop-filter: blur(${blur}px) saturate(150%) !important; -webkit-backdrop-filter: blur(${blur}px) saturate(150%) !important; }`;
        root.style.setProperty('--glass-bg', `rgba(255,255,255,${op})`);
    }

    function applyFontPair(key) {
        const pair = FONT_PAIRS[key] || FONT_PAIRS['playfair-inter'];
        let link = document.getElementById('tlFontLink');
        if (!link) {
            link = document.createElement('link');
            link.id = 'tlFontLink';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        link.href = `https://fonts.googleapis.com/css2?family=${pair.gf}&display=swap`;
        root.style.setProperty('--font-heading', `'${pair.heading}'`);
        root.style.setProperty('--font-body', `'${pair.body}'`);
    }

    const els = {
        navy: document.getElementById('tlNavy'),
        navy2: document.getElementById('tlNavy2'),
        violet: document.getElementById('tlViolet'),
        violet2: document.getElementById('tlViolet2'),
        gold: document.getElementById('tlGold'),
        goldLight: document.getElementById('tlGoldLight'),
        angle: document.getElementById('tlAngle'),
        blur: document.getElementById('tlBlur'),
        opacity: document.getElementById('tlOpacity'),
        fontPair: document.getElementById('tlFontPair')
    };
    if (!els.navy) return;

    els.navy.addEventListener('input', e => root.style.setProperty('--navy', e.target.value));
    els.navy2.addEventListener('input', e => root.style.setProperty('--navy-2', e.target.value));
    els.violet.addEventListener('input', e => { root.style.setProperty('--violet', e.target.value); applyGradient(); });
    els.violet2.addEventListener('input', e => { root.style.setProperty('--violet-2', e.target.value); applyGradient(); });
    els.gold.addEventListener('input', e => root.style.setProperty('--gold', e.target.value));
    els.goldLight.addEventListener('input', e => root.style.setProperty('--gold-light', e.target.value));
    els.angle.addEventListener('input', e => {
        document.getElementById('tlAngleVal').textContent = e.target.value + '°';
        applyGradient();
    });
    els.blur.addEventListener('input', e => {
        document.getElementById('tlBlurVal').textContent = e.target.value + 'px';
        applyBlurOpacity();
    });
    els.opacity.addEventListener('input', e => {
        document.getElementById('tlOpacityVal').textContent = e.target.value + '%';
        applyBlurOpacity();
    });
    els.fontPair.addEventListener('change', e => applyFontPair(e.target.value));

    toggleBtn.addEventListener('click', () => drawer.classList.toggle('open'));
    document.getElementById('tlCloseBtn')?.addEventListener('click', () => drawer.classList.remove('open'));

    document.getElementById('tlReset')?.addEventListener('click', () => {
        root.style.removeProperty('--navy');
        root.style.removeProperty('--navy-2');
        root.style.removeProperty('--violet');
        root.style.removeProperty('--violet-2');
        root.style.removeProperty('--gold');
        root.style.removeProperty('--gold-light');
        root.style.removeProperty('--glass-bg');
        root.style.removeProperty('--font-heading');
        root.style.removeProperty('--font-body');
        document.body.style.background = '';
        document.body.style.backgroundSize = '';
        blurStyleEl.textContent = '';
        const link = document.getElementById('tlFontLink');
        if (link) link.remove();

        els.navy.value = DEFAULTS.navy;
        els.navy2.value = DEFAULTS.navy2;
        els.violet.value = DEFAULTS.violet;
        els.violet2.value = DEFAULTS.violet2;
        els.gold.value = DEFAULTS.gold;
        els.goldLight.value = DEFAULTS.goldLight;
        els.angle.value = DEFAULTS.angle;
        els.blur.value = DEFAULTS.blur;
        els.opacity.value = DEFAULTS.opacity;
        els.fontPair.value = DEFAULTS.fontPair;
        document.getElementById('tlAngleVal').textContent = DEFAULTS.angle + '°';
        document.getElementById('tlBlurVal').textContent = DEFAULTS.blur + 'px';
        document.getElementById('tlOpacityVal').textContent = DEFAULTS.opacity + '%';
        
        // Reset theme preset buttons
        document.querySelectorAll('.theme-preset-btn').forEach(btn => btn.classList.remove('active'));
    });
    
    // ===== THEME PRESETS =====
    const themePresets = {
        classic: { navy: '#0A1128', navy2: '#0d1730', violet: '#142b63', violet2: '#1b3f8a', gold: '#D4AF37', goldLight: '#f0d78c', name: 'Classic Navy' },
        burgundy: { navy: '#1a0a0e', navy2: '#2d0f1a', violet: '#4a152b', violet2: '#6b1f3d', gold: '#c9a961', goldLight: '#e8d59a', name: 'Royal Burgundy' },
        emerald: { navy: '#0a1f1a', navy2: '#0f2d24', violet: '#144a3a', violet2: '#1a6b55', gold: '#7ec8a8', goldLight: '#b5e5cd', name: 'Emerald Dream' },
        royal: { navy: '#0d1221', navy2: '#1a1f3d', violet: '#2a2f6b', violet2: '#3d429e', gold: '#ffd700', goldLight: '#ffec8b', name: 'Midnight Royal' },
        monochrome: { navy: '#0a0a0a', navy2: '#1a1a1a', violet: '#2a2a2a', violet2: '#3a3a3a', gold: '#silver', goldLight: '#e0e0e0', name: 'Monochrome' },
        sunset: { navy: '#1a0f1a', navy2: '#2d1a2d', violet: '#4a2a4a', violet2: '#6b3a6b', gold: '#ff6b6b', goldLight: '#ffa5a5', name: 'Sunset Glow' }
    };
    
    // Create preset buttons in Theme Lab
    const presetsContainer = document.createElement('div');
    presetsContainer.className = 'theme-presets';
    presetsContainer.innerHTML = '<h4 style="color:var(--white);font-size:0.85rem;margin-bottom:12px;font-weight:600;">Quick Themes</h4><div class="preset-buttons"></div>';
    const presetButtonsDiv = presetsContainer.querySelector('.preset-buttons');
    
    Object.entries(themePresets).forEach(([key, theme]) => {
        const btn = document.createElement('button');
        btn.className = 'theme-preset-btn';
        btn.innerHTML = `<span class="preset-color" style="background:linear-gradient(135deg,${theme.navy},${theme.gold})"></span>${theme.name}`;
        btn.addEventListener('click', () => {
            root.style.setProperty('--navy', theme.navy);
            root.style.setProperty('--navy-2', theme.navy2);
            root.style.setProperty('--violet', theme.violet);
            root.style.setProperty('--violet-2', theme.violet2);
            root.style.setProperty('--gold', theme.gold);
            root.style.setProperty('--gold-light', theme.goldLight);
            applyGradient();
            
            // Update active state
            document.querySelectorAll('.theme-preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        presetButtonsDiv.appendChild(btn);
    });
    
    // Insert presets after the reset button
    const resetBtn = document.getElementById('tlReset');
    if (resetBtn) resetBtn.parentNode.insertBefore(presetsContainer, resetBtn.nextSibling);
});

// ===== TIMELINE STAGE (homepage "Our Journey") =====
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

// ===== COUNCIL TOGGLE (Senior / Junior) =====
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

        // Re-trigger stagger reveal animation on the panel that just appeared
        const panel = isSenior ? seniorPanel : juniorPanel;
        const staggerEls = panel.querySelectorAll('.reveal-stagger');
        staggerEls.forEach(el => el.classList.add('visible'));
    }

    seniorBtn.addEventListener('click', () => setActive('senior'));
    juniorBtn.addEventListener('click', () => setActive('junior'));
});

// ===== GALLERY FILTER TABS =====
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

    // Initialize with whichever tab is marked active in the HTML
    const initial = document.querySelector('.gallery-tab.active');
    applyFilter(initial ? initial.getAttribute('data-filter') : 'all');
});

// ===== HERO PARTICLE / DIPLOMATIC NETWORK CANVAS =====
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

// ===== LOADING SCREEN (book-reveal) =====
(function () {
    // Only play the full sequence once per browser session — after the first page,
    // internal navigation gets a quick fade instead of the whole animation replaying.
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
        if (hasSeenLoader) return; // skip message cycling + progress bar on repeat visits
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
        // Backup in case transitionend doesn't fire (reduced-motion, fast-skip, etc.)
        setTimeout(remove, hasSeenLoader ? 220 : 1100);
    }

    // GSAP hero entrance — plays the instant the loader reveals the page (index.html only)
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
            // No-GSAP fallback: simple CSS fade so content still appears correctly
            targets.forEach(el => { el.style.opacity = '1'; });
        }
    }

    window.addEventListener('load', function () {
        const elapsed = Date.now() - started;
        const wait = Math.max(MIN_SHOW_MS - elapsed, 0);
        setTimeout(dismissLoader, wait);
    });

    // Failsafe: never let the loader block the site if 'load' is delayed or JS partially fails
    setTimeout(dismissLoader, 4000);
})();

// ===== PAGE TABLE OF CONTENTS (scroll-spy) =====
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

// ===== SHARED MODAL SYSTEM (OC bios, Council "Know More") =====
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
    // Click outside the modal box (on the dark overlay) closes it
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });
    // Escape key closes whichever modal is open
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open').forEach(overlay => closeModal(overlay.id));
        }
    });
});

// ===== PARTICLE NETWORK BACKGROUND (interactive constellation effect) =====
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

    // Create canvas
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    function resize() {
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Track mouse
    container.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    container.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });

    // Particle class
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

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction
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

            // Limit velocity
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

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
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
