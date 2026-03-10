/* ============================================================
   MarsCart — Premium Animation System
   Mouse Parallax · Scroll Parallax · Liquid Glass · Spring
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    if (typeof gsap === 'undefined') { console.warn('[MarsCart] GSAP not loaded.'); return; }
    gsap.registerPlugin(ScrollTrigger);

    /* ════════════════════════════════════════════════════════════
       1.  MOUSE PARALLAX — Hero orbs + floating cards
       Listens to mouse position and moves elements at different depths
    ════════════════════════════════════════════════════════════ */
    (function initMouseParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        let mx = 0, my = 0;
        let cx = 0, cy = 0;

        // Smooth mouse following
        document.addEventListener('mousemove', (e) => {
            // Normalise mouse to -1 → +1 relative to viewport centre
            mx = (e.clientX / window.innerWidth - 0.5) * 2;
            my = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // RAF loop — smooth lerp so it feels liquid, not instant
        function lerpMouseParallax() {
            cx += (mx - cx) * 0.07;
            cy += (my - cy) * 0.07;

            document.querySelectorAll('.mouse-parallax').forEach((el) => {
                const depth = parseFloat(el.dataset.depth) || 0.05;
                const dx = cx * depth * 120;
                const dy = cy * depth * 80;
                el.style.transform = `translate(${dx}px, ${dy}px)`;
            });

            requestAnimationFrame(lerpMouseParallax);
        }
        requestAnimationFrame(lerpMouseParallax);
    })();

    /* ════════════════════════════════════════════════════════════
       2.  SCROLL PARALLAX — Hero layers move at different depths
       hero-content moves slower, hero-visual a little faster
    ════════════════════════════════════════════════════════════ */
    (function initScrollParallax() {
        // Hero content layer (slow depth)
        if (document.querySelector('.hero-content')) {
            gsap.to('.hero-content', {
                yPercent: -12,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
        // Hero visual (dashboard) moves slightly faster
        if (document.querySelector('.hero-visual')) {
            gsap.to('.hero-visual', {
                yPercent: -22,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2
                }
            });
        }
        // Hero bg grid fades out as you scroll
        if (document.querySelector('.hero-bg-grid')) {
            gsap.to('.hero-bg-grid', {
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: '40% top',
                    scrub: 1
                }
            });
        }
        // Subtle parallax on each section blob
        document.querySelectorAll('.parallax-blob').forEach((blob) => {
            gsap.to(blob, {
                yPercent: -40,
                ease: 'none',
                scrollTrigger: {
                    trigger: blob.closest('.section'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        });
    })();

    /* ════════════════════════════════════════════════════════════
       3.  HORIZONTAL SCROLL — Roles Gallery
    ════════════════════════════════════════════════════════════ */
    (function initRolesHScroll() {
        const container = document.getElementById('rolesScrollContainer');
        const gallery = document.getElementById('rolesGallery');
        const fill = document.getElementById('rolesProgressFill');
        if (!container || !gallery) return;

        const cards = Array.from(gallery.querySelectorAll('.role-hcard'));
        const cardW = cards[0]?.offsetWidth || 460;
        const gap = 32;
        const totalPan = (cards.length - 1) * (cardW + gap);

        gsap.set(cards, { scale: 0.93, opacity: 0.5 });
        gsap.set(cards[0], { scale: 1.0, opacity: 1 });

        gsap.to(gallery, {
            x: -totalPan,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.2,
                onUpdate: (self) => {
                    if (fill) fill.style.width = (self.progress * 100) + '%';
                    const idx = Math.round(self.progress * (cards.length - 1));
                    cards.forEach((c, i) => {
                        gsap.to(c, {
                            scale: i === idx ? 1.0 : 0.93,
                            opacity: i === idx ? 1 : 0.5,
                            duration: 0.35,
                            overwrite: 'auto',
                            ease: 'power2.out'
                        });
                    });
                }
            }
        });
    })();

    /* ════════════════════════════════════════════════════════════
       4.  SPRING CARD STACK — Customer Experience
    ════════════════════════════════════════════════════════════ */
    (function initCxCards() {
        const wraps = document.querySelectorAll('.cx-card-wrap');
        if (!wraps.length) return;

        wraps.forEach((wrap) => {
            const card = wrap.querySelector('.cx-card');
            const splash = wrap.querySelector('.cx-splash');
            if (!card) return;

            gsap.set(card, { y: 80, opacity: 0 });

            gsap.to(card, {
                y: 0, opacity: 1, duration: 0.85,
                ease: 'back.out(1.4)',
                scrollTrigger: {
                    trigger: wrap, start: 'top 82%',
                    toggleActions: 'play none none reverse'
                }
            });

            if (splash) {
                gsap.from(splash, {
                    opacity: 0, scale: 0.5, duration: 0.7, ease: 'power2.out',
                    scrollTrigger: {
                        trigger: wrap, start: 'top 82%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
        });
    })();

    /* ════════════════════════════════════════════════════════════
       5.  NAVBAR — liquid glass tightens on scroll
    ════════════════════════════════════════════════════════════ */
    ScrollTrigger.create({
        start: 'top -60',
        onEnter: () => document.getElementById('navbar')?.classList.add('scrolled'),
        onLeaveBack: () => document.getElementById('navbar')?.classList.remove('scrolled'),
    });

    /* ════════════════════════════════════════════════════════════
       6.  HERO ENTRANCE — text rises in on load
    ════════════════════════════════════════════════════════════ */
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .from('.hero-badge', { y: 24, opacity: 0, duration: 0.7 }, 0.1)
        .from('.hero-headline', { y: 70, opacity: 0, duration: 0.85 }, 0.2)
        .from('.hero-sub', { y: 40, opacity: 0, duration: 0.7 }, 0.38)
        .from('.hero-actions', { y: 30, opacity: 0, duration: 0.6 }, 0.52)
        .from('.hero-stats', { y: 20, opacity: 0, duration: 0.55 }, 0.65)
        .from('.hero-visual', { y: 60, opacity: 0, duration: 0.85 }, 0.28);

    /* ════════════════════════════════════════════════════════════
       7.  SECTION FADE + LABEL / TITLE REVEALS
    ════════════════════════════════════════════════════════════ */
    gsap.utils.toArray('.section-label').forEach(el =>
        gsap.from(el, {
            y: 20, opacity: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        })
    );
    gsap.utils.toArray('.section-title').forEach(el =>
        gsap.from(el, {
            y: 50, opacity: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        })
    );
    gsap.utils.toArray('.section-sub').forEach(el =>
        gsap.from(el, {
            y: 28, opacity: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        })
    );

    /* ════════════════════════════════════════════════════════════
       8.  CARD STAGGER REVEALS — every card type
    ════════════════════════════════════════════════════════════ */
    const staggerGroups = [
        { el: '.module-card', trigger: '.modules-grid' },
        { el: '.bento-card', trigger: '.features-bento' },
        { el: '.analytics-metric', trigger: '.analytics-sidebar' },
        { el: '.chart-card', trigger: '.analytics-main' },
        { el: '.tech-card', trigger: '#tech' },
        { el: '.review-card', trigger: '.reviews-grid' },
        { el: '.blog-card', trigger: '.blog-grid' },
        { el: '.security-row', trigger: '.security-grid' },
        { el: '.journey-step', trigger: '.journey-flow' },
    ];

    staggerGroups.forEach(({ el, trigger }) => {
        if (!document.querySelector(el)) return;
        gsap.from(el, {
            y: 55, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger, start: 'top 82%', toggleActions: 'play none none none' }
        });
    });

    /* ════════════════════════════════════════════════════════════
       9.  CTA REVEAL
    ════════════════════════════════════════════════════════════ */
    if (document.querySelector('.cta-headline')) {
        const ctaTl = gsap.timeline({
            scrollTrigger: { trigger: '#cta', start: 'top 85%', toggleActions: 'play none none none' }
        });
        ctaTl
            .from('.cta-headline', { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out' })
            .from('.cta-sub', { y: 32, opacity: 0, duration: 0.65, ease: 'power2.out' }, '-=0.4')
            .from('.cta-actions', { y: 22, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35');
    }

    /* ════════════════════════════════════════════════════════════
       10. LOGO STRIP & FOOTER
    ════════════════════════════════════════════════════════════ */
    if (document.querySelector('.logo-item')) {
        gsap.from('.logo-item', {
            y: 18, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out',
            scrollTrigger: { trigger: '.logos-section', start: 'top 92%', toggleActions: 'play none none none' }
        });
    }
    if (document.querySelector('.footer')) {
        gsap.from('.footer', {
            opacity: 0, y: 24, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: '.footer', start: 'top 96%', toggleActions: 'play none none none' }
        });
    }

    /* ════════════════════════════════════════════════════════════
       11. FLOATING CARDS — continuous gentle float animation
    ════════════════════════════════════════════════════════════ */
    document.querySelectorAll('.floating-card').forEach((card, i) => {
        gsap.to(card, {
            y: i % 2 === 0 ? -10 : -14,
            duration: 2.8 + i * 0.4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });
    });

});
