// Welcome message in browser console
console.log("Welcome to Priyanshi's Portfolio!");

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(event) {
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            event.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Button interaction
document.querySelector('.btn').addEventListener('click', function() {
    console.log("Exploring Priyanshi's projects!");
});