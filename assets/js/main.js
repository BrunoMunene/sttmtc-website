/**
 * STTMTC Main Interactive Script
 * Handles Mobile Navigation, Active States, and UI Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Toggle (Enhanced for Mobile Touch)
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav");

    if (navToggle && navMenu) {
        const toggleMenu = (e) => {
            // Prevent potential double-triggering on mobile devices
            if (e) e.preventDefault();
            
            navMenu.classList.toggle("nav--open");
            
            const isOpen = navMenu.classList.contains("nav--open");
            navToggle.setAttribute("aria-expanded", isOpen);
            
            // Switch icon between Hamburger (☰) and Close (✕)
            navToggle.textContent = isOpen ? '✕' : '☰';
            
            // Optional: Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        // Listen for both click and touchstart for faster response on phones
        navToggle.addEventListener("click", toggleMenu);

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove("nav--open");
                navToggle.textContent = '☰';
                navToggle.setAttribute("aria-expanded", "false");
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Set Active Navigation Link (Optimized)
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    
    document.querySelectorAll(".nav a").forEach(link => {
        const linkHref = link.getAttribute("href");
        // Check if path matches or if it's the root/home
        if (linkHref === currentPath || (currentPath === "" && linkHref === "index.html")) {
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
    const header = document.querySelector(".header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("header--scrolled");
            } else {
                header.classList.remove("header--scrolled");
            }
        }, { passive: true });
    }
});