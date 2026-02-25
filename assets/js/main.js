/**
 * STTMTC Main Interactive Script
 * Handles Mobile Navigation, Active States, and UI Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Toggle (Synced with is-active class)
    const navToggle = document.getElementById("mobile-toggle") || document.querySelector(".nav-toggle");
    const navMenu = document.getElementById("primary-nav") || document.querySelector(".nav");

    if (navToggle && navMenu) {
        const toggleMenu = (e) => {
            // Check if it's a click on an anchor tag to let it bubble
            if (e.target.tagName === 'A') return;
            
            navMenu.classList.toggle("is-active");
            
            const isOpen = navMenu.classList.contains("is-active");
            navToggle.setAttribute("aria-expanded", isOpen);
            
            // Switch icon between Hamburger (☰) and Close (✕)
            navToggle.textContent = isOpen ? '✕' : '☰';
            
            // Prevent body scroll when menu is open on mobile
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        navToggle.addEventListener("click", toggleMenu);

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove("is-active");
                navToggle.textContent = '☰';
                navToggle.setAttribute("aria-expanded", "false");
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside the header
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains("is-active")) {
                navMenu.classList.remove("is-active");
                navToggle.textContent = '☰';
                document.body.style.overflow = '';
            }
        });
    }

    // 2. Set Active Navigation Link (Optimized)
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    
    document.querySelectorAll(".nav a").forEach(link => {
        const linkHref = link.getAttribute("href");
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