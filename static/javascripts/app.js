/* Dark Mode Support */

const btn = document.querySelector(".color-mode-toggle");

// On page load: apply saved preference if any.
// If no saved preference, PicoCSS's prefers-color-scheme media query handles it.
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
}

// On toggle: flip between dark and light, save to localStorage.
// Guard against pages where the toggle button is absent.
if (btn) {
  btn.addEventListener("click", function() {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    return false;
  });
}
