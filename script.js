document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // On-Load Fade-In Animation for Sections
    // The CSS should have 'section { opacity: 0; transition: opacity 0.5s ease-in-out; }'
    // And a class like '.section-fade-in { opacity: 1; }' which we will add.
    // For this implementation, I'll assume the sections themselves have opacity 0 initially
    // and we just need to change it to 1. The CSS provided in the previous step
    // already sets section opacity to 0 and has a transition.
    // We will add a class 'section-fade-in' which sets opacity to 1.

    const sections = document.querySelectorAll('section'); // Or a more specific selector if needed

    // Simple simultaneous fade-in
    sections.forEach(section => {
        // Add a class that changes opacity to 1, relying on CSS transition
        // This assumes 'section-fade-in' class in CSS sets opacity: 1;
        // Based on the previous CSS, sections have opacity 0 by default
        // and transition. We just need to change their opacity.
        // Let's directly change style for simplicity if no specific class for fade-in state is defined
        // However, the prompt mentioned "Select all elements with the class section-fade-in"
        // and "For each section, change its opacity to 1".
        // The CSS provided was:
        // section { opacity: 0; transition: opacity 0.5s ease-in-out; }
        // .section-fade-in { opacity: 1; }
        // So, we should add the class .section-fade-in to each section.

        // Let's ensure sections have the base style for fade-in (opacity 0 and transition)
        // and then add the class to trigger it. The provided CSS already handles this.
    });


    // Correct approach for fade-in based on the provided CSS structure:
    // Sections have `opacity: 0` by default.
    // We need to add a class `section-fade-in` which has `opacity: 1`.
    // The prompt implies sections *already have* `section-fade-in` class if we are to select them with it.
    // "Select all elements with the class section-fade-in"
    // This is a bit contradictory with "For each section, change its opacity to 1".
    // Let's assume sections are just <section> tags and we make them fade in.
    // The CSS defines `section { opacity: 0; ...}`
    // And a helper class `.section-fade-in { opacity: 1; }`
    // So we should add this class to the sections on load.

    const sectionsToFade = document.querySelectorAll('section'); // Select all section elements

    window.addEventListener('load', () => {
        sectionsToFade.forEach(section => {
            // Option 1: Directly change opacity (if .section-fade-in class isn't used for triggering)
            // section.style.opacity = '1';

            // Option 2: Add a class that sets opacity to 1 (more common practice)
            // This assumes 'section-fade-in' class in CSS is defined as:
            // .section-fade-in { opacity: 1; }
            // The provided CSS had:
            // section { opacity: 0; /* Initial state for fade-in */ transition: opacity 0.5s ease-in-out; }
            // /* Class to be added by JavaScript to trigger fade-in */
            // .section-fade-in { opacity: 1; }
            // So, we should add 'section-fade-in' class to each 'section' element.
            section.classList.add('section-fade-in');
        });
    });


    // Placeholder Console Log
    console.log('Eminem Fan Site Loaded – Contest Submission for INR 1000');
});
