/**
 * Laffah (لَفَّة) Landing Page Interactive Scripts
 * Cinematic Particle Canvas, Smooth RTL Carousel, FAQ Accordion,
 * Native Fast APK Download Toast, and Social Web Share
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  // 1. Cinematic Particle & Glowing Canvas Animation
  // ==========================================================
  const canvas = document.getElementById('cinematicCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;
    let particles = [];

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    function initParticles() {
      // Responsive particle count (fewer on mobile for 60fps performance)
      const count = width < 768 ? 20 : 45;
      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 1,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.45 + 0.15,
          color: Math.random() > 0.4 ? '255, 152, 0' : '255, 183, 77' // Laffah warm amber & saffron
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();

        // Delicate micro connection line if particles are close
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 152, 0, ${0.1 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion && !document.hidden) {
        animationFrameId = requestAnimationFrame(drawParticles);
      }
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();
    if (!prefersReducedMotion) {
      drawParticles();
    }

    // Pause canvas when tab is hidden to save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        drawParticles();
      }
    });
  }

  // ==========================================================
  // 2. Screenshots Carousel Controls (Smooth RTL Support)
  // ==========================================================
  const slider = document.getElementById('screensSlider');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (slider) {
    const cardStep = 284; // card width (260px) + gap (24px)

    // In RTL containers, scrolling left moves backward and right moves forward depending on browser
    // Using signed delta based on current scroll
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -cardStep, behavior: 'smooth' });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: cardStep, behavior: 'smooth' });
      });
    }

    // Update dots on scroll
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
    slider.addEventListener('scroll', () => {
      const scrollPos = Math.abs(slider.scrollLeft);
      const activeIndex = Math.min(
        dots.length - 1,
        Math.round(scrollPos / cardStep)
      );

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });
    }, { passive: true });

    // Dot click
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        slider.scrollTo({
          left: -index * cardStep,
          behavior: 'smooth'
        });
      });
    });
  }

  // ==========================================================
  // 3. FAQ Accordion Interaction
  // ==========================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items for clean accordion effect
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        item.classList.toggle('active', !isActive);
      });
    }
  });

  // ==========================================================
  // 4. Native Download Trigger & Reassuring Toast Notification
  // ==========================================================
  const downloadToast = document.getElementById('downloadToast');
  const toastClose = document.getElementById('toastClose');
  const downloadButtons = document.querySelectorAll('.download-trigger');

  function showDownloadToast() {
    if (!downloadToast) return;
    downloadToast.classList.add('show');

    setTimeout(() => {
      downloadToast.classList.remove('show');
    }, 8000);
  }

  downloadButtons.forEach(btn => {
    // Native browser download is preserved (NO preventDefault)
    // We only attach feedback toast to reassure the user
    btn.addEventListener('click', () => {
      showDownloadToast();
    });
  });

  if (toastClose && downloadToast) {
    toastClose.addEventListener('click', () => {
      downloadToast.classList.remove('show');
    });
  }

  // ==========================================================
  // 5. Native Social Share / WhatsApp Fallback
  // ==========================================================
  const shareButtons = [
    document.getElementById('shareBtnTop'),
    document.getElementById('heroShareBtn'),
    document.getElementById('feedbackShareBtn')
  ];

  const shareTitle = 'تطبيق لَفَّة (Laffah) — أسرع مشوار وتوصيل فوري في صنعاء';
  const shareText = 'جرب تطبيق لَفَّة الجديد! أسرع مشاوير بالدراجات النارية وتوصيل الطرود في شوارع صنعاء بأجرة عادلة 🇾🇪 حمّل التطبيق الآن:';

  function handleShare() {
    const currentUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: currentUrl
      }).catch(() => {
        // Fallback silently if user cancelled share sheet
      });
    } else {
      // Fallback directly to WhatsApp Web / Mobile
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  }

  shareButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', handleShare);
    }
  });

  // ==========================================================
  // 6. Mobile Sticky Bottom Bar (Visible past Hero on Mobile)
  // ==========================================================
  const stickyBar = document.getElementById('stickyBar');
  const heroSection = document.querySelector('.hero-section');

  if (stickyBar && heroSection) {
    window.addEventListener('scroll', () => {
      // Only process when on mobile screen
      if (window.innerWidth <= 768) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom < 60) {
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
        }
      } else {
        stickyBar.classList.remove('visible');
      }
    }, { passive: true });
  }

});
