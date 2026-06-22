document.addEventListener('DOMContentLoaded', () => {
    // Параллакс элементы
    const bgLayer = document.getElementById('parallax-bg');
    const textLayer = document.getElementById('parallax-text');
    const imgLayer = document.getElementById('parallax-img');
    const cardLayer = document.getElementById('parallax-card');

    // Модалки и интерфейс меню
    const burgerBtn = document.getElementById('burger-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const fullscreenMenu = document.getElementById('fullscreen-menu');
    const menuNav = document.getElementById('menu-nav');
    const menuFooter = document.getElementById('menu-footer');
    const bookingModal = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const triggerButtons = document.querySelectorAll('.trigger-modal');

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0; 
    let currentX = 0, currentY = 0; 
    let isDesktop = false;

    /* ==========================================================================
       УПРАВЛЕНИЕ ОКНАМИ И МЕНЮ
       ========================================================================== */
    burgerBtn.addEventListener('click', () => {
        fullscreenMenu.style.display = 'block';
        setTimeout(() => { fullscreenMenu.classList.add('active'); }, 10);
        burgerBtn.classList.add('hidden-state'); 
        document.body.classList.add('modal-open');
        closeFormModal();
    });

    function closeMainMenu() {
        fullscreenMenu.classList.remove('active');
        setTimeout(() => { if (!fullscreenMenu.classList.contains('active')) fullscreenMenu.style.display = 'none'; }, 400);
        burgerBtn.classList.remove('hidden-state'); 
        if (!bookingModal.classList.contains('active')) document.body.classList.remove('modal-open');
    }

    menuCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeMainMenu(); });
    
    fullscreenMenu.addEventListener('click', (e) => { 
        if (!menuNav.contains(e.target) && !menuFooter.contains(e.target) && e.target !== menuCloseBtn) {
            closeMainMenu(); 
        }
    });

    triggerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            bookingModal.style.display = isDesktop ? 'block' : 'flex';
            setTimeout(() => { bookingModal.classList.add('active'); }, 10);
            document.body.classList.add('modal-open');
            fullscreenMenu.classList.remove('active');
            fullscreenMenu.style.display = 'none';
            burgerBtn.classList.remove('hidden-state');
        });
    });

    function closeFormModal() {
        bookingModal.classList.remove('active');
        setTimeout(() => { if (!bookingModal.classList.contains('active')) bookingModal.style.display = 'none'; }, 400);
        if(!fullscreenMenu.classList.contains('active')) document.body.classList.remove('modal-open');
    }

    closeModalBtn.addEventListener('click', closeFormModal);
    bookingModal.addEventListener('click', (e) => { if (e.target === bookingModal) closeFormModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeFormModal(); closeMainMenu(); } });

    /* ==========================================================================
       BREAKPOINT СЛУШАТЕЛЬ & ПАРАЛЛАКС ПОЛОЖЕНИЕ
       ========================================================================== */
    const mediaQuery = window.matchMedia('(min-width: 769px)');

    function handleBreakpointChange(e) {
        isDesktop = e.matches;
        bgLayer.style.transform = '';
        textLayer.style.transform = '';
        cardLayer.style.transform = '';
        imgLayer.style.transform = isDesktop ? '' : 'translateX(-50%)';
        if (!isDesktop) imgLayer.style.left = '50%';
    }

    mediaQuery.addEventListener('change', handleBreakpointChange);
    handleBreakpointChange(mediaQuery);

    document.addEventListener('mousemove', (e) => {
        if (!isDesktop) return;
        handleMove(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', (e) => {
        if (isDesktop) return;
        if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    function handleMove(clientX, clientY) {
        mouseX = clientX;
        mouseY = clientY;
        
        if (isDesktop) {
            const rect = imgLayer.getBoundingClientRect();
            const mouseXInContainer = clientX - rect.left;
            const mouseYInContainer = clientY - rect.top;
            imgLayer.style.setProperty('--mouse-x', `${mouseXInContainer}px`);
            imgLayer.style.setProperty('--mouse-y', `${mouseYInContainer}px`);
        }

        targetX = (clientX / window.innerWidth) - 0.5;
        targetY = (clientY / window.innerHeight) - 0.5;
    }

    function renderParallax() {
        currentX += (targetX - currentX) * 0.08; 
        currentY += (targetY - currentY) * 0.08; 

        const bgSpeed = -35;   
        const textSpeed = -55; 
        const imgSpeed = 40;   
        const cardSpeed = 60; 

        const bgTranslateX = currentX * bgSpeed;
        const textTranslateX = currentX * textSpeed;
        const imgTranslateX = currentX * imgSpeed;
        const cardTranslateX = currentX * cardSpeed;

        if (isDesktop) {
            const maxRotateY = 0.2; 
            const rotateY = -currentX * maxRotateY; 

            bgLayer.style.transform = `translate(calc(-50% + ${bgTranslateX}px), -50%)`;
            textLayer.style.transform = `translate(calc(-50% + ${textTranslateX}px), -50%)`;
            cardLayer.style.transform = `translate(${cardTranslateX}px, -50%)`;
            imgLayer.style.transform = `translateX(calc(-40% + ${imgTranslateX}px)) perspective(1000px) rotateX(0deg) rotateY(${rotateY}deg)`;
        } else {
            bgLayer.style.transform = `translate(calc(-50% + ${bgTranslateX * 0.4}px), calc(-50% + ${currentY * bgSpeed * 0.4}px))`;
            textLayer.style.transform = `translate(calc(-50% + ${textTranslateX * 0.6}px), calc(-50% + ${currentY * textSpeed * 0.6}px))`;
            imgLayer.style.transform = `translateX(calc(-50% + ${imgTranslateX}px)) translateY(${currentY * 20}px)`;
        }
        
        requestAnimationFrame(renderParallax);
    }

    requestAnimationFrame(renderParallax);

    /* ==========================================================================
       СКРОЛЛ КАРТОЧЕК (ПРОГРАММА)
       ========================================================================== */
    const slider = document.getElementById('slider-wrapper');
    const scrollBar = document.getElementById('scroll-bar');
    const scrollBadge = document.getElementById('scroll-badge');

    let isDown = false; let startX; let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => { isDown = false; });
    slider.addEventListener('mouseup', () => { isDown = false; });
    slider.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        slider.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    function updateScrollIndicator() {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        if (maxScroll <= 0) return;
        const percentage = slider.scrollLeft / maxScroll;
        const moveX = percentage * (scrollBar.clientWidth - scrollBadge.offsetWidth);
        scrollBadge.style.left = `${moveX}px`;
    }
    
    slider.addEventListener('scroll', updateScrollIndicator);
    window.addEventListener('resize', updateScrollIndicator);

    scrollBar.addEventListener('mousedown', (e) => {
        moveSliderByBar(e);
        function onMouseMove(ev) { moveSliderByBar(ev); }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', () => document.removeEventListener('mousemove', onMouseMove), { once: true });
    });

    function moveSliderByBar(e) {
        const rect = scrollBar.getBoundingClientRect();
        let clickX = e.clientX - rect.left;
        const bWidth = scrollBadge.offsetWidth;
        clickX = Math.max(bWidth / 2, Math.min(clickX, rect.width - bWidth / 2));
        const percentage = (clickX - bWidth / 2) / (rect.width - bWidth);
        slider.scrollLeft = percentage * (slider.scrollWidth - slider.clientWidth);
    }
});