/**
 * STTMTC Main Interactive Script
 * Handles Mobile Navigation, Active States, and UI Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Toggle
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            // Toggle the open class
            navMenu.classList.toggle("nav--open");
            
            // Sync accessibility attributes
            const isOpen = navMenu.classList.contains("nav--open");
            navToggle.setAttribute("aria-expanded", isOpen);
            
            // Switch icon between Hamburger (☰) and Close (✕)
            navToggle.textContent = isOpen ? '✕' : '☰';
        });

        // Close menu when a link is clicked (useful for one-page sections)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove("nav--open");
                navToggle.textContent = '☰';
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // 2. Set Active Navigation Link
    // Normalizes paths to ensure "index.html" or "/" both highlight "Home"
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    
    document.querySelectorAll(".nav a").forEach(link => {
        const linkHref = link.getAttribute("href");
        if (linkHref === currentPath) {
            link.classList.add("nav-active");
        } else {
            link.classList.remove("nav-active");
        }
    });

    // 3. Dynamic Footer Year
    const yearDisplay = document.getElementById("year");
    if (yearDisplay) {
        yearDisplay.textContent = new Date().getFullYear();
    }

    // 4. Header Scroll Effect
    // Adds a shadow and shrinks padding when the user scrolls down
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("header--scrolled");
        } else {
            header.classList.remove("header--scrolled");
        }
    });

});