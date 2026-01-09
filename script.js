document.addEventListener('DOMContentLoaded', function() {
    const output = document.getElementById('output');

    const asciiArt = {
        about: `
██╗    ██╗ ██████╗ ██╗    ██╗ ██████╗ ██████╗ ██╗
██║    ██║██╔═══██╗██║    ██║██╔═══██╗██╔══██╗██║
██║ █╗ ██║██║   ██║██║ █╗ ██║██║   ██║██████╔╝██║
██║███╗██║██║   ██║██║███╗██║██║   ██║██╔══██╗██║
╚███╔███╔╝╚██████╔╝╚███╔███╔╝╚██████╔╝██║  ██║██║
 ╚══╝╚══╝  ╚═════╝  ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝

Hi! I'm wowori, a passionate software engineer with expertise in web development,
machine learning, and open-source contributions. I love creating innovative solutions
and exploring new technologies.
        `,
        projects: `
██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗
██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗
██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║
██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝

1. Terminal Portfolio: A unique portfolio website styled as a Linux terminal.
        `,
        skills: `
███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝

- Programming Languages: JavaScript, Python, Lua
- Web Technologies: HTML, CSS, React, Node.js, Electron
- Tools: Git, Github Desktop, Kilo Code
- Soft Skills: Problem-solving
        `,
        contact: `
 ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║
██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║
╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝

Email: vonlondm@inbox.ru
GitHub: github.com/vonlon-lab
Discord: vonlonxd
        `,
        unknown: `
Command not found. Type 'help' for available commands.
        `
    };

    function displayOutput(text) {
        const screen = document.createElement('div');
        screen.className = 'screen';
        screen.innerHTML = '<pre>' + text + '</pre>';
        output.appendChild(screen);
        setTimeout(() => screen.classList.add('active'), 10);
        output.scrollTop = output.scrollHeight;
    }

    // Display all portfolio information immediately
    displayOutput(asciiArt.about);
    displayOutput(asciiArt.projects);
    displayOutput(asciiArt.skills);
    displayOutput(asciiArt.contact);

    // Image upload functionality
    const imageUpload = document.getElementById('image-upload');
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const ascii = convertImageToAscii(img);
                    displayOutput('<pre>' + ascii + '</pre>');
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    function convertImageToAscii(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 80; // ASCII width
        const height = Math.floor(width * (img.height / img.width) / 2); // Adjust for aspect ratio
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        let ascii = '';
        const chars = '@%#*+=-:. '; // ASCII characters from dark to light
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const brightness = (r + g + b) / 3;
                const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                ascii += chars[charIndex];
            }
            ascii += '\n';
        }
        return ascii;
    }
});