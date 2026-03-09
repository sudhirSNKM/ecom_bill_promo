/* Shared nav + footer injector for all inner pages */
(function () {
  const NAV_HTML = `
   <nav class="s-nav" id="sNav">
    <div class="s-nav-inner">
      <a href="index.html" class="s-logo">
        <div class="s-logo-icon">Z</div>
        <span>Zenith</span>
      </a>
      <div class="s-nav-links" id="sNavLinks">
        <a href="index.html#platform">Platform</a>
        <a href="index.html#roles">Roles</a>
        <a href="index.html#features">Features</a>
        <a href="index.html#analytics">Analytics</a>
        <a href="index.html#reviews">Reviews</a>
        <a href="blog.html">Blog</a>
        <div class="s-nav-cta-mobile">
          <a href="#" class="btn-sm btn-ghost-sm">Sign In</a>
          <a href="index.html#cta" class="btn-sm btn-primary-sm">Start Free Trial</a>
        </div>
      </div>
      <div class="s-nav-cta">
        <a href="#" class="btn-sm btn-ghost-sm">Sign In</a>
        <a href="index.html#cta" class="btn-sm btn-primary-sm">Start Free Trial</a>
      </div>
      <div class="s-hamburger" id="sHamburger">
        <span></span><span></span><span></span>
      </div>
    </div>
  </nav>`;

  const FOOTER_HTML = `
  <footer class="s-footer">
    <div class="s-footer-inner">
      <div class="s-footer-top">
        <div class="s-footer-brand">
          <div class="s-footer-logo">
            <div class="s-footer-logo-icon">Z</div>
            <span>Zenith</span>
          </div>
          <p>The operating system for modern boutique retail. Built for brands that demand excellence.</p>
        </div>
        <div class="s-footer-links">
          <div class="s-footer-col">
            <div class="s-fc-title">Platform</div>
            <a href="pos.html">POS System</a>
            <a href="inventory.html">Inventory</a>
            <a href="ecommerce.html">E-commerce</a>
            <a href="analytics-platform.html">Analytics</a>
            <a href="branches.html">Multi-Branch</a>
          </div>
          <div class="s-footer-col">
            <div class="s-fc-title">Company</div>
            <a href="about.html">About</a>
            <a href="blog.html">Blog</a>
            <a href="careers.html">Careers</a>
            <a href="press.html">Press</a>
          </div>
          <div class="s-footer-col">
            <div class="s-fc-title">Support</div>
            <a href="docs.html">Documentation</a>
            <a href="api.html">API Reference</a>
            <a href="status.html">Status</a>
            <a href="contact.html">Contact</a>
            <a href="mailto:production@fortumars.com" class="s-footer-email">production@fortumars.com</a>
          </div>
          <div class="s-footer-col">
            <div class="s-fc-title">Legal</div>
            <a href="privacy.html">Privacy Policy</a>
            <a href="terms.html">Terms of Service</a>
            <a href="security-policy.html">Security</a>
            <a href="gdpr.html">GDPR</a>
          </div>
        </div>
      </div>
      <div class="s-footer-bottom">
        <span>© 2026 Zenith. All rights reserved.</span>
        <span>Built with ❤️ for boutique retail.</span>
      </div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

  // Scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('sNav')?.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Highlight active page
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.s-nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Mobile menu toggle
  const hamburger = document.getElementById('sHamburger');
  const navLinks = document.getElementById('sNavLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('mobile-active');
      document.body.style.overflow = navLinks.classList.contains('mobile-active') ? 'hidden' : '';
    });

    // Close menu when clicking links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('mobile-active');
        document.body.style.overflow = '';
      });
    });
  }
})();
