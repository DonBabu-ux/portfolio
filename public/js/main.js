document.addEventListener('DOMContentLoaded', () => {
  // ─── NAVBAR SCROLL EFFECT ────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 10, 0.9)';
      navbar.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      navbar.style.padding = '0.5rem 0';
    } else {
      navbar.style.background = 'rgba(26, 26, 26, 0.6)';
      navbar.style.padding = '0';
      navbar.style.borderBottom = '1px solid transparent';
    }
  });

  // ─── MOBILE MENU TOGGLE ──────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = mobileMenu.classList.contains('active');
      
      if (isOpen) {
        // Close
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      } else {
        // Open
        mobileMenu.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close mobile menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── CONTACT FORM SUBMISSION ─────────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Simple validation
      if (!data.name || !data.email || !data.message) {
        formFeedback.textContent = 'Please fill out all fields.';
        formFeedback.className = 'form-feedback error';
        return;
      }

      formFeedback.textContent = '';
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      try {
        const response = await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          formFeedback.textContent = 'Message sent successfully! I will get back to you soon.';
          formFeedback.className = 'form-feedback success';
          contactForm.reset();
        } else {
          throw new Error(result.error || 'Failed to send message.');
        }
      } catch (err) {
        formFeedback.textContent = err.message;
        formFeedback.className = 'form-feedback error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
      }
    });
  }

  // ─── ANIMATE STATS NUMBERS ───────────────────────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const val = target.getAttribute('data-target');
          if (!target.classList.contains('animated')) {
            target.classList.add('animated');
            // Simplified animation for demo purposes
            target.textContent = val; 
            target.style.color = 'var(--accent-primary)';
          }
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  // Initialize highlight.js
  if (typeof hljs !== 'undefined') {
    hljs.highlightAll();
  }

  // ─── TYPEWRITER EFFECT ───────────────────────────────────────────────────
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const roles = [
      'Full-Stack Developer',
      'Cyber Security Engineer',
      'Graphics Designer',
      'Systems Architect'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // Use initial developer.role from EJS if needed, but we override here
    function type() {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }
    
    // Start typing
    setTimeout(type, 1000);
  }

  // ─── SCROLL TRIGGERED TYPEWRITER BLOCKS ──────────────────────────────────
  const triggerBlocks = document.querySelectorAll('.typewriter-trigger');
  const colors = ['text-color-1', 'text-color-2', 'text-color-3', 'text-color-4', 'text-color-5'];
  
  if (triggerBlocks.length > 0) {
    const typeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = entry.target;
          if (container.classList.contains('typing-started')) return;
          
          container.classList.add('typing-started');
          const textElement = container.querySelector('.typing-text');
          if (!textElement) return;

          const fullText = textElement.textContent.trim();
          const speed = parseInt(container.getAttribute('data-speed')) || 50;
          // Start with a random color for immediate variety
          let colorIndex = Math.floor(Math.random() * colors.length);
          
          function startCycle() {
            // Remove previous color classes
            colors.forEach(c => container.classList.remove(c));
            // Apply new color for this cycle
            container.classList.add(colors[colorIndex]);
            container.classList.add('typing-cursor');
            colorIndex = (colorIndex + 1) % colors.length;
            
            let i = 0;
            textElement.textContent = '';
            
            function typeNext() {
              if (i < fullText.length) {
                textElement.textContent += fullText.charAt(i);
                i++;
                setTimeout(typeNext, speed);
              } else {
                // Wait at the end, keep cursor blinking
                setTimeout(deleteNext, 4000);
              }
            }

            function deleteNext() {
              if (i > 0) {
                textElement.textContent = fullText.substring(0, i - 1);
                i--;
                setTimeout(deleteNext, speed / 3);
              } else {
                // Wait at the start then repeat
                setTimeout(startCycle, 800);
              }
            }

            typeNext();
          }

          startCycle();
        }
      });
    }, { threshold: 0.2 });

    triggerBlocks.forEach(block => typeObserver.observe(block));
  }
});
