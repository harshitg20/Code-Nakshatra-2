/* MAIN ENTRY POINT: All extracted inline scripts */

        // ── Register plugins ──────────────────────────────────────────
        gsap.registerPlugin(ScrollTrigger, TextPlugin);
        // ── Helper: run after DOM is fully ready ───────────────────────
        window.addEventListener('DOMContentLoaded', function () {
            /* ── 1. NAVBAR  – slide down on page load ─────────────────── */
            gsap.from('[id="about-me"] ~ div, .nav-pill', {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.1,
            });
            /* ── 2. HERO  – stagger text blocks in ───────────────────── */
            gsap.from('.welcome-pill', {
                opacity: 0,
                y: 30,
                duration: 0.9,
                delay: 0.3,
                ease: 'power3.out',
            });
            /* ── 3. DIRECTIONAL COSMIC TIMELINE ANIMATIONS ── */
            gsap.utils.toArray('.tl-cosmic-item').forEach(function (item) {
                // Determine direction based on class
                const isOdd = item.classList.contains('tl-cosmic-item-odd');
                const xOffset = isOdd ? 200 : -200; // Reversed: Left items come from right-offset, Right items from left-offset
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        end: 'bottom 10%',
                        toggleActions: 'play reverse play reverse'
                    },
                    x: xOffset,
                    opacity: 0,
                    scale: 0.8,
                    duration: 1.2,
                    ease: 'power3.out'
                });
                // Floating animation for planets (continuous)
                const sphere = item.querySelector('.planet-sphere');
                if (sphere) {
                    gsap.to(sphere, {
                        y: -15,
                        duration: 2.5 + Math.random(),
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                        delay: Math.random()
                    });
                }
            });
            /* ── 4. JUDGE CARDS  – scroll-triggered fade-up ─────────── */
            gsap.from('.jg-card', {
                scrollTrigger: {
                    trigger: '#judges',
                    start: 'top 75%',
                },
                opacity: 0,
                y: 50,
                stagger: 0.12,
                duration: 0.8,
                ease: 'back.out(1.2)',
            });
            /* ── 5. SECTION HEADINGS  – fade + slide up ─────────────── */
            gsap.utils.toArray('.h1-div-style').forEach(function (h) {
                gsap.from(h, {
                    scrollTrigger: { trigger: h, start: 'top 88%' },
                    opacity: 0,
                    y: 40,
                    duration: 0.7,
                    ease: 'power2.out',
                });
            });
            /* ── 6. TYPEWRITER EFFECT ────────────────────────── */
            const textElement = document.getElementById('typewriter-text');
            const cursorElement = document.getElementById('typewriter-cursor');
            const text = "THINK . BUILD . LAUNCH";
            let charIndex = 0;
            let isDeleting = false;
            function typeLoop() {
                const currentText = textElement.textContent;
                if (!isDeleting) {
                    // Typing
                    textElement.textContent = text.substring(0, charIndex + 1);
                    charIndex++;
                    if (charIndex === text.length) {
                        isDeleting = true;
                        setTimeout(typeLoop, 2000); // Wait before deleting
                    } else {
                        setTimeout(typeLoop, 100);
                    }
                } else {
                    // Deleting
                    textElement.textContent = text.substring(0, charIndex - 1);
                    charIndex--;
                    if (charIndex === 0) {
                        isDeleting = false;
                        startBlinkingCycle(); // Start blinking before next type
                    } else {
                        setTimeout(typeLoop, 50);
                    }
                }
            }
            function startBlinkingCycle() {
                let blinkCount = 0;
                const maxBlinks = 6; // 3 blinks (on-off = 2 units)
                const blinkInterval = setInterval(() => {
                    cursorElement.style.opacity = cursorElement.style.opacity === '0' ? '1' : '0';
                    blinkCount++;
                    if (blinkCount >= maxBlinks) {
                        clearInterval(blinkInterval);
                        cursorElement.style.opacity = '1';
                        setTimeout(typeLoop, 500); // Start typing after blinks
                    }
                }, 400);
            }
            // Initial Start
            startBlinkingCycle();
        });
        // ── CUSTOM THREE.JS STARFIELD ──────────────────────────────
        // The original canvas is managed by a compiled chunk. We'll override
        // its behavior by creating our own Scene, Camera, and Points just for the background.
        window.addEventListener('load', function () {
            // Wait briefly for original scripts to potentially initialize their canvas
            setTimeout(function () {
                const container = document.querySelector('.bg-\\[\\#030014\\] > div.fixed.inset-0') || document.querySelector('div.fixed.inset-0.z-\\[20\\]');
                if (!container) return;
                // Clear out the old canvas completely
                container.innerHTML = '';
                // Create our own scene
                const scene = new THREE.Scene();
                // Setup Camera
                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.z = 1; // Looking at z=0
                // Setup Renderer
                const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                // It's important to keep the style/position identical to the original
                renderer.domElement.style.position = 'absolute';
                renderer.domElement.style.top = '0';
                renderer.domElement.style.left = '0';
                renderer.domElement.style.width = '100%';
                renderer.domElement.style.height = '100%';
                container.appendChild(renderer.domElement);
                // Create Particles (Slightly increased based on feedback)
                const particlesCount = 550; // Increased particle count
                const posArray = new Float32Array(particlesCount * 3);
                for (let i = 0; i < particlesCount * 3; i += 3) {
                    // Random positions between -2 and 2
                    posArray[i] = (Math.random() - 0.5) * 4;     // x
                    posArray[i + 1] = (Math.random() - 0.5) * 4;   // y
                    posArray[i + 2] = (Math.random() - 0.5) * 2;   // z
                }
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
                // Subtle, small white stars
                const material = new THREE.PointsMaterial({
                    size: 0.005,
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                });
                const particlesMesh = new THREE.Points(geometry, material);
                scene.add(particlesMesh);
                // Handle Window Resize
                window.addEventListener('resize', () => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                });
                // Animation Loop
                const clock = new THREE.Clock();
                function animate() {
                    requestAnimationFrame(animate);
                    const elapsedTime = clock.getElapsedTime();
                    // Move particles UPWARDS slowly (the user request)
                    // y axis in Three.js goes up, so we actually want to move the entire mesh UP
                    // Instead of moving the mesh and resetting it, let's rotate it slightly 
                    // and move it up, resetting when it goes too high
                    particlesMesh.position.y += 0.0015; // Slow upward float
                    // Reset position to loop the effect smoothly
                    if (particlesMesh.position.y > 2) {
                        particlesMesh.position.y = -2;
                    }
                    // Optional: very slow rotation for depth
                    particlesMesh.rotation.y += 0.0002;
                    renderer.render(scene, camera);
                }
                animate();
            }, 500); // 500ms delay ensures original React/compiled scripts yield
        });
    


        document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('swag-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const nameInput = document.getElementById('swag-name');
            const uploadInput = document.getElementById('swag-upload');
            const downloadBtn = document.getElementById('swag-download');
            let frameImage = new Image();
            frameImage.crossOrigin = "anonymous";
            frameImage.src = "https://ik.imagekit.io/logicsync/WhatsApp%20Image%202026-03-16%20at%209.48.39%20PM.jpeg";
            let userImage = new Image();
            function renderCanvas() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Background Color
                ctx.fillStyle = '#0a0a0c';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Draw Frame First (Because it is an opaque JPEG)
                if (frameImage.complete && frameImage.src) {
                    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
                } else if (!frameImage.src) {
                    // Placeholder when no frame is provided
                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                    gradient.addColorStop(0, '#a855f7'); // purple-500
                    gradient.addColorStop(1, '#06b6d4'); // cyan-500
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 15;
                    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
                    ctx.font = 'bold 36px sans-serif';
                    ctx.fillStyle = gradient;
                    ctx.textAlign = 'center';
                    ctx.fillText('Paste Frame Link In The Card To Preview', canvas.width / 2, 80);
                }
                // Then Draw User Photo exactly inside the black placeholder
                // Placeholder relative coords based on 967x1202 source: 
                // Left=197, Top=274, Width=583, Height=568
                if (userImage.src && frameImage.complete) {
                    const boxX = (197 / 967) * canvas.width;
                    const boxY = (274 / 1202) * canvas.height;
                    const boxW = (583 / 967) * canvas.width;
                    const boxH = (568 / 1202) * canvas.height;
                    const hRatio = boxW / userImage.width;
                    const vRatio = boxH / userImage.height;
                    const ratio = Math.max(hRatio, vRatio);
                    const renderW = userImage.width * ratio;
                    const renderH = userImage.height * ratio;
                    const renderX = boxX + (boxW - renderW) / 2;
                    const renderY = boxY + (boxH - renderH) / 2;
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(boxX, boxY, boxW, boxH);
                    ctx.clip(); // Ensure image doesn't bleed out of placeholder
                    ctx.drawImage(userImage, 0, 0, userImage.width, userImage.height,
                        renderX, renderY, renderW, renderH);
                    ctx.restore();
                }
                // Name Layer
                const nameText = nameInput.value.trim();
                if (nameText) {
                    ctx.font = 'bold 85px "Inter", "Segoe UI", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                    ctx.shadowBlur = 20;
                    ctx.shadowOffsetX = 4;
                    ctx.shadowOffsetY = 4;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(nameText, canvas.width / 2, canvas.height - 180);
                    ctx.shadowColor = 'transparent';
                }
            }
            renderCanvas(); // Initial render
            // Observers
            frameImage.onload = () => {
                if (frameImage.width && frameImage.height) {
                    canvas.width = frameImage.width;
                    canvas.height = frameImage.height;
                }
                renderCanvas();
            };
            frameImage.onerror = () => renderCanvas();
            nameInput.addEventListener('input', () => renderCanvas());
            uploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        userImage.onload = () => renderCanvas();
                        userImage.src = event.target.result;
                    }
                    reader.readAsDataURL(file);
                }
            });
            downloadBtn.addEventListener('click', () => {
                try {
                    const dataUrl = canvas.toDataURL('image/png', 1.0);
                    const link = document.createElement('a');
                    link.download = `CODE_Nakshatra_${nameInput.value.trim() || 'Hero'}.png`;
                    link.href = dataUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (err) {
                    alert('Could not download image. It might be due to CORS policy on the frame image URL. Trying to open in a new tab...');
                    console.error(err);
                }
            });
        });
    


        document.addEventListener("DOMContentLoaded", () => {
            const trailContainer = document.createElement("div");
            trailContainer.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
            document.body.appendChild(trailContainer);
            let lastX = 0; let lastY = 0;
            document.addEventListener("mousemove", (e) => {
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) return;
                lastX = e.clientX; lastY = e.clientY;
                const dot = document.createElement("div");
                const colors = ["#a855f7", "#06b6d4", "#c084fc", "#22d3ee", "#ffffff"];
                const rc = colors[Math.floor(Math.random() * colors.length)];
                Object.assign(dot.style, { position: "absolute", left: e.clientX + "px", top: e.clientY + "px", width: "6px", height: "6px", backgroundColor: rc, borderRadius: "50%", boxShadow: "0 0 10px " + rc, pointerEvents: "none", transform: "translate(-50%, -50%)" });
                trailContainer.appendChild(dot);
                if (typeof gsap !== "undefined") gsap.to(dot, { scale: 0, opacity: 0, duration: 0.6, onComplete: () => dot.remove() });
            });
        });
    


        window.addEventListener('scroll', () => {
            const rocket = document.getElementById('rocketTop');
            if (window.scrollY > 400) {
                rocket.classList.add('is-visible');
            } else {
                rocket.classList.remove('is-visible');
            }
        });
    


        (function () {
            // All text snippets drawn from the webpage content
            const snippets = [
                { label: 'Event', text: '<em>CODE नक्षत्र II</em><br>Hybrid Technical Hackathon' },
                { label: 'Tagline', text: '<em>Stars shaped by Rangers</em>' },
                { label: 'Host', text: 'Trinity Institute of<br>Innovation & Professional Studies<br><em>Greater Noida</em>' },
                { label: 'Prize Pool', text: '<em>₹1,00,000+</em><br>Total Prize Pool' },
                { label: '1st Place', text: '<em>₹50,000</em><br>Gold Prize' },
                { label: '2nd Place', text: '<em>₹25,000</em><br>Silver Prize' },
                { label: '3rd Place', text: '<em>₹15,000</em><br>Bronze Prize' },
                { label: 'Format', text: 'Round 1 – <em>Online</em><br>Round 2 – <em>Offline</em>' },
                { label: 'Tracks', text: 'AI / ML · Web3<br>FinTech · SustainTech<br><em>Open Innovation</em>' },
                { label: 'Register', text: 'namespace.world<br><em>Open Registrations</em>' },
                { label: 'Community', text: 'Organized by<br><em>TIIPS Rangers</em><br>Coding Community' },
                { label: 'Perks', text: 'Goodies · Swags<br>Cash Prizes · Mentorship<br><em>Networking</em>' },
                { label: 'Mission', text: 'Empowering coders<br>to build the<br><em>next big thing</em>' },
                { label: 'Edition', text: '<em>Season II</em><br>CODE नक्षत्र 2.0' },
                { label: 'Contact', text: 'See you in<br><em>2026</em>' },
            ];
            // Shuffle and pick 6 unique snippets
            function shuffle(arr) {
                const a = arr.slice();
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }
            const picked = shuffle(snippets).slice(0, 6);
            picked.forEach((s, i) => {
                const labelEl = document.querySelector('#pl-box-' + i + ' .pl-info-label');
                const valEl = document.getElementById('pl-box-' + i + '-val');
                if (labelEl) labelEl.textContent = s.label; // ::before is CSS, not a DOM node
                if (valEl) valEl.innerHTML = s.text;
            });
            // Expose globally so the animation engine can trigger it
            window.showInfoBoxes = function () {
                const W = window.innerWidth, H = window.innerHeight;
                const BOX_W = 230, BOX_H = 110;
                // Define 8 candidate zones (avoid centre where loading text lives)
                // Each zone: { left, top } as pixel values with some jitter
                const zones = [
                    { l: 0.02, t: 0.06 }, // top-left
                    { l: 0.75, t: 0.06 }, // top-right
                    { l: 0.02, t: 0.42 }, // mid-left
                    { l: 0.75, t: 0.42 }, // mid-right
                    { l: 0.02, t: 0.75 }, // bottom-left
                    { l: 0.75, t: 0.75 }, // bottom-right
                    { l: 0.32, t: 0.06 }, // top-centre-left
                    { l: 0.55, t: 0.06 }, // top-centre-right
                ];
                // Shuffle zones and pick 6
                const zShuffled = shuffle(zones.slice());
                const picked6Zones = zShuffled.slice(0, 6);
                const boxes = document.querySelectorAll('.pl-info-box');
                boxes.forEach((box, i) => {
                    const z = picked6Zones[i];
                    // Add slight random jitter so they are never exactly the same
                    const jitterX = (Math.random() - 0.5) * 0.04;
                    const jitterY = (Math.random() - 0.5) * 0.04;
                    const left = Math.max(0.01, Math.min(0.88, z.l + jitterX));
                    const top = Math.max(0.04, Math.min(0.85, z.t + jitterY));
                    box.style.left = (left * 100).toFixed(1) + '%';
                    box.style.top = (top * 100).toFixed(1) + '%';
                    box.style.right = '';
                    box.style.bottom = '';
                    // Stagger fade-in — all 6 within ~900ms (≤ 1 second)
                    setTimeout(() => { box.classList.add('visible'); }, i * 150);
                });
            };
            // Smoothly hide all boxes (called just before warp starts)
            window.hideInfoBoxes = function () {
                const boxes = document.querySelectorAll('.pl-info-box');
                boxes.forEach((box) => {
                    box.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
                    box.style.opacity = '0';
                    box.style.transform = 'translateY(-8px)';
                });
            };
        })();
    


        (function () {
            const canvas = document.getElementById('bgCanvas');
            // Canvas Intersection Observer for Performance
            let canvasIsVisible = true;
            const canvasObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    canvasIsVisible = entry.isIntersecting;
                });
            }, { threshold: 0 });
            
            const homeSection = document.getElementById('home');
            if (homeSection) canvasObserver.observe(homeSection);

            const ctx = canvas.getContext('2d');
            const overlay = document.getElementById('preloader-overlay');
            const plLoading = document.getElementById('pl-loading');
            const plEntering = document.getElementById('pl-entering');
            if (sessionStorage.getItem('visited_preloader')) {
                if (overlay) overlay.style.display = 'none';
                if (plLoading) plLoading.style.display = 'none';
                if (plEntering) plEntering.style.display = 'none';
                let plSkip = document.getElementById('pl-skip');
                if (plSkip) plSkip.style.display = 'none';
                
                // Immediately set to deep_space phase so it doesn't draw the constellation animation
                phase = 'deep_space';
                siteRevealed = true;
                
                // Wait briefly for canvas to be sized correctly
                setTimeout(() => {
                    initDeepSpace();
                    canvas.classList.add('color-active');
                    canvas.style.zIndex = '0';
                    initScrollFade();
                }, 100);
            } else {
                sessionStorage.setItem('visited_preloader', 'true');
            }
            let stars = [], connections = [], bgStars = [], meteors = [];
            const NUM_CONST = 50, MAX_CONN_DIST = 150, BRIGHT_THRESH = 280, MIN_STAR_DIST = 15, MAX_STEPS = 6;
            let currentStep = 0, stepProg = 0, maxStep = 0;
            let phase = 'drawing', warpMult = 1, warpRot = 0, siteRevealed = false;
            function setupCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                computePolar();
            }
            window.addEventListener('resize', () => {
                if (phase !== 'deep_space') setupCanvas();
                else { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
            });
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = 'image.png';
            img.onload = () => { extractStars(); setupCanvas(); buildConstellations(); startLoop(); };
            img.onerror = () => { randomStars(); setupCanvas(); buildConstellations(); startLoop(); };
            function startLoop() {
                // Fade out "CALIBRATING TELESCOPES..." briefly into the drawing
                setTimeout(() => {
                    plLoading.style.transition = 'opacity 0.3s ease-out';
                    plLoading.style.opacity = '0';
                    setTimeout(() => { plLoading.style.display = 'none'; }, 300);
                }, 1000);
                requestAnimationFrame(loop);
            }
            function extractStars() {
                stars = [];
                const off = document.createElement('canvas');
                off.width = img.naturalWidth || innerWidth; off.height = img.naturalHeight || innerHeight;
                const oc = off.getContext('2d', { willReadFrequently: true });
                try {
                    oc.drawImage(img, 0, 0);
                    const d = oc.getImageData(0, 0, off.width, off.height).data;
                    for (let y = 0; y < off.height; y += 5) for (let x = 0; x < off.width; x += 5) {
                        const i = (y * off.width + x) * 4;
                        if ((d[i] + d[i + 1] + d[i + 2]) / 3 > BRIGHT_THRESH) {
                            let ok = true;
                            for (const s of stars) if (Math.hypot(s.nx * off.width - x, s.ny * off.height - y) < MIN_STAR_DIST) { ok = false; break; }
                            if (ok) stars.push({ nx: x / off.width, ny: y / off.height, size: Math.random() * 1.5 + 0.5 });
                        }
                    }
                } catch (e) { }
                for (let i = 0; i < 1200; i++) stars.push({ nx: Math.random(), ny: Math.random(), size: Math.random() * 1.2 + 0.3 });
                if (stars.length < 50) randomStars();
            }
            function randomStars() {
                stars = [];
                for (let i = 0; i < 2000; i++) stars.push({ nx: Math.random(), ny: Math.random(), size: Math.random() * 1.5 + 0.5 });
            }
            function computePolar() {
                const cx = canvas.width * 0.6, cy = canvas.height * 0.5;
                stars.forEach(s => {
                    const sx = s.nx * canvas.width, sy = s.ny * canvas.height;
                    s.radius = Math.hypot(sx - cx, sy - cy);
                    s.baseAngle = Math.atan2(sy - cy, sx - cx);
                    if (!s.trailColor) {
                        const h = canvas.height * 0.55;
                        if (sy > h) {
                            const dep = Math.min(1, (sy - h) / (canvas.height - h));
                            const hue = dep < 0.5 ? 260 + dep * 140 : 330 + (dep - 0.5) * 100;
                            s.trailColor = `hsla(${hue % 360},85%,${55 + Math.random() * 25}%,0.55)`;
                        } else {
                            let hue = 210, sat = 80, light = 70; const r = Math.random();
                            if (r > 0.8) { hue = 40; sat = 40; light = 80; } else if (r > 0.5) { hue = 220; sat = 100; light = 90; } else if (r > 0.3) { sat = 0; light = 100; }
                            s.trailColor = `hsla(${hue},${sat}%,${light}%,0.45)`;
                        }
                    }
                });
            }
            function buildConstellations() {
                connections = [];
                let unvisited = new Set(stars.map((_, i) => i)), tips = [];
                for (let i = 0; i < NUM_CONST; i++) {
                    if (!unvisited.size) break;
                    const arr = Array.from(unvisited), idx = arr[Math.floor(Math.random() * arr.length)];
                    unvisited.delete(idx); tips.push(idx);
                }
                let step = 0;
                while (unvisited.size && tips.length && step < MAX_STEPS) {
                    const next = [];
                    for (const ci of tips) {
                        if (!unvisited.size) break;
                        const cs = stars[ci]; let ni = -1, md = Infinity;
                        for (const ui of unvisited) {
                            const ts = stars[ui], dist = Math.hypot((ts.nx - cs.nx) * innerWidth, (ts.ny - cs.ny) * innerHeight);
                            if (dist < md && dist < MAX_CONN_DIST) { md = dist; ni = ui; }
                        }
                        if (ni !== -1) { unvisited.delete(ni); connections.push({ from: ci, to: ni, step }); next.push(ni); }
                    }
                    tips = next; step++;
                }
                maxStep = step - 1;
            }
            function initDeepSpace() {
                bgStars = [];
                for (let i = 0; i < 450; i++) {
                    const r = Math.random();
                    bgStars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 1.6 + 0.2, speed: Math.random() * 0.25 + 0.04, brightness: Math.random() * 0.7 + 0.25, color: r > 0.9 ? '#00f3ff' : r > 0.8 ? '#b026ff' : r > 0.7 ? '#a855f7' : '#ffffff' });
                }
            }
            function revealPage() {
                canvas.classList.add('color-active');
                document.body.style.cursor = 'auto';
                // Immediately start overlay fade-out and hide elements
                plLoading.style.display = 'none';
                if (plEntering) plEntering.style.display = 'none';
                overlay.classList.add('hidden');
                // Clean up state
                setTimeout(() => {
                    canvas.style.zIndex = '0';
                    initScrollFade();
                }, 2100);
            }
            window.skipPreloader = function () {
                phase = 'deep_space'; initDeepSpace();
                canvas.classList.add('color-active');
                overlay.classList.add('hidden');
                document.body.style.cursor = 'auto';
                siteRevealed = true;
                // Drop canvas after overlay fade completes
                setTimeout(() => { canvas.style.zIndex = '0'; initScrollFade(); }, 2100);
            };
            // Fade canvas in/out based on scroll position relative to hero section
            function initScrollFade() {
                const heroHeight = window.innerHeight; // first viewport = hero
                function onScroll() {
                    const scrollY = window.scrollY;
                    // Start fading at 20% into the hero, fully hidden at 80%
                    const fadeStart = heroHeight * 0.2;
                    const fadeEnd = heroHeight * 0.8;
                    if (scrollY <= fadeStart) {
                        canvas.classList.remove('scroll-hidden');
                        canvas.style.opacity = '';
                    } else if (scrollY >= fadeEnd) {
                        canvas.classList.add('scroll-hidden');
                    } else {
                        canvas.classList.remove('scroll-hidden');
                        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
                        canvas.style.opacity = String(1 - progress);
                    }
                }
                window.addEventListener('scroll', onScroll, { passive: true });
                onScroll(); // run once in case page is already scrolled
            }
            function loop() {
                if (!canvasIsVisible && phase === 'deep_space') {
                    requestAnimationFrame(loop);
                    return;
                }
                const cx = canvas.width * 0.6, cy = canvas.height * 0.5;
                if (phase === 'drawing' || phase === 'waiting') {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    const pos = stars.map(s => ({ x: cx + s.radius * Math.cos(s.baseAngle), y: cy + s.radius * Math.sin(s.baseAngle), size: s.size }));
                    ctx.fillStyle = 'rgba(255,255,255,0.2)';
                    pos.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); });
                    ctx.lineCap = 'round'; ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(255,255,255,0.8)';
                    connections.forEach(c => {
                        const p1 = pos[c.from], p2 = pos[c.to];
                        if (phase === 'waiting' || c.step < currentStep) {
                            ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1.2;
                            ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                            ctx.beginPath(); ctx.fillStyle = 'rgba(255,255,255,0.9)';
                            ctx.arc(p1.x, p1.y, p1.size + 0.5, 0, Math.PI * 2); ctx.arc(p2.x, p2.y, p2.size + 0.5, 0, Math.PI * 2); ctx.fill();
                        } else if (phase === 'drawing' && c.step === currentStep) {
                            const ex = p1.x + (p2.x - p1.x) * stepProg, ey = p1.y + (p2.y - p1.y) * stepProg;
                            ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1.5;
                            ctx.moveTo(p1.x, p1.y); ctx.lineTo(ex, ey); ctx.stroke();
                            ctx.beginPath(); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.arc(p1.x, p1.y, p1.size + 0.5, 0, Math.PI * 2); ctx.fill();
                            ctx.beginPath(); ctx.fillStyle = 'rgba(255,255,255,1)'; ctx.arc(ex, ey, 1.5, 0, Math.PI * 2); ctx.fill();
                        }
                    });
                    if (phase === 'drawing') {
                        stepProg += 0.12; // super-fast draw
                        if (stepProg >= 1) { stepProg = 0; currentStep++; }
                        if (currentStep > maxStep) {
                            phase = 'waiting';
                            // Timeline after constellations finish:
                            // t+0s  → boxes appear immediately (stagger within ~900ms)
                            // t+2s  → boxes fade out smoothly (0.5s)
                            // t+2.5s→ hyperspace warp begins
                            if (typeof window.showInfoBoxes === 'function') window.showInfoBoxes();
                            setTimeout(() => {
                                if (typeof window.hideInfoBoxes === 'function') window.hideInfoBoxes();
                            }, 1200);
                            setTimeout(() => {
                                phase = 'hyperspace'; warpMult = 0.05; warpRot = 0;
                                stars.forEach(s => { s.warpDist = 0; s.warpVel = Math.random() * 4 + 2; });
                            }, 1500);
                        }
                    }
                } else if (phase === 'hyperspace') {
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = '#00040a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
                    warpMult *= 1.22; warpRot += 0.015 * warpMult;
                    let onScreen = 0; ctx.lineCap = 'round';
                    stars.forEach(s => {
                        s.warpDist += s.warpVel * warpMult;
                        const ang = s.baseAngle + warpRot, rad = s.radius + s.warpDist;
                        const ox = cx + Math.cos(ang) * rad, oy = cy + Math.sin(ang) * rad;
                        const tRad = Math.max(0, rad - s.warpVel * warpMult * 2.5), tAng = ang - 0.015 * warpMult;
                        const tx = cx + Math.cos(tAng) * tRad, ty = cy + Math.sin(tAng) * tRad;
                        if (ox > -200 && ox < canvas.width + 200 && oy > -200 && oy < canvas.height + 200) {
                            onScreen++;
                            ctx.beginPath(); ctx.strokeStyle = s.trailColor || '#fff'; ctx.lineWidth = s.size * 1.5;
                            ctx.moveTo(tx, ty); ctx.lineTo(ox, oy); ctx.stroke();
                        }
                    });
                    if (onScreen === 0 && warpMult > 10) {
                        phase = 'deep_space'; initDeepSpace();
                        if (!siteRevealed) { siteRevealed = true; revealPage(); }
                    }
                } else if (phase === 'deep_space') {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    bgStars.forEach(s => {
                        s.y -= s.speed; s.x -= s.speed * 0.18;
                        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; } if (s.x < 0) s.x = canvas.width;
                        ctx.globalAlpha = s.brightness; ctx.fillStyle = s.color;
                        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
                    });
                    ctx.globalAlpha = 1;
                    if (Math.random() < 0.018) meteors.push({ x: Math.random() * canvas.width * 1.2, y: -50, length: Math.random() * 110 + 50, speed: Math.random() * 11 + 9, thickness: Math.random() * 2 + 0.8, angle: Math.PI / 4 + (Math.random() * 0.12 - 0.06), colorRGB: Math.random() > 0.6 ? '255,255,255' : Math.random() > 0.5 ? '0,243,255' : '168,85,247' });
                    for (let i = meteors.length - 1; i >= 0; i--) {
                        const m = meteors[i]; m.x -= Math.cos(m.angle) * m.speed; m.y += Math.sin(m.angle) * m.speed;
                        const g = ctx.createLinearGradient(m.x, m.y, m.x + Math.cos(m.angle) * m.length, m.y - Math.sin(m.angle) * m.length);
                        g.addColorStop(0, `rgba(${m.colorRGB},1)`); g.addColorStop(1, `rgba(${m.colorRGB},0)`);
                        ctx.beginPath(); ctx.strokeStyle = g; ctx.lineWidth = m.thickness; ctx.lineCap = 'round';
                        ctx.moveTo(m.x, m.y); ctx.lineTo(m.x + Math.cos(m.angle) * m.length, m.y - Math.sin(m.angle) * m.length); ctx.stroke();
                        if (m.y > canvas.height + 200 || m.x < -200) meteors.splice(i, 1);
                    }
                }
                requestAnimationFrame(loop);
            }
            window.addEventListener('mousemove', e => {
                document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
                document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
            });
        })();
    


        document.addEventListener("DOMContentLoaded", () => {
            // Scroll Progress
            const progressBar = document.getElementById('neon-scroll-progress');
            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                progressBar.style.width = scrollPercent + '%';
            });

            // Custom Cursor Logic
            const cursorDot = document.getElementById('custom-cursor-dot');
            const cursorHalo = document.getElementById('custom-cursor-halo');
            
            // Only apply custom cursor on fine pointers (desktops/laptops)
            if (window.matchMedia("(pointer: fine)").matches) {
                document.documentElement.style.cursor = 'none';
                
                let mouseX = window.innerWidth / 2;
                let mouseY = window.innerHeight / 2;
                let haloX = mouseX;
                let haloY = mouseY;
    
                window.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    cursorDot.style.left = mouseX + 'px';
                    cursorDot.style.top = mouseY + 'px';
                });
    
                function animateHalo() {
                    haloX += (mouseX - haloX) * 0.25;
                    haloY += (mouseY - haloY) * 0.25;
                    cursorHalo.style.left = haloX + 'px';
                    cursorHalo.style.top = haloY + 'px';
                    requestAnimationFrame(animateHalo);
                }
                animateHalo();
    
                // Interactive hover states
                const interactiveNodes = document.querySelectorAll('a, button, .track-card, .prize-card');
                interactiveNodes.forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        cursorHalo.style.width = '55px';
                        cursorHalo.style.height = '55px';
                        cursorHalo.style.background = 'rgba(168, 85, 247, 0.4)';
                        cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
                    });
                    el.addEventListener('mouseleave', () => {
                        cursorHalo.style.width = '32px';
                        cursorHalo.style.height = '32px';
                        cursorHalo.style.background = 'rgba(168, 85, 247, 0.1)';
                        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                    });
                });
            } else {
                // Not a fine pointer (mobile)
                cursorDot.style.display = 'none';
                cursorHalo.style.display = 'none';
                progressBar.style.display = 'none'; // Optional: remove scroll progress on mobile if cluttered
            }
        });
    



