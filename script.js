// ===== GROWTHLINKS INTERACTIVE SCRIPT =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initParticleCanvas();
    initFloatingSymbols();
    initPageTransitions();
    initTypingEffect();
    initNavbarScroll();
});

// ===== NAVIGATION =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-overlay a');

    if (!hamburger || !navOverlay) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.html')) {
                e.preventDefault();
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                if (href !== currentPage) {
                    transitionToPage(href);
                }
            }
            hamburger.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===== PAGE TRANSITIONS =====
function initPageTransitions() {
    // Add transition overlay to body
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    document.body.appendChild(overlay);

    // Fade in on load
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
}

function transitionToPage(url) {
    const overlay = document.querySelector('.page-transition');
    if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    } else {
        window.location.href = url;
    }
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate child elements with stagger
                const children = entry.target.querySelectorAll('.step-card, .process-item, .result-card, .contact-card');
                children.forEach((child, i) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, i * 150);
                });
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('.section-title, .steps-grid, .process-flow, .results-grid, .about-card, .contact-grid, .social-section, .cta-final');
    sections.forEach(section => observer.observe(section));

    // Also observe individual cards that aren't in observed containers
    const cards = document.querySelectorAll('.step-card, .process-item, .result-card, .contact-card');
    cards.forEach(card => observer.observe(card));
}

// ===== PARTICLE CANVAS =====
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isActive = true;

    function resize() {
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? '138, 43, 226' : '0, 200, 83';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw connection lines
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(138, 43, 226, ${0.1 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        if (!isActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    // Visibility handling
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isActive = false;
            cancelAnimationFrame(animationId);
        } else {
            isActive = true;
            animate();
        }
    });

    animate();
}

// ===== FLOATING SYMBOLS =====
function initFloatingSymbols() {
    const containers = document.querySelectorAll('.floating-symbols');
    const symbols = ['💡', '⚡', '🚀', '💰', '🔗', '📈', '✨', '🎯', '🏆', '💎'];

    containers.forEach(container => {
        for (let i = 0; i < 12; i++) {
            const symbol = document.createElement('div');
            symbol.className = 'symbol';
            symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            symbol.style.left = `${Math.random() * 100}%`;
            symbol.style.animationDuration = `${Math.random() * 10 + 10}s`;
            symbol.style.animationDelay = `${Math.random() * 5}s`;
            symbol.style.fontSize = `${Math.random() * 1 + 1}rem`;
            container.appendChild(symbol);
        }
    });
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const element = document.querySelector('.typing-text');
    if (!element) return;

    const text = element.getAttribute('data-text') || element.textContent;
    element.textContent = '';
    element.style.opacity = '1';

    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }

    setTimeout(type, 300);
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    function update() {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    update();
}

// ===== PARALLAX EFFECT =====
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, { passive: true });
}

// Export for use in other scripts
window.GrowthLinks = {
    transitionToPage,
    animateCounter
};
