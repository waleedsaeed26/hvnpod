document.addEventListener("DOMContentLoaded", () => {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Apple-style Fade-in animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Form submission mock
    const form = document.getElementById('waitlistForm');
    const successMsg = document.getElementById('successMsg');
    
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('emailInput').value;
            
            if(email) {
                // Mock API call
                form.style.display = 'none';
                successMsg.style.display = 'block';
                
                // Add a small animation to success message
                successMsg.style.opacity = '0';
                successMsg.style.transform = 'translateY(10px)';
                successMsg.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    successMsg.style.opacity = '1';
                    successMsg.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // Offset for navbar
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });
});
