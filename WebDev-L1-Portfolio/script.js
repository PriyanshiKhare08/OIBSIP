
document.addEventListener("DOMContentLoaded", () => {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle-cursor";
  sparkle.textContent = "✦";
  document.body.appendChild(sparkle);

  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      sparkle.style.left = e.clientX + "px";
      sparkle.style.top = e.clientY + "px";
    });
  }
});



