// Smooth scroll logic, FAB visibility, and stats counter animation.
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Floating Action Button (Scroll to top) ---
    const fab = document.querySelector('.fab-scroll-top');
    if(fab) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                fab.style.opacity = '1';
                fab.style.pointerEvents = 'auto';
            } else {
                fab.style.opacity = '0';
                fab.style.pointerEvents = 'none';
            }
        });
        
        fab.style.opacity = '0';
        fab.style.pointerEvents = 'none';
        
        fab.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Stats Animated Counter ---
    const counters = document.querySelectorAll('.counter');
    const speed = 100; // lower is slower

    const startCounting = (counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 25);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    }

    const observerOptions = {
        root: null,
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting(entry.target);
                // Unobserve so it only happens once when scrolled into view
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Check saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Default to system preference if no saved preference
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- Scroll Reveal Animations ---
    const fadeElements = document.querySelectorAll('.content-card, .sidebar-profile');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Uncomment the line below to only animate once
                // fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    // --- Mobile Navbar Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Starfield Background ---
    const canvas = document.getElementById('star-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, stars;
        
        function initStars() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            stars = [];
            const numStars = Math.floor((width * height) / 4000); 
            for (let i = 0; i < numStars; i++) {
                stars.push(new Star());
            }
        }

        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speed = Math.random() * 0.4 + 0.1;
                this.alpha = Math.random();
                this.alphaChange = (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1);
            }
            update() {
                this.y -= this.speed;
                if (this.y < 0) {
                    this.y = height;
                    this.x = Math.random() * width;
                }
                this.alpha += this.alphaChange;
                if (this.alpha <= 0.1 || this.alpha >= 0.8) {
                    this.alphaChange = -this.alphaChange;
                }
            }
            draw(isDark) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = isDark 
                    ? `rgba(255, 255, 255, ${this.alpha})` 
                    : `rgba(99, 102, 241, ${this.alpha})`;
                ctx.fill();
            }
        }

        function animateStars() {
            ctx.clearRect(0, 0, width, height);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            stars.forEach(star => {
                star.update();
                star.draw(isDark);
            });
            requestAnimationFrame(animateStars);
        }

        initStars();
        animateStars();
        
        window.addEventListener('resize', initStars);
    }
});
