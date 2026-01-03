document.addEventListener('DOMContentLoaded', () => {

    // Sticky Header Handling
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation (Refined)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => observer.observe(el));

    // Scroll-linked Background Gradient
    document.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrolled / maxScroll) * 100;

        // Move background position from 0% to 100% vertically
        document.body.style.backgroundPosition = `0% ${scrollPercent}%`;
    });

    // Waitlist Scroll Handling
    const waitlistButtons = document.querySelectorAll('.js-scroll-to-waitlist');
    const waitlistForm = document.getElementById('join-waitlist-form');

    waitlistButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (waitlistForm) {
                // If in mobile menu, close it first
                if (mobileNav) mobileNav.classList.remove('active');

                waitlistForm.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                // Optional: Focus the name input after scrolling
                const nameInput = waitlistForm.querySelector('input[type="text"]');
                if (nameInput) {
                    setTimeout(() => nameInput.focus(), 500); // Wait for scroll
                }
            }
        });
    });

    // Mobile Menu Logic
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener('click', () => {
            mobileNav.classList.add('active');
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });

        // Close on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });

        // Close on click outside
        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                mobileNav.classList.remove('active');
            }
        });
    }

    // Carousel Dots Logic (How it works)
    const stepsGrid = document.querySelector('.steps-grid');
    const dots = document.querySelectorAll('.dot');

    if (stepsGrid && dots.length) {
        stepsGrid.addEventListener('scroll', () => {
            const scrollLeft = stepsGrid.scrollLeft;
            const width = stepsGrid.offsetWidth;
            const index = Math.round(scrollLeft / width); // Simple approximation

            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
    }

    // Waitlist Form Submission
    if (waitlistForm) {
        const formElement = waitlistForm.querySelector('form');
        if (formElement) {
            formElement.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = formElement.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;

                // Loading state
                submitBtn.textContent = 'Joining...';
                submitBtn.disabled = true;

                const formData = new FormData(formElement);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email')
                };

                try {
                    const response = await fetch('https://sourabhnihore98.app.n8n.cloud/webhook/8898eb4a-e879-4f13-b450-c061c8029289', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        // Success state
                        submitBtn.textContent = 'Joined!';
                        submitBtn.style.backgroundColor = 'var(--color-secondary)';
                        formElement.reset();

                        setTimeout(() => {
                            submitBtn.textContent = originalBtnText;
                            submitBtn.style.backgroundColor = '';
                            submitBtn.disabled = false;
                        }, 3000);
                    } else {
                        throw new Error('Network response was not ok');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    submitBtn.textContent = 'Error. Try again.';
                    submitBtn.style.backgroundColor = '#ef4444'; // Red for error

                    setTimeout(() => {
                        submitBtn.textContent = originalBtnText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                    }, 3000);
                }
            });
        }
    }

});
