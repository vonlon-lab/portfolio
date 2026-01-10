const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
const numStars = 350;
const maxDistance = 150; // max distance for connections
let mouseX = 0, mouseY = 0;

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 1.2;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        const distToMouse = Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2);
        const maxDist = 200; // radius of influence
        const brightness = Math.max(0.2, 1 - distToMouse / maxDist); // min 0.2, max 1

        ctx.shadowColor = 'white';
        ctx.shadowBlur = 5;
        ctx.globalAlpha = brightness;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1; // reset
        ctx.shadowBlur = 0;
    }
}

for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
}

function getTextElements() {
    return document.querySelectorAll('.section h1, .section p, .section h2, .hero-title');
}

function getHeroElements() {
    return document.querySelectorAll('.avatar');
}

function drawConnections() {
    const textElements = getTextElements();
    textElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const numPoints = Math.min(el.textContent.length, 10); // up to 10 points per element
        for (let i = 0; i < numPoints; i++) {
            const pointX = rect.left + (rect.width / numPoints) * (i + 0.5);
            const pointY = rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height * 0.5;

            stars.forEach(star => {
                const dist = Math.sqrt((star.x - pointX) ** 2 + (star.y - pointY) ** 2);
                if (dist < maxDistance) {
                    ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / maxDistance) * 0.5})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(pointX, pointY);
                    ctx.stroke();
                }
            });
        }
    });

    // Connections to avatar
    const heroElements = getHeroElements();
    heroElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        stars.forEach(star => {
            const dist = Math.sqrt((star.x - centerX) ** 2 + (star.y - centerY) ** 2);
            if (dist < maxDistance) {
                ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / maxDistance) * 0.5})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(centerX, centerY);
                ctx.stroke();
            }
        });
    });

    // Connections between stars
    stars.forEach((star, i) => {
        stars.slice(i + 1).forEach(otherStar => {
            const dist = Math.sqrt((star.x - otherStar.x) ** 2 + (star.y - otherStar.y) ** 2);
            if (dist < 160) {
                ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 80) * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(otherStar.x, otherStar.y);
                ctx.stroke();
            }
        });
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    drawConnections();

    requestAnimationFrame(animate);
}

animate();

// Parallax and blur on scroll
let prevScrollY = 0;
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const deltaY = scrollY - prevScrollY;
    prevScrollY = scrollY;
    const blurAmount = Math.min(scrollY / 1000, 5); // max blur 5px

    canvas.style.filter = `blur(${blurAmount}px)`;

    // Parallax for stars
    stars.forEach(star => {
        star.y -= deltaY * 0.1; // consistent speed parallax
    });
});

// Mouse tracking
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Scramble text animation
gsap.registerPlugin(ScrambleTextPlugin);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.hasAttribute('data-animated') && !entry.target.classList.contains('discord') && !entry.target.classList.contains('email')) {
            entry.target.setAttribute('data-animated', 'true');
            gsap.fromTo(entry.target,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1,
                    scrambleText: {
                        text: entry.target.textContent,
                        chars: "lowerCase",
                        speed: 0.5,
                        revealDelay: 0.2
                    }
                }
            );
        } else if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
            entry.target.setAttribute('data-animated', 'true');
            gsap.fromTo(entry.target, { opacity: 0 }, { opacity: 1, duration: 1 });
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});
