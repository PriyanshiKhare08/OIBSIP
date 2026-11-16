
const header = document.querySelector(".header");
const menuButton = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");

// Sticky header effect
window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
});

// Mobile navigation
menuButton.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
});

// Close mobile menu after clicking a link
navbar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
});

// Scroll reveal animation
const revealElements = document.querySelectorAll(
    ".product-card, .category"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => observer.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("visible"));
}

// Demo newsletter form
const newsletterForm = document.querySelector(".newsletter-form");

newsletterForm.addEventListener("submit", event => {
    event.preventDefault();

    const emailInput = document.querySelector("#email");
    const message = document.querySelector(".form-message");

    if (emailInput.checkValidity()) {
        message.textContent =
            "Thank you for joining VELORA! This is a demo form.";

        emailInput.value = "";
    } else {
        emailInput.reportValidity();
    }
});
