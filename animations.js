/* ============================================================
   MarsCart — Stryds-style Animations
   Lenis smooth scroll + GSAP ScrollTrigger
   ============================================================ */

(function () {
    /* ── 1. GSAP Plugin Registration ───────────────────────── */
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('[animations.js] GSAP or ScrollTrigger not loaded.');
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    /* ── 2. Lenis Smooth Scroll ─────────────────────────────── */
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            lerp: 0.08
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Keep ScrollTrigger in sync
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    /* ── 3. Navbar scroll effect ────────────────────────────── */
    const navbar = document.querySelector('#navbar');
    if (navbar) {
        ScrollTrigger.create({
            start: 'top -80',
            onEnter: () => navbar.classList.add('scrolled'),
            onLeaveBack: () => navbar.classList.remove('scrolled'),
        });
    }

    /* ── 4. Hero Text Entrance (slides up from below) ───────── */
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (document.querySelector('.hero-badge')) {
        heroTimeline.from('.hero-badge', { y: 30, opacity: 0, duration: 0.8 }, 0.2);
    }
    if (document.querySelector('.hero-headline')) {
        heroTimeline.from('.hero-headline', { y: 120, opacity: 0, duration: 1.2 }, 0.35);
    }
    if (document.querySelector('.hero-sub')) {
        heroTimeline.from('.hero-sub', { y: 60, opacity: 0, duration: 1.0 }, 0.55);
    }
    if (document.querySelector('.hero-actions')) {
        heroTimeline.from('.hero-actions', { y: 40, opacity: 0, duration: 0.9 }, 0.7);
    }
    if (document.querySelector('.hero-stats')) {
        heroTimeline.from('.hero-stats', { y: 30, opacity: 0, duration: 0.8 }, 0.85);
    }
    if (document.querySelector('.hero-visual')) {
        heroTimeline.from('.hero-visual', { y: 80, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.4);
    }

    /* ── 5. Dashboard Parallax ──────────────────────────────── */
    if (document.querySelector('.dashboard-frame')) {
        gsap.to('.dashboard-frame', {
            y: -80,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                scrub: true,
                start: 'top top',
                end: 'bottom top'
            }
        });
    }

    /* ── 6. Section Fade-In ─────────────────────────────────── */
    gsap.utils.toArray('.section').forEach((section) => {
        gsap.from(section, {
            opacity: 0,
            y: 60,
            duration: 1.0,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    /* ── 7. Feature Cards Stagger ───────────────────────────── */
    if (document.querySelector('.feature-card')) {
        gsap.from('.feature-card', {
            y: 80,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#features',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }

    /* ── 8. Platform / Role Cards ───────────────────────────── */
    if (document.querySelector('.platform-card')) {
        gsap.from('.platform-card', {
            y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '#platform', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }
    if (document.querySelector('.role-card')) {
        gsap.from('.role-card', {
            y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '#roles', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 9. Analytics Metrics Stagger ───────────────────────── */
    if (document.querySelector('.analytics-metric')) {
        gsap.from('.analytics-metric', {
            y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '#analytics', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 10. Review Cards Stagger ───────────────────────────── */
    if (document.querySelector('.review-card')) {
        gsap.from('.review-card', {
            y: 60, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: '#reviews', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 11. Blog Cards Stagger ─────────────────────────────── */
    if (document.querySelector('.blog-card')) {
        gsap.from('.blog-card', {
            y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '#blog', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 12. CTA Section ─────────────────────────────────────── */
    if (document.querySelector('#cta .cta-headline')) {
        gsap.from('#cta .cta-headline', {
            y: 80, opacity: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: '#cta', start: 'top 85%', toggleActions: 'play none none none' }
        });
    }

    /* ── 13. Section Title + Label Reveals ───────────────────── */
    gsap.utils.toArray('.section-label, .section-title').forEach((el) => {
        gsap.from(el, {
            y: 40, opacity: 0, duration: 0.9, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        });
    });

    /* ── 14. Logos row fade-in ───────────────────────────────── */
    if (document.querySelector('.logo-item')) {
        gsap.from('.logo-item', {
            y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: '.logos-section', start: 'top 90%', toggleActions: 'play none none none' }
        });
    }

})();
