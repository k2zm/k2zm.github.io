(function () {
    // Active nav highlighting
    const links = Array.from(document.querySelectorAll('[data-nav]'));
    const map = new Map(links.map(l => [l.getAttribute('href').slice(1), l]));
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                links.forEach(a => a.removeAttribute('aria-current'));
                const link = map.get(id);
                if (link) link.setAttribute('aria-current', 'true');
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
    document.querySelectorAll('main section[id]').forEach(sec => obs.observe(sec));

    // URLを変更せずにスムーズスクロール
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Video card click playback
    document.querySelectorAll('.card').forEach(card => {
        const video = card.querySelector('video[data-src]');
        const wrapper = card.querySelector('.thumb-wrapper');
        if (!video || !wrapper) return;

        const togglePlay = () => {
            if (!video.src) video.src = video.dataset.src; // Lazy load
            if (video.paused) {
                video.play().catch(() => { });
            } else {
                video.pause();
            }
        };

        // Click or Enter/Space key to toggle play/pause
        wrapper.setAttribute('role', 'button');
        wrapper.setAttribute('tabindex', '0');
        wrapper.addEventListener('click', togglePlay);
        wrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePlay();
            }
        });
        // Fade out play icon when playing (using existing .is-playing class)
        video.addEventListener('play', () => {
            card.classList.add('is-playing');
            wrapper.setAttribute('aria-pressed', 'true');
        });
        video.addEventListener('pause', () => {
            card.classList.remove('is-playing');
            wrapper.setAttribute('aria-pressed', 'false');
        });
    });
})();
