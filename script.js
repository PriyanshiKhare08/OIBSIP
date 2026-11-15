const form = document.getElementById("newsletter-form");
const emailInput = document.getElementById("email");
const message = document.getElementById("message");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (email === "") {
        message.textContent = "Please enter your email address.";
        message.style.color = "red";
        return;
    }

    message.textContent = "Thank you for subscribing to ÉLORA! 💗";
    message.style.color = "green";

    form.reset();
});