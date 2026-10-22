// Enforce reload to home/top of page
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
if (window.location.hash) {
    window.history.replaceState('', document.title, window.location.pathname + window.location.search);
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    // ---- Loading Screen Logic ----
    const loaderWrapper = document.getElementById('loader-wrapper');
    const loadingProgress = document.querySelector('.loading-progress');
    const systemStatus = document.querySelector('.system-status');
    const decryptElement = document.querySelector('.decrypt-text');
    
    // The target name to display
    const finalName = decryptElement.getAttribute('data-name');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>';
    let iterations = 0;
    
    // Animate the progress bar width
    loadingProgress.style.transition = 'width 2.5s ease-in-out';
    
    // Start slightly after load
    setTimeout(() => {
        loadingProgress.style.width = '100%';
        
        // Decrypt text effect
        const interval = setInterval(() => {
            decryptElement.innerText = finalName
                .split('')
                .map((letter, index) => {
                    if (index < iterations) {
                        return finalName[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if (iterations >= finalName.length) {
                clearInterval(interval);
            }
            
            iterations += 1 / 3; // Controls speed of decryption
        }, 30);
    }, 200);

    // After animation delay, hide loader
    setTimeout(() => {
        systemStatus.innerText = 'Access Granted';
        systemStatus.style.color = '#00ff88';
        systemStatus.classList.add('glitch-status');
        
        setTimeout(() => {
            loaderWrapper.style.opacity = '0';
            loaderWrapper.style.visibility = 'hidden';
        }, 800);
    }, 2800);
});

// Neural Network / Neurons Background Effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let animationFrameId;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const isLightMode = () => document.documentElement.getAttribute('data-theme') === 'light';

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1.5; // Neuron size
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isLightMode() ? 'rgba(0, 153, 85, 0.8)' : 'rgba(0, 255, 136, 0.8)';
        ctx.fill();
    }
}

function initNeurons() {
    particlesArray = [];
    const numberOfParticles = (canvas.width * canvas.height) / 8000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateNeurons() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rgb = isLightMode() ? '0, 153, 85' : '0, 255, 136';

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 130) {
                const opacity = 1 - (distance / 130);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${rgb}, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    animationFrameId = requestAnimationFrame(animateNeurons);
}

initNeurons();
animateNeurons();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initNeurons();
});

// ---- Theme Shifter Logic ----
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Check saved theme
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.innerText = '☾';
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeIcon.innerText = '☀';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.innerText = '☾';
    }
});

// Mobile Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        
        // Convert to absolute X when open
        const bars = hamburger.querySelectorAll('.bar');
        if (navLinksContainer.classList.contains('active')) {
            bars[0].style.transform = 'translateY(8px) rotate(45deg)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    navLinksContainer.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            hamburger.querySelectorAll('.bar').forEach(b => {
                b.style.transform = 'none';
                b.style.opacity = '1';
            });
        });
    });
}

const navPill = document.querySelector('.nav-pill');
function updateNavPill(targetLink) {
    if (targetLink && navPill) {
        const linkRect = targetLink.getBoundingClientRect();
        const navRect = document.querySelector('.nav-links').getBoundingClientRect();
        navPill.style.width = `${linkRect.width}px`;
        navPill.style.height = `${linkRect.height}px`;
        navPill.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
        navPill.style.opacity = 1;
    } else if (navPill) {
        // disappear when not hovering
        navPill.style.opacity = 0;
    }
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', () => updateNavPill(link));
});

const navLinksContainerUI = document.querySelector('.nav-links');
if (navLinksContainerUI) {
    navLinksContainerUI.addEventListener('mouseleave', () => updateNavPill(null));
}

// Smooth scroll for nav links (fallback for browsers not supporting scroll-behavior)
const navAnchors = document.querySelectorAll('a[href^="#"]');
navAnchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        
        // Remove active class from all and add to clicked
        document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
        if (this.closest('.nav-links')) {
            this.classList.add('active');
        }
    });
});

// ScrollSpy logic to highlight active link
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    let hashChanged = false;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === `#${current}`) {
            if (!link.classList.contains('active')) {
                link.classList.add('active');
                hashChanged = true;
            }
        } else {
            if (link.classList.contains('active')) {
                link.classList.remove('active');
                hashChanged = true;
            }
        }
    });
});

// Detached Navbar Glass Effect on Scroll
const navbar = document.querySelector('.navbar');
if(navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}