document.addEventListener('DOMContentLoaded', () => {
            const initGallery = () => {
                const decks = document.querySelectorAll('.card-deck');
                const track = document.querySelector('.gallery-track');
                const instruction = document.getElementById('deck-instruction');
                if (decks.length === 0 || !track) return;
                let activeDeck = null;
                const getCenterOffset = (deck) => {
                    const trackRect = track.getBoundingClientRect();
                    const deckRect = deck.getBoundingClientRect();
                    const trackCenter = trackRect.left + trackRect.width / 2;
                    const deckCenter = deckRect.left + deckRect.width / 2;
                    return trackCenter - deckCenter;
                };
                const resetGallery = () => {
                    if (!activeDeck) return;
                    const cards = activeDeck.querySelectorAll('.memory-card');
                    // 1. Close fan FIRST
                    gsap.to(cards, {
                        x: 0,
                        y: 0,
                        rotate: (i) => [-10, -5, 0, 5, 10][i] || 0,
                        scale: 1,
                        duration: 0.5,
                        ease: "power2.inOut",
                        overwrite: true,
                        onComplete: () => {
                            // 2. Move deck back AFTER fan is closed
                            if (activeDeck) {
                                gsap.to(activeDeck, {
                                    x: 0,
                                    y: 0,
                                    scale: activeDeck.classList.contains('scale-110') ? 1.1 : 1,
                                    duration: 0.6,
                                    ease: "expo.out",
                                    overwrite: true,
                                    onComplete: () => {
                                        if (activeDeck) {
                                            activeDeck.style.zIndex = '100';
                                            activeDeck.dataset.state = 'idle';
                                            activeDeck = null;
                                        }
                                    }
                                });
                            }
                        }
                    });
                    // Show others simultaneously as the deck moves back? 
                    // Actually, let's show them as the deck arrives back.
                    decks.forEach(d => {
                        if (activeDeck && d !== activeDeck) {
                            gsap.to(d, {
                                opacity: 1,
                                scale: d.classList.contains('scale-110') ? 1.1 : 1,
                                pointerEvents: 'auto',
                                duration: 0.6,
                                delay: 0.4, // Slight delay so they reappear as active deck moves back
                                overwrite: true
                            });
                        }
                    });
                    if (instruction) gsap.to(instruction, { opacity: 1, duration: 0.3, delay: 0.5 });
                };
                const handleDeckClick = (deck, e) => {
                    e.stopPropagation();
                    const state = deck.dataset.state || 'idle';
                    if (state === 'idle') {
                        // STEP 1: Select and Move to Middle
                        if (activeDeck && activeDeck !== deck) resetGallery();
                        activeDeck = deck;
                        deck.dataset.state = 'centered';
                        deck.style.zIndex = '1000';
                        const xOffset = getCenterOffset(deck);
                        if (instruction) gsap.to(instruction, { opacity: 0, duration: 0.3 });
                        gsap.to(deck, {
                            x: xOffset,
                            scale: 1.2,
                            duration: 0.8,
                            ease: "expo.out",
                            overwrite: true
                        });
                        decks.forEach(d => {
                            if (d !== deck) {
                                gsap.to(d, { opacity: 0, scale: 0.5, pointerEvents: 'none', duration: 0.6, ease: "power2.inOut", overwrite: true });
                            }
                        });
                    } else if (state === 'centered') {
                        // STEP 2: Fan Out
                        deck.dataset.state = 'spread';
                        const cards = deck.querySelectorAll('.memory-card');
                        const isMobile = window.innerWidth < 768;
                        if (isMobile) {
                            gsap.to(cards[0], { y: -120, x: 0, rotate: -10, scale: 0.85, duration: 0.6, ease: "back.out(1.7)" });
                            gsap.to(cards[1], { y: -60, x: 0, rotate: -5, scale: 0.92, duration: 0.6, ease: "back.out(1.7)" });
                            gsap.to(cards[2], { y: 0, x: 0, rotate: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" });
                            gsap.to(cards[3], { y: 60, x: 0, rotate: 5, scale: 0.92, duration: 0.6, ease: "back.out(1.7)" });
                            gsap.to(cards[4], { y: 120, x: 0, rotate: 10, scale: 0.85, duration: 0.6, ease: "back.out(1.7)" });
                        } else {
                            gsap.to(cards[0], { x: -350, y: 40, rotate: -18, duration: 0.7, ease: "back.out(1.7)" });
                            gsap.to(cards[1], { x: -175, y: 10, rotate: -9, duration: 0.7, ease: "back.out(1.7)" });
                            gsap.to(cards[2], { x: 0, y: -20, rotate: 0, scale: 1.1, duration: 0.7, ease: "back.out(1.7)" });
                            gsap.to(cards[3], { x: 175, y: 10, rotate: 9, duration: 0.7, ease: "back.out(1.7)" });
                            gsap.to(cards[4], { x: 350, y: 40, rotate: 18, duration: 0.7, ease: "back.out(1.7)" });
                        }
                        cards.forEach((card, i) => {
                            card.addEventListener('mouseenter', () => {
                                if (deck.dataset.state !== 'spread') return;
                                gsap.to(card, { scale: 1.25, y: (i === 2 ? (isMobile ? -30 : -50) : (isMobile ? [-150, -90, 0, 90, 150][i] : [10, -20, -50, -20, 10][i])), zIndex: 2000, boxShadow: "0 30px 60px -12px rgba(168, 85, 247, 0.7)", duration: 0.3 });
                            });
                            card.addEventListener('mouseleave', () => {
                                if (deck.dataset.state !== 'spread') return;
                                gsap.to(card, { scale: i === 2 ? 1.1 : 1, y: (isMobile ? [-120, -60, 0, 60, 120][i] : [40, 10, -20, 10, 40][i]), zIndex: 1000 + i, boxShadow: "none", duration: 0.3 });
                            });
                        });
                    } else {
                        // STEP 3: Close
                        resetGallery();
                    }
                };
                decks.forEach(deck => {
                    deck.dataset.state = 'idle';
                    deck.addEventListener('click', (e) => handleDeckClick(deck, e));
                });
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.card-deck')) {
                        resetGallery();
                    }
                });
            };
            const observer = new MutationObserver(() => {
                const whyUsSection = document.getElementById('why-us');
                const gallery = document.getElementById('gallery');
                if (whyUsSection && gallery) {
                    if (gallery.nextElementSibling !== whyUsSection) {
                        whyUsSection.parentNode.insertBefore(gallery, whyUsSection);
                        observer.disconnect();
                        initGallery();
                    } else {
                        observer.disconnect();
                        initGallery();
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });

document.addEventListener('DOMContentLoaded', () => {
                    const btn = document.getElementById('mobile-menu-btn');
                    const dropdown = document.getElementById('mobile-dropdown');
                    if (btn && dropdown) {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const isHidden = dropdown.classList.contains('opacity-0');
                            if (isHidden) {
                                dropdown.classList.remove('opacity-0', 'invisible', 'translate-y-[-10px]');
                                dropdown.classList.add('opacity-100', 'visible', 'translate-y-0');
                            } else {
                                dropdown.classList.remove('opacity-100', 'visible', 'translate-y-0');
                                dropdown.classList.add('opacity-0', 'invisible', 'translate-y-[-10px]');
                            }
                        });
                        document.addEventListener('click', (e) => {
                            if (!dropdown.contains(e.target)) {
                                dropdown.classList.remove('opacity-100', 'visible', 'translate-y-0');
                                dropdown.classList.add('opacity-0', 'invisible', 'translate-y-[-10px]');
                            }
                        });
                        dropdown.querySelectorAll('a').forEach(link => {
                            link.addEventListener('click', () => {
                                dropdown.classList.remove('opacity-100', 'visible', 'translate-y-0');
                                dropdown.classList.add('opacity-0', 'invisible', 'translate-y-[-10px]');
                            });
                        });
                    }
                });

document.addEventListener('DOMContentLoaded', () => {
                                                    const teamMembers = [
                                { name: "Mani Raj Goel", role: "Design lead", img: "https://ik.imagekit.io/logicsync/mani.jpg", linkedin: "https://www.linkedin.com/in/mani-goel-8709b6327" },
                                { name: "Saksham Chauhan", role: "Event Management Lead", img: "https://ik.imagekit.io/logicsync/WhatsApp%20Image%202025-10-26%20at%2011.24.40_08c42c1f.jpg?updatedAt=1761471293990", linkedin: "https://www.linkedin.com/in/saksham-chauhan-b18bb5277/" },
                                { name: "Samiran", role: "Technical Lead", img: "https://ik.imagekit.io/logicsync/stage%20.jpg?updatedAt=1759674099852", linkedin: "https://www.linkedin.com/in/samiran-das-33531123b/" },
                                { name: "Kota Varshini", role: "Event Management Lead", img: "https://ik.imagekit.io/logicsync/WhatsApp%20Image%202025-10-26%20at%2010.57.33_2a95ecda.jpg?updatedAt=1761471290203", linkedin: "https://www.linkedin.com/in/varshini-kota-85a8082b0?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
                                { name: "Divina Khattar", role: "Design Lead", img: "https://ik.imagekit.io/logicsync/WhatsApp%20Image%202025-10-26%20at%2014.37.46_d5614e39.jpg?updatedAt=1761471296353", linkedin: "https://www.linkedin.com/in/divina-khattar-555939360?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
                                { name: "Harshita Yadav", role: "Design Co-Lead", img: "https://ik.imagekit.io/logicsync/HARSHITA.jpg?updatedAt=1774634615639", linkedin: "#" },
                                { name: "Akshara Pathak", role: "Design Co-Lead", img: "https://ik.imagekit.io/logicsync/Akshara%20(1).jpg?updatedAt=1774635857536", linkedin: "#" },
                                { name: "Aashish Dagar", role: "Technical", img: "https://ik.imagekit.io/logicsync/aashish.jpg?updatedAt=1774458630953", linkedin: "https://www.linkedin.com/in/aashish-dagar-aaba451b3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
                                { name: "Anushka", role: "Management", img: "https://ik.imagekit.io/logicsync/Anushka.jpg?updatedAt=1774635858415", linkedin: "#" },
                                { name: "Srishti", role: "Technical", img: "https://ik.imagekit.io/logicsync/Shrishti%20.webp?updatedAt=1774634616965", linkedin: "#" },
                                { name: "Kalpana", role: "Management", img: "https://ik.imagekit.io/logicsync/kalpana.jpg?updatedAt=1774635855882", linkedin: "#" },
                                { name: "Krish", role: "Event Management", img: "https://ik.imagekit.io/logicsync/Krish.jpg", linkedin: "#" }
                            ];
                            teamMembers.forEach(m => {
                                document.getElementById("dynamic-team-container").insertAdjacentHTML("beforeend", `
                   <div class="org-bubble-wrapper">
                     <div class="org-bubble-frame org-bubble-small">
                       <div class="org-bubble-img">
                         <img loading="lazy" src="${m.img}" alt="${m.name}" onerror="this.src='https://ik.imagekit.io/logicsync/default-avatar.png'; this.onerror=null;">
                       </div>
                     </div>
                     <div class="org-bubble-name org-bubble-small-name h3-div-style">${m.name}</div>
                     <p class="org-bubble-role org-bubble-small-role">${m.role}</p>
                     <div class="org-bubble-socials">
                       <a href="${m.linkedin}" class="org-social-btn" target="_blank"><i class="fab fa-linkedin"></i></a>
                     </div>
                   </div>
                 `);
                            });
});
