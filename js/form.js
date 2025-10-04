/* ===================================
   CONTACT FORM HANDLER
   Validation, Submission, Success States
   =================================== */

'use strict';

// ============ DOM ELEMENTS ============
const formElements = {
    form: document.getElementById('contactForm'),
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    service: document.getElementById('service'),
    budget: document.getElementById('budget'),
    message: document.getElementById('message'),
    submitBtn: document.querySelector('.btn-submit'),
    formSuccess: document.getElementById('formSuccess'),
    sendAnother: document.getElementById('sendAnother'),
};

// ============ VALIDATION PATTERNS ============
const patterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// ============ ERROR MESSAGES ============
const errorMessages = {
    name: 'Please enter a valid name (2-50 characters)',
    email: 'Please enter a valid email address',
    service: 'Please select a service',
    budget: 'Please select a budget range',
    message: 'Please enter your message (minimum 10 characters)',
};

// ============ VALIDATION FUNCTIONS ============
const validateField = (field, pattern, minLength = 0) => {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}Error`);
    
    if (!value) {
        showError(field, errorElement, 'This field is required');
        return false;
    }
    
    if (minLength && value.length < minLength) {
        showError(field, errorElement, errorMessages[field.id]);
        return false;
    }
    
    if (pattern && !pattern.test(value)) {
        showError(field, errorElement, errorMessages[field.id]);
        return false;
    }
    
    hideError(field, errorElement);
    return true;
};

const showError = (field, errorElement, message) => {
    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
};

const hideError = (field, errorElement) => {
    field.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
};

// ============ REAL-TIME VALIDATION ============
const initRealTimeValidation = () => {
    // Name validation
    formElements.name?.addEventListener('blur', () => {
        validateField(formElements.name, patterns.name);
    });
    
    // Email validation
    formElements.email?.addEventListener('blur', () => {
        validateField(formElements.email, patterns.email);
    });
    
    // Message validation
    formElements.message?.addEventListener('blur', () => {
        validateField(formElements.message, null, 10);
    });
    
    // Remove error on input
    Object.values(formElements).forEach(field => {
        if (field?.tagName === 'INPUT' || field?.tagName === 'TEXTAREA' || field?.tagName === 'SELECT') {
            field.addEventListener('input', () => {
                const errorElement = document.getElementById(`${field.id}Error`);
                if (field.classList.contains('error')) {
                    hideError(field, errorElement);
                }
            });
        }
    });
};

// ============ FORM SUBMISSION ============
const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateField(formElements.name, patterns.name);
    const isEmailValid = validateField(formElements.email, patterns.email);
    const isServiceValid = formElements.service.value !== '';
    const isBudgetValid = formElements.budget.value !== '';
    const isMessageValid = validateField(formElements.message, null, 10);
    
    if (!isServiceValid) {
        showError(formElements.service, null, 'Please select a service');
    }
    
    if (!isBudgetValid) {
        showError(formElements.budget, null, 'Please select a budget');
    }
    
    // If all valid, submit
    if (isNameValid && isEmailValid && isServiceValid && isBudgetValid && isMessageValid) {
        await submitForm();
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
};

// ============ SUBMIT FORM ============
const submitForm = async () => {
    const btnText = formElements.submitBtn.querySelector('.btn-text');
    const btnLoading = formElements.submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    formElements.submitBtn.disabled = true;
    
    // Collect form data
    const formData = {
        name: formElements.name.value.trim(),
        email: formElements.email.value.trim(),
        service: formElements.service.value,
        budget: formElements.budget.value,
        message: formElements.message.value.trim(),
        timestamp: new Date().toISOString(),
    };
    
    try {
        // Simulate API call (replace with your actual endpoint)
        await simulateAPICall(formData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        formElements.form.reset();
        
        // Send analytics event
        trackFormSubmission(formData);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('Something went wrong. Please try again.');
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        formElements.submitBtn.disabled = false;
    }
};

// ============ SIMULATE API CALL ============
const simulateAPICall = (data) => {
    return new Promise((resolve) => {
        // Replace this with your actual API endpoint
        console.log('Form Data:', data);
        
        // Simulate network delay
        setTimeout(() => {
            resolve({ success: true });
        }, 2000);
        
        /* 
        // Example with fetch:
        fetch('https://your-api-endpoint.com/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => resolve(result))
        .catch(error => reject(error));
        */
    });
};

// ============ SUCCESS MESSAGE ============
const showSuccessMessage = () => {
    formElements.form.style.display = 'none';
    formElements.formSuccess.style.display = 'block';
    formElements.formSuccess.style.animation = 'zoomIn 0.5s ease';
    
    // Scroll to success message
    formElements.formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Confetti effect (optional)
    createConfetti();
};

// ============ ERROR MESSAGE ============
const showErrorMessage = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: #fee;
        color: #c33;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: center;
        animation: shake 0.5s ease;
    `;
    
    formElements.form.insertBefore(errorDiv, formElements.form.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
};

// ============ SEND ANOTHER MESSAGE ============
formElements.sendAnother?.addEventListener('click', () => {
    formElements.formSuccess.style.display = 'none';
    formElements.form.style.display = 'block';
    formElements.form.reset();
});

// ============ CONFETTI EFFECT ============
const createConfetti = () => {
    const colors = ['#134686', '#ED3F27', '#FEB21A'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random()};
            transform: rotate(${Math.random() * 360}deg);
            animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
            z-index: 10000;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
};

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============ ANALYTICS TRACKING ============
const trackFormSubmission = (data) => {
    // Google Analytics example
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
            event_category: 'Contact',
            event_label: data.service,
            value: data.budget,
        });
    }
    
    // Facebook Pixel example
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: data.service,
            content_category: 'Contact Form',
        });
    }
    
    console.log('Form submission tracked:', data);
};

// ============ AUTO-SAVE DRAFT ============
const autoSaveDraft = () => {
    const saveKey = 'contact_form_draft';
    
    // Save on input
    ['name', 'email', 'service', 'budget', 'message'].forEach(field => {
        formElements[field]?.addEventListener('input', () => {
            const draft = {
                name: formElements.name.value,
                email: formElements.email.value,
                service: formElements.service.value,
                budget: formElements.budget.value,
                message: formElements.message.value,
            };
            localStorage.setItem(saveKey, JSON.stringify(draft));
        });
    });
    
    // Restore on load
    const savedDraft = localStorage.getItem(saveKey);
    if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        Object.keys(draft).forEach(key => {
            if (formElements[key]) {
                formElements[key].value = draft[key];
            }
        });
    }
    
    // Clear draft on successful submission
    formElements.form?.addEventListener('submit', () => {
        localStorage.removeItem(saveKey);
    });
};

// ============ CONTACT INFO CARDS ============
const initContactInfoCards = () => {
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach(card => {
        card.addEventListener('click', function() {
            const link = this.querySelector('a');
            if (link) {
                link.click();
            }
        });
    });
};

// ============ FORM ANIMATIONS ============
const initFormAnimations = () => {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 100);
    });
};

// ============ INITIALIZATION ============
const initContactForm = () => {
    if (!formElements.form) return;
    
    formElements.form.addEventListener('submit', handleFormSubmit);
    initRealTimeValidation();
    autoSaveDraft();
    initContactInfoCards();
    initFormAnimations();
    
    console.log('📧 Contact Form - Initialized Successfully!');
};

// ============ START ============
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}