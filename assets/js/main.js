// Configuration
const CONFIG = {
    // Spring backend endpoint - update this to your actual Spring application URL
    API_BASE_URL: 'http://localhost:8080/api',
    CONTACT_ENDPOINT: '/contact',
    // Enable/disable CORS mode
    CORS_MODE: 'cors',
    // Request timeout in milliseconds
    REQUEST_TIMEOUT: 10000
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
});

// Initialize all components
function initializeComponents() {
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initScrollToTop();
    initNavbarScroll();
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on menu items
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 70; // Account for fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const formMessage = document.getElementById('formMessage');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Disable submit button and show loading state
            setSubmitButtonState(true);
            hideMessage();
            
            try {
                // Collect form data
                const formData = collectFormData(form);
                
                // Validate form data
                if (!validateFormData(formData)) {
                    showMessage('Please fill in all required fields correctly.', 'error');
                    return;
                }
                
                // Send data to Spring backend
                const response = await sendContactForm(formData);
                
                if (response.success) {
                    showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                    form.reset();
                } else {
                    showMessage(response.message || 'There was an error sending your message. Please try again.', 'error');
                }
                
            } catch (error) {
                console.error('Contact form error:', error);
                showMessage('There was an error sending your message. Please try again or contact us directly.', 'error');
            } finally {
                setSubmitButtonState(false);
            }
        });
    }
    
    // Set submit button state (loading/normal)
    function setSubmitButtonState(loading) {
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            submitText.textContent = 'Sending...';
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            submitText.textContent = 'Send Message';
        }
    }
    
    // Collect form data
    function collectFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        
        return data;
    }
    
    // Validate form data
    function validateFormData(data) {
        // Required fields
        const required = ['firstName', 'lastName', 'email', 'message', 'privacy'];
        
        for (let field of required) {
            if (!data[field] || data[field] === '') {
                return false;
            }
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }
        
        // Privacy checkbox
        if (data.privacy !== 'on') {
            return false;
        }
        
        return true;
    }
    
    // Send contact form data to Spring backend
    async function sendContactForm(data) {
        try {
            // Prepare the request payload
            const payload = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                company: data.company || '',
                phone: data.phone || '',
                service: data.service || '',
                message: data.message,
                timestamp: new Date().toISOString(),
                source: 'website_contact_form'
            };
            
            // Create request options
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
                mode: CONFIG.CORS_MODE
            };
            
            // Create timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timeout')), CONFIG.REQUEST_TIMEOUT);
            });
            
            // Make the request with timeout
            const fetchPromise = fetch(`${CONFIG.API_BASE_URL}${CONFIG.CONTACT_ENDPOINT}`, requestOptions);
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            
            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Parse response
            const result = await response.json();
            
            return {
                success: true,
                message: result.message || 'Message sent successfully',
                data: result
            };
            
        } catch (error) {
            console.error('Error sending contact form:', error);
            
            // Handle different types of errors
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                // Network error or CORS issue
                return {
                    success: false,
                    message: 'Unable to connect to the server. Please check your internet connection or try again later.'
                };
            } else if (error.message === 'Request timeout') {
                return {
                    success: false,
                    message: 'Request timed out. Please try again.'
                };
            } else {
                return {
                    success: false,
                    message: 'An unexpected error occurred. Please try again or contact us directly.'
                };
            }
        }
    }
    
    // Show success/error message
    function showMessage(message, type) {
        const messageClasses = {
            success: 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded',
            error: 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'
        };
        
        formMessage.className = messageClasses[type];
        formMessage.textContent = message;
        formMessage.classList.remove('hidden');
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideMessage();
            }, 5000);
        }
    }
    
    // Hide message
    function hideMessage() {
        formMessage.classList.add('hidden');
    }
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 opacity-0 invisible z-50';
    scrollToTopBtn.id = 'scrollToTop';
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.remove('opacity-0', 'invisible');
        } else {
            scrollToTopBtn.classList.add('opacity-0', 'invisible');
        }
    });
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            header.classList.add('shadow-md');
        } else {
            header.classList.remove('shadow-md');
        }
    });
}

// Utility functions for Spring Integration

// Function to test backend connectivity
async function testBackendConnection() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            mode: CONFIG.CORS_MODE
        });
        
        return response.ok;
    } catch (error) {
        console.error('Backend connection test failed:', error);
        return false;
    }
}

// Function to get CSRF token if needed
async function getCsrfToken() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/csrf`, {
            method: 'GET',
            credentials: 'include',
            mode: CONFIG.CORS_MODE
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.token;
        }
    } catch (error) {
        console.error('Failed to get CSRF token:', error);
    }
    return null;
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        testBackendConnection,
        getCsrfToken
    };
}