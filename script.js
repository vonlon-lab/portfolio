const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
const numStars = 250;
const maxDistance = 150; // max distance for connections

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 5;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
    }
}

for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
}

function getTextElements() {
    return document.querySelectorAll('.section h1, .section p, .section h2');
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
                    ctx.lineWidth = 0.3;
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(pointX, pointY);
                    ctx.stroke();
                }
            });
        }
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
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const blurAmount = Math.min(scrollY / 1000, 5); // max blur 5px
    canvas.style.filter = `blur(${blurAmount}px)`;

    // Parallax for stars
    stars.forEach(star => {
        star.y += scrollY * 0.001; // slow vertical parallax
    });
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
        if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
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
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Discord hover and copy
const discordEl = document.querySelector('.discord');
if (discordEl) {
    const originalText = discordEl.textContent;
    const nick = discordEl.dataset.nick;
    discordEl.addEventListener('mouseenter', () => {
        discordEl.textContent = nick;
    });
    discordEl.addEventListener('mouseleave', () => {
        discordEl.textContent = originalText;
    });
    discordEl.addEventListener('click', () => {
        navigator.clipboard.writeText(nick);
    });
}