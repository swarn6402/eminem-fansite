document.addEventListener('DOMContentLoaded', function() {

    // 0. Utility Functions
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // --- Initial Smooth Scroll & Fade-In ---
    const navLinks = selectAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = select(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    window.addEventListener('load', () => {
        const sections = selectAll('section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
            }, index * 150);
        });
    });

    // 1. Theme Toggle
    const themeToggleButton = select('#theme-toggle');
    const body = select('body');
    const themeIconPlaceholder = select('#theme-toggle .theme-icon-placeholder');

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
            if (themeIconPlaceholder) themeIconPlaceholder.textContent = '☀️';
        } else {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            if (themeIconPlaceholder) themeIconPlaceholder.textContent = '🌙';
        }
        localStorage.setItem('theme', theme);
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            body.classList.contains('dark-theme') ? applyTheme('light') : applyTheme('dark');
        });
    }
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    // 2. Lazy Loading
    const lazyElements = selectAll('[data-src], [data-iframe-src]');
    if ("IntersectionObserver" in window) {
        let lazyObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (el.dataset.src) { el.src = el.dataset.src; el.removeAttribute('data-src'); }
                    if (el.dataset.iframeSrc) { el.src = el.dataset.iframeSrc; el.removeAttribute('data-iframe-src'); }
                    observer.unobserve(el);
                }
            });
        });
        lazyElements.forEach(el => lazyObserver.observe(el));
    } else {
        lazyElements.forEach(el => {
            if (el.dataset.src) { el.src = el.dataset.src; el.removeAttribute('data-src'); }
            if (el.dataset.iframeSrc) { el.src = el.dataset.iframeSrc; el.removeAttribute('data-iframe-src'); }
        });
    }

    // 3. Back to Top Button
    const backToTopButton = select('#back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            (window.scrollY > 200 || document.documentElement.scrollTop > 200) ?
                backToTopButton.classList.remove('hidden') :
                backToTopButton.classList.add('hidden');
        });
        backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // 4. "Listen Now" CTA Scroll
    const ctaListenNowButton = select('#cta-listen-now');
    const songsSectionTarget = select('#songs');
    if (ctaListenNowButton && songsSectionTarget) {
        ctaListenNowButton.addEventListener('click', () => {
            songsSectionTarget.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // 5. Typewriter Effect
    const aboutCardForTypewriter = select('.about-card');
    if (aboutCardForTypewriter) {
        const paragraphsToType = selectAll('.about-card p');
        const originalTexts = Array.from(paragraphsToType).map(p => p.textContent);
        let typewriterAnimated = false;
        function typewriter(element, text, speed = 30) {
            element.innerHTML = ''; let i = 0;
            function type() { if (i < text.length) { element.innerHTML += text.charAt(i); i++; setTimeout(type, speed); } }
            type();
        }
        if ("IntersectionObserver" in window) {
            const typewriterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !typewriterAnimated) {
                        paragraphsToType.forEach((p, index) => typewriter(p, originalTexts[index]));
                        typewriterAnimated = true; observer.unobserve(aboutCardForTypewriter);
                    }
                });
            }, { threshold: 0.5 });
            typewriterObserver.observe(aboutCardForTypewriter);
        } else {
            if (!typewriterAnimated) {
                 paragraphsToType.forEach((p, index) => typewriter(p, originalTexts[index]));
                 typewriterAnimated = true;
            }
        }
    }

    // --- Playlist Functionality ---
    const tracks = [
      { title: "Lose Yourself", artist: "Eminem", src: "https://via.placeholder.com/music/lose_yourself.mp3", art: "https://via.placeholder.com/300x300.png?text=Lose+Yourself+Art" },
      { title: "Stan (feat. Dido)", artist: "Eminem", src: "https://via.placeholder.com/music/stan.mp3", art: "https://via.placeholder.com/300x300.png?text=Stan+Art" },
      { title: "The Real Slim Shady", artist: "Eminem", src: "https://via.placeholder.com/music/real_slim_shady.mp3", art: "https://via.placeholder.com/300x300.png?text=Real+Slim+Shady+Art" },
      { title: "Without Me", artist: "Eminem", src: "https://via.placeholder.com/music/without_me.mp3", art: "https://via.placeholder.com/300x300.png?text=Without+Me+Art" },
      { title: "Not Afraid", artist: "Eminem", src: "https://via.placeholder.com/music/not_afraid.mp3", art: "https://via.placeholder.com/300x300.png?text=Not+Afraid+Art" }
    ];
    let currentTrackIndex = 0;
    const playlistTracksUL = select('#playlist-tracks');
    const currentAlbumArt = select('#current-album-art');
    const currentTrackTitleDisplay = select('#current-track-title');
    const playPauseBtn = select('#play-pause-btn');
    const nextTrackBtnFooter = select('#next-track-footer'); // Renamed to avoid conflict
    const prevTrackBtnFooter = select('#prev-track-footer'); // Renamed to avoid conflict
    const progressBar = select('#progress-bar');
    const currentTimeDisplay = select('#current-time');
    const durationDisplay = select('#duration');
    const audioPlayerFooter = select('#audio-player-footer');
    let audioElement = select('#audio-element');
    if (!audioElement) {
        audioElement = document.createElement('audio'); audioElement.id = 'audio-element'; audioElement.style.display = 'none';
        if(audioPlayerFooter) { audioPlayerFooter.appendChild(audioElement); } else { document.body.appendChild(audioElement); }
    }

    function renderPlaylist() { 
        if(!playlistTracksUL) return;
        playlistTracksUL.innerHTML = tracks.map((t, i) => `<li data-index="${i}" class="${i === currentTrackIndex ? 'active' : ''}">${t.title}</li>`).join(''); 
    }
    function loadTrack(index) {
        currentTrackIndex = index;
        if(audioElement) audioElement.src = tracks[index].src;
        if(currentAlbumArt) currentAlbumArt.src = tracks[index].art;
        if(currentTrackTitleDisplay) currentTrackTitleDisplay.textContent = `${tracks[index].title} - ${tracks[index].artist}`;
        if(playlistTracksUL) {
            Array.from(playlistTracksUL.children).forEach(li => li.classList.remove('active'));
            if(playlistTracksUL.children[index]) playlistTracksUL.children[index].classList.add('active');
        }
        if(progressBar) progressBar.value = 0;
        if(currentTimeDisplay) currentTimeDisplay.textContent = formatTime(0);
        if(durationDisplay && audioElement.duration) durationDisplay.textContent = formatTime(audioElement.duration);
        else if(durationDisplay) durationDisplay.textContent = formatTime(0);

        if(audioPlayerFooter && !audioPlayerFooter.classList.contains('visible')) audioPlayerFooter.classList.add('visible');
        if(playPauseBtn && playPauseBtn.querySelector('i')) {
            playPauseBtn.querySelector('i').classList.remove('fa-pause');
            playPauseBtn.querySelector('i').classList.add('fa-play');
        }
    }
    function playAudio() { 
        if(audioElement) audioElement.play().catch(e => console.error("Play error:", e)); 
        if(playPauseBtn && playPauseBtn.querySelector('i')) {playPauseBtn.querySelector('i').classList.remove('fa-play'); playPauseBtn.querySelector('i').classList.add('fa-pause');}
    }
    function pauseAudio() { 
        if(audioElement) audioElement.pause(); 
        if(playPauseBtn && playPauseBtn.querySelector('i')) {playPauseBtn.querySelector('i').classList.remove('fa-pause'); playPauseBtn.querySelector('i').classList.add('fa-play');}
    }
    function togglePlayPause() { if(audioElement && (audioElement.paused || audioElement.ended)) playAudio(); else pauseAudio(); }
    function nextTrackAudio() { currentTrackIndex = (currentTrackIndex + 1) % tracks.length; loadTrack(currentTrackIndex); playAudio(); }
    function prevTrackAudio() { currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length; loadTrack(currentTrackIndex); playAudio(); }
    function updateProgress() { 
        if(audioElement && progressBar) progressBar.value = audioElement.currentTime; 
        if(audioElement && currentTimeDisplay) currentTimeDisplay.textContent = formatTime(audioElement.currentTime); 
    }
    function formatTime(seconds) { if(isNaN(seconds) || seconds === Infinity) return "0:00"; const m = Math.floor(seconds/60); const s = Math.floor(seconds%60).toString().padStart(2,'0'); return `${m}:${s}`;}
    
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (nextTrackBtnFooter) nextTrackBtnFooter.addEventListener('click', nextTrackAudio);
    if (prevTrackBtnFooter) prevTrackBtnFooter.addEventListener('click', prevTrackAudio);
    if (audioElement) {
        audioElement.addEventListener('ended', nextTrackAudio);
        audioElement.addEventListener('timeupdate', updateProgress);
        audioElement.addEventListener('loadedmetadata', () => {
            if(progressBar) progressBar.max = audioElement.duration;
            if(durationDisplay) durationDisplay.textContent = formatTime(audioElement.duration);
        });
    }
    if (progressBar) progressBar.addEventListener('input', () => { if(audioElement) audioElement.currentTime = progressBar.value; });
    if (playlistTracksUL) {
         playlistTracksUL.addEventListener('click', (e) => {
            if (e.target && e.target.matches('li[data-index]')) {
                loadTrack(parseInt(e.target.dataset.index));
                playAudio();
            }
        });
    }
    if (tracks.length > 0) {
        renderPlaylist();
        loadTrack(0);
    }


    // --- Discography Carousel Functionality ---
    const carouselTrack = select('.carousel-track');
    const albumCards = selectAll('.carousel-track .album-card');
    const prevCarouselBtn = select('.carousel-prev');
    const nextCarouselBtn = select('.carousel-next');

    let currentCarouselSlideIndex = 0;
    let itemsPerSlide = 3;
    let totalSlides = 0;
    const totalAlbumCards = albumCards.length;

    function getItemsPerSlide() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    function setupCarousel() {
        if (!carouselTrack || totalAlbumCards === 0) {
            if(prevCarouselBtn) prevCarouselBtn.style.display = 'none';
            if(nextCarouselBtn) nextCarouselBtn.style.display = 'none';
            return;
        }
        if(prevCarouselBtn) prevCarouselBtn.style.display = 'block';
        if(nextCarouselBtn) nextCarouselBtn.style.display = 'block';

        itemsPerSlide = getItemsPerSlide();
        totalSlides = Math.ceil(totalAlbumCards / itemsPerSlide);
        currentCarouselSlideIndex = Math.min(Math.max(0, currentCarouselSlideIndex), totalSlides - 1);
        updateCarouselDisplay();
    }

    function updateCarouselDisplay() {
        if (!carouselTrack) return;
        const offset = currentCarouselSlideIndex * -100;
        carouselTrack.style.transform = `translateX(${offset}%)`;
        if (prevCarouselBtn) prevCarouselBtn.disabled = currentCarouselSlideIndex === 0;
        if (nextCarouselBtn) nextCarouselBtn.disabled = currentCarouselSlideIndex >= totalSlides - 1;
    }

    if (prevCarouselBtn) {
        prevCarouselBtn.addEventListener('click', () => {
            currentCarouselSlideIndex = Math.max(0, currentCarouselSlideIndex - 1);
            updateCarouselDisplay();
        });
    }
    if (nextCarouselBtn) {
        nextCarouselBtn.addEventListener('click', () => {
            currentCarouselSlideIndex = Math.min(totalSlides - 1, currentCarouselSlideIndex + 1);
            updateCarouselDisplay();
        });
    }
    window.addEventListener('resize', debounce(setupCarousel, 250));
    if (totalAlbumCards > 0) { setupCarousel(); } 
    else {
        if(prevCarouselBtn) prevCarouselBtn.style.display = 'none';
        if(nextCarouselBtn) nextCarouselBtn.style.display = 'none';
    }
    
    // --- Subscription Form Logic ---
    const subscriptionForm = select('#subscription-form');
    const emailInput = select('#email-input');
    const alertBanner = select('#alert-banner');
    // Submit button is selected inside the event listener for robustness if form content changes.

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    let formMessageTimeout; // To manage multiple rapid submissions hiding messages too soon.
    function showFormMessage(message, type) {
        if (!alertBanner) return;
        clearTimeout(formMessageTimeout); // Clear any existing timeout

        alertBanner.textContent = message;
        alertBanner.className = ''; // Clear previous classes
        alertBanner.classList.add(type); // type will be 'success' or 'error'
        alertBanner.style.display = 'block';

        formMessageTimeout = setTimeout(() => {
            alertBanner.style.display = 'none';
            alertBanner.textContent = '';
            alertBanner.className = '';
        }, 5000); // Hide after 5 seconds
    }

    if (subscriptionForm && emailInput && alertBanner) {
        subscriptionForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = emailInput.value.trim();
            const submitButton = this.querySelector('button[type="submit"]'); // 'this' refers to the form

            if (email === '') {
                showFormMessage('Please enter your email address.', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate Submission
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';
            }
            
            // Using 'info' class if defined in CSS, otherwise it will just be default text color.
            // For this example, we'll assume 'info' might be styled like 'success' or have its own neutral style.
            // If no 'info' style, it will just be text.
            showFormMessage('Subscribing...', 'info'); // 'info' class for processing message

            setTimeout(() => {
                showFormMessage('Successfully subscribed! Thank you.', 'success');
                emailInput.value = ''; // Clear input
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Subscribe';
                }
                // The general showFormMessage timeout will hide this success message.
            }, 1000); // Simulate 1s network delay
        });
    }
    
    console.log('Eminem Fan Site All JS Loaded – Contest Submission for INR 1000');
});
