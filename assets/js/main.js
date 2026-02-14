// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
    const expanded = nav.classList.contains("is-open");
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  });
}

// Footer year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Set active nav link by pathname
const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
document.querySelectorAll(".nav a").forEach(a => {
  const href = (a.getAttribute("href") || "").toLowerCase();
  if (href === path) a.classList.add("active");
});