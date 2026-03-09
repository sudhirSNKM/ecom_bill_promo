/* ============================================================
   ZENITH — Enhanced Animation System
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. NAVBAR — scroll shadow
    ============================================================ */
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
        parallaxHero();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ============================================================
       2. MOBILE HAMBURGER
    ============================================================ */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger?.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        const isOpen = mobileMenu.classList.contains('open');
        spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
        spans[1].style.opacity = isOpen ? '0' : '';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
    mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }));

    /* ============================================================
       3. HERO — Parallax animation
       Elements drift at different rates as you scroll down
    ============================================================ */
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    const heroSection = document.querySelector('.hero');
    const floatCards = document.querySelectorAll('.floating-card');
    const heroBadge = document.querySelector('.hero-badge');
    const heroBgGrid = document.querySelector('.hero-bg-grid');

    // Initial entrance animation
    const heroItems = [heroBadge, ...document.querySelectorAll('.hero-headline, .hero-sub, .hero-actions, .hero-stats')];
    heroItems.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(32px)';
        setTimeout(() => {
            el.style.transition = `opacity 0.75s ease ${i * 100}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms`;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 80 + i * 80);
    });

    if (heroVisual) {
        heroVisual.style.opacity = '0';
        heroVisual.style.transform = 'translateY(48px) scale(0.97)';
        setTimeout(() => {
            heroVisual.style.transition = 'opacity 0.9s ease 300ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) 300ms';
            heroVisual.style.opacity = '1';
            heroVisual.style.transform = 'translateY(0) scale(1)';
        }, 200);
    }

    function parallaxHero() {
        if (!heroSection) return;
        const rect = heroSection.getBoundingClientRect();
        if (rect.bottom < 0) return;
        const sy = window.scrollY;

        if (heroContent) heroContent.style.transform = `translateY(${sy * 0.18}px)`;
        if (heroVisual) heroVisual.style.transform = `translateY(${sy * 0.08}px)`;
        if (heroBgGrid) heroBgGrid.style.transform = `translateY(${sy * 0.25}px)`;
        floatCards.forEach((c, i) => {
            c.style.transform = `translateY(${sy * (i === 0 ? 0.12 : -0.1)}px)`;
        });
    }

    /* ============================================================
       4. PLATFORM OVERVIEW — Staggered card reveal animation
       Cards fly in from below with a stagger delay
    ============================================================ */
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.96)';
        card.style.transition = 'none';
    });

    const platformObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const cards = entry.target.querySelectorAll('.module-card');
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.transition = `opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)`;
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, i * 90);
            });
            platformObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    const platformSection = document.getElementById('platform');
    if (platformSection) platformObserver.observe(platformSection);

    /* ============================================================
       5. PRODUCT DEMO — Sticky scroll storytelling
       The storefront preview pins while journey steps scroll over it
    ============================================================ */
    const shoppingSection = document.getElementById('shopping');
    const journeySteps = document.querySelectorAll('.journey-step');
    const storefrontPreview = document.querySelector('.storefront-preview');

    // Highlight journey steps as user scrolls through them
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('step-active');
                const idx = [...journeySteps].indexOf(entry.target);
                // Animate the storefront visually for current step
                if (storefrontPreview) {
                    storefrontPreview.style.transition = 'box-shadow 0.4s ease, transform 0.4s ease';
                    storefrontPreview.style.boxShadow = `0 24px 80px rgba(208,232,77,${0.08 + idx * 0.04})`;
                    storefrontPreview.style.transform = `scale(${1 + idx * 0.003})`;
                }
            } else {
                entry.target.classList.remove('step-active');
            }
        });
    }, { threshold: 0.6 });
    journeySteps.forEach(s => stepObserver.observe(s));

    // Sticky scroll — make the storefront sticky while journey scrolls
    if (shoppingSection && storefrontPreview && window.innerWidth > 768) {
        shoppingSection.style.position = 'relative';
        const journeyFlow = document.querySelector('.journey-flow');
        if (journeyFlow) {
            // Wrap in sticky layout
            const wrapper = document.createElement('div');
            wrapper.className = 'sticky-story-wrap';
            shoppingSection.querySelector('.container').appendChild(wrapper);

            const stickyPanel = document.createElement('div');
            stickyPanel.className = 'sticky-preview-panel';
            stickyPanel.appendChild(storefrontPreview.cloneNode(true));

            const scrollSteps = document.createElement('div');
            scrollSteps.className = 'scroll-steps';

            // Move journey steps into scroll area
            journeySteps.forEach(step => {
                const clone = step.cloneNode(true);
                clone.classList.remove('journey-step');
                clone.classList.add('scroll-step-item');
                scrollSteps.appendChild(clone);
            });

            wrapper.appendChild(stickyPanel);
            wrapper.appendChild(scrollSteps);

            // Hide originals
            journeyFlow.style.display = 'none';
            storefrontPreview.style.display = 'none';

            // Highlight active step on scroll
            const newSteps = wrapper.querySelectorAll('.scroll-step-item');
            const stickyObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('step-active');
                    else entry.target.classList.remove('step-active');
                });
            }, { threshold: 0.55, rootMargin: '-10% 0px -10% 0px' });
            newSteps.forEach(s => stickyObs.observe(s));
        }
    }

    /* ============================================================
       6. FEATURES — Enhanced hover animated cards
       Magnetic pull + glow border + icon bounce on hover
    ============================================================ */
    document.querySelectorAll('.bento-card, .module-card, .tech-card, .security-card').forEach(card => {
        const icon = card.querySelector('.bento-icon, .module-icon, .tech-icon-wrap, .sec-icon');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -5;
            const rotY = ((x - cx) / cx) * 5;
            const gx = Math.round((x / rect.width) * 100);
            const gy = Math.round((y / rect.height) * 100);

            card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale(1.01)`;
            card.style.setProperty('--glow-x', `${gx}%`);
            card.style.setProperty('--glow-y', `${gy}%`);
            card.classList.add('card-glow');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.classList.remove('card-glow');
        });

        card.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
                icon.style.transform = 'scale(1.25) rotate(-5deg)';
            }
        });
        card.addEventListener('mouseleave', () => {
            if (icon) icon.style.transform = '';
        });
    });

    /* ============================================================
       7. ROLE TABS — animated panel switching
    ============================================================ */
    document.querySelectorAll('.role-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const role = tab.dataset.role;
            document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.role-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.querySelector(`.role-panel[data-role="${role}"]`);
            if (panel) {
                panel.classList.add('active');
                panel.animate([
                    { opacity: 0, transform: 'translateY(16px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ], { duration: 400, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' });
            }
        });
    });

    /* ============================================================
       8. ANALYTICS — Enhanced number counter animation
    ============================================================ */
    function countUp(el, target, prefix, suffix, isDecimal, duration = 1800) {
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            if (isDecimal) {
                el.textContent = prefix + (eased * target).toFixed(1) + suffix;
            } else {
                el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
            }
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = prefix + (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
        };
        requestAnimationFrame(step);
    }

    // Hero stats
    new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            countUp(e.target.querySelector('#hero-stat-0') || e.target.querySelectorAll('.stat-num')[0], 2400, '', '+', false);
            countUp(e.target.querySelector('#hero-stat-1') || e.target.querySelectorAll('.stat-num')[1], 180, '$', 'M+', false);
            countUp(e.target.querySelector('#hero-stat-2') || e.target.querySelectorAll('.stat-num')[2], 99.9, '', '%', true);
            this.unobserve(e.target);
        });
    }, { threshold: 0.5 }).observe(document.querySelector('.hero-stats') || document.body);

    // Analytics section metrics
    const analyticsSection = document.getElementById('analytics');
    new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            countUp(document.querySelector('#am-1 .am-value'), 4.1, '$', 'M', true);
            countUp(document.querySelector('#am-2 .am-value'), 8900, '', '', false);
            countUp(document.querySelector('#am-3 .am-value'), 1240, '', '', false);
            countUp(document.querySelector('#am-4 .am-value'), 3.6, '', '%', true);
            this.unobserve(e.target);
        });
    }, { threshold: 0.3 }).observe(analyticsSection || document.body);

    /* ============================================================
       9. CTA — Subtle fade + rise animation with stagger
    ============================================================ */
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
        const ctaItems = ctaSection.querySelectorAll('.cta-badge, .cta-headline, .cta-sub, .cta-actions, .cta-trust');
        ctaItems.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(28px)';
        });

        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                ctaItems.forEach((el, i) => {
                    setTimeout(() => {
                        el.style.transition = `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms`;
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, i * 100);
                });

                // Animate the pulsing glow
                const glow = ctaSection.querySelector('.cta-glow');
                if (glow) {
                    glow.style.animation = 'ctaGlowPulse 3s ease-in-out infinite';
                }
                this.unobserve(entry.target);
            });
        }, { threshold: 0.25 }).observe(ctaSection);
    }

    /* ============================================================
       10. GENERIC SCROLL REVEAL — all other sections
    ============================================================ */
    const revealSelectors = [
        '.review-card', '.blog-card', '.journey-step',
        '.analytics-metric', '.chart-card',
        '.section-title', '.section-sub', '.section-label',
        '.role-tab', '.tech-badge', '.security-card',
        '.rsh-item', '.rs-score', '.rb-row'
    ];
    document.querySelectorAll(revealSelectors.join(',')).forEach((el, i) => {
        el.dataset.revealIdx = i;
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });

    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const siblings = entry.target.closest('.reviews-grid, .blog-grid, .tech-grid, .security-grid, .rs-bars, .rs-highlights, [class*="-grid"]');
            const delay = siblings
                ? [...siblings.children].indexOf(entry.target) * 80
                : 0;
            setTimeout(() => {
                entry.target.style.transition = `opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)`;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, delay);
            entry.target.dataset.observed = 'true';
            this.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
        .observe(...[document.querySelectorAll(revealSelectors.join(','))].flatMap(n => [...n]).map(el => {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting || entry.target.dataset.observed) return;
                    const parent = entry.target.parentElement;
                    const siblings = parent ? [...parent.children].filter(c => c.style.opacity === '0') : [];
                    const idx = siblings.indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.transition = `opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)`;
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, Math.max(0, idx) * 80);
                    entry.target.dataset.observed = 'true';
                    obs.unobserve(entry.target);
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
            obs.observe(el);
            return el;
        })[0] || document.body);

    /* ============================================================
       11. ANIMATED CHART BARS on scroll
    ============================================================ */
    new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.bar, .accent-bar').forEach((bar, i) => {
                const h = bar.style.height;
                bar.style.height = '0%';
                setTimeout(() => {
                    bar.style.transition = `height 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`;
                    bar.style.height = h;
                }, 200);
            });
            this.unobserve(e.target);
        });
    }, { threshold: 0.5 }).observe(document.querySelector('.chart-bars') || document.body);

    new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.bch-bar').forEach((bar, i) => {
                const w = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.transition = `width 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms`;
                    bar.style.width = w;
                }, 300);
            });
            this.unobserve(e.target);
        });
    }, { threshold: 0.4 }).observe(document.querySelector('.bar-chart-h') || document.body);

    /* ============================================================
       12. ACTIVE NAV LINK on scroll
    ============================================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
                const active = link.getAttribute('href') === `#${entry.target.id}`;
                link.style.color = active ? 'var(--black)' : '';
                link.style.background = active ? 'var(--gray-200)' : '';
            });
        });
    }, { threshold: 0.4 }).observe(...[...sections].map(s => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    const active = link.getAttribute('href') === `#${entry.target.id}`;
                    link.style.color = active ? 'var(--black)' : '';
                    link.style.background = active ? 'var(--gray-200)' : '';
                });
            });
        }, { threshold: 0.4 });
        obs.observe(s);
        return s;
    })[0] || document.body);

    /* ============================================================
       13. DB NAV items interaction
    ============================================================ */
    document.querySelectorAll('.db-nav-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.querySelectorAll('.db-nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    console.log('%cZenith Platform', 'font-size:24px;font-weight:900;color:#D0E84D;background:#0a0a0a;padding:8px 16px;border-radius:6px;');
    console.log('%cThe Operating System for Modern Boutique Retail', 'color:#888;font-size:12px;');
});
