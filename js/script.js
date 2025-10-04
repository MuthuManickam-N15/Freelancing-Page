/* ================================
   ARJUN DIGITAL SERVICES
   Optimized JavaScript
   ================================ */

'use strict';

// ========== HELPER FUNCTIONS ==========
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ========== DOM ELEMENTS ==========
const DOM = {
    preloader: $('#preloader'),
    navbar: $('#navbar'),
    navMenu: $('#navMenu'),
    hamburger: $('#hamburger'),
    themeToggle: $('#themeToggle'),
    backToTop: $('#backToTop'),
    navLinks: $$('.nav-link'),
    typedText: $('#typedText'),
    testimonialsContainer: $('#testimonialsContainer'),
    sliderDots: $('#sliderDots'),
    prevSlide: $('#prevSlide'),
    nextSlide: $('#nextSlide'),
    contactForm: $('#contactForm'),
    formSuccess: $('#formSuccess'),
    sendAnother: $('#sendAnother'),
};

// ========== PRELOADER ==========
window.addEventListener('load', () => {
    setTimeout(() => {
        DOM.preloader?.classList.add('hidden');
        setTimeout(() => DOM.preloader?.remove(), 300);
    }, 500);
});

// ========== NAVBAR ==========
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Scrolled class
    if (currentScroll > 50) {
        DOM.navbar?.classList.add('scrolled');
    } else {
        DOM.navbar?.classList.remove('scrolled');
    }
    
    // Active section
    updateActiveSection();
    
    // Back to top
    if (currentScroll > 500) {
        DOM.backToTop?.classList.add('show');
    } else {
        DOM.backToTop?.classList.remove('show');
    }
    
    lastScroll = currentScroll;
}, { passive: true });

// Mobile menu
DOM.hamburger?.addEventListener('click', () => {
    DOM.hamburger.classList.toggle('active');
    DOM.navMenu?.classList.toggle('active');
    document.body.style.overflow = DOM.navMenu?.classList.contains('active') ? 'hidden' : '';
});

// Close menu on link click
DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
        DOM.hamburger?.classList.remove('active');
        DOM.navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Active section
function updateActiveSection() {
    const sections = $$('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = $(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            DOM.navLinks.forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
        }
    });
}

// Smooth scroll
$$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        e.preventDefault();
        const target = $(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========== THEME TOGGLE ==========
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

DOM.themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = DOM.themeToggle?.querySelector('i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ========== TYPING EFFECT ==========
if (DOM.typedText) {
    const words = ['Websites', 'Web Apps', 'Landing Pages', 'UI/UX'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            DOM.typedText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            DOM.typedText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// ========== TESTIMONIALS SLIDER ==========
let currentSlide = 0;
const testimonials = $$('.testimonial-card');
const totalSlides = testimonials.length;

if (totalSlides > 0 && DOM.sliderDots) {
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        DOM.sliderDots.appendChild(dot);
    }
    
    const dots = $$('.slider-dot');
    
    function updateSlider() {
        const scrollAmount = DOM.testimonialsContainer.clientWidth * currentSlide;
        DOM.testimonialsContainer.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }
    
    DOM.prevSlide?.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
    
    DOM.nextSlide?.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });
    
    // Touch/Swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    DOM.testimonialsContainer?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    DOM.testimonialsContainer?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }
        if (touchEndX - touchStartX > 50) {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }
    }
}

// ========== CONTACT FORM WITH WEB3FORMS ==========
DOM.contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btnText = $('.btn-text');
    const btnLoading = $('.btn-loading');
    const submitBtn = DOM.contactForm.querySelector('button[type="submit"]');
    
    // Show loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    
    // Prepare form data
    const formData = new FormData(DOM.contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    
    try {
        // Send to Web3Forms API
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Form submitted successfully!', result);
            
            // Show success message
            DOM.contactForm.style.display = 'none';
            DOM.formSuccess.style.display = 'flex';
            
            // Reset form
            DOM.contactForm.reset();
            
            // Scroll to success message
            DOM.formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
        } else {
            throw new Error(result.message || 'Form submission failed');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        
        // Show error alert
        alert('Oops! Something went wrong. Please try again or email me directly at hello@arjundigital.com');
        
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// Send another message
DOM.sendAnother?.addEventListener('click', () => {
    DOM.formSuccess.style.display = 'none';
    DOM.contactForm.style.display = 'block';
    DOM.contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ========== BACK TO TOP ==========
DOM.backToTop?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========== PERFORMANCE ==========
// Lazy load images
const images = $$('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========== INITIALIZATION ==========
console.log('🚀 Arjun Digital Services - Loaded Successfully!');
console.log('📧 Contact form ready with Web3Forms');
console.log('💡 Remember to replace YOUR_ACCESS_KEY_HERE in index.html');