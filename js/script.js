
// --- 1. DATA & CONFIG ---
window.MALL_DATA = window.MALL_DATA || {};
window.MALL_DATA.config = window.MALL_DATA.config || {};
window.MALL_DATA.products = window.MALL_DATA.products || [];

const siteConfig = window.MALL_DATA.config;
const products = window.MALL_DATA.products;
const isInHtmlDir = window.location.pathname.includes('/html/');

// Category Mapping with Icons
const CATEGORY_MAP = {
    'elec': '⚡ 数码电器', 
    'fashion': '👗 时尚服饰', 
    'food': '🍔 美食特产',
    'home': '🏠 家居生活', 
    'books': '📚 图书音像',
    'toys': '🧸 玩具乐器', 
    'sports': '⚽ 运动户外', 
    'auto': '🚘 汽车用品',
    'beauty': '💄 美妆护肤'
};

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        updateCartCount();
        initDropdowns(); // Populate all dropdowns dynamically
        initGlobalMusic(); // Start Global Music Player
        
        const pageEl = document.querySelector('div[id$="-page"]');
        if (pageEl) {
            console.log("Initializing page:", pageEl.id); // Debug log
            renderPage(pageEl.id);
        } else {
            console.warn("No page ID found.");
        }
        
        // Initialize Categories Sidebar (Common) - Fixed Alignment
        const sidebar = document.getElementById('home-sidebar-list') || document.getElementById('list-sidebar-list');
        if (sidebar) {
            sidebar.innerHTML = Object.entries(CATEGORY_MAP).map(([k, v]) => {
                // Split icon and text to ensure alignment
                const parts = v.split(' '); 
                const icon = parts[0];
                const text = parts.slice(1).join(' ');
                
                return `<li>
                    <a href="list.html?cat=${k}">
                        <div style="display:flex; align-items:center;">
                            <span class="sidebar-icon-fixed">${icon}</span>
                            <span>${text}</span>
                        </div>
                        <span style="font-family:Arial;">&gt;</span>
                    </a>
                </li>`;
            }).join('');
        }

        // Initialize Marquee (Common)
        const marqueeEl = document.getElementById('marquee-container');
        if (marqueeEl && siteConfig.marquee) {
            marqueeEl.innerHTML = `<div class="marquee-content">${siteConfig.marquee}</div>`;
        }

    } catch(e) { console.error("Init Error", e); }
});

// Helper to populate dropdowns
function initDropdowns() {
    // 1. Header Right Dropdown (with Icons)
    const headerMenu = document.querySelector('.header-cat-dropdown .cat-menu');
    if (headerMenu) {
        headerMenu.innerHTML = Object.entries(CATEGORY_MAP).map(([k, v]) => {
            return `<a href="list.html?cat=${k}">${v}</a>`;
        }).join('');
    }

    // 2. Nav Bar Dropdown (Text Only usually for Nav, keeping it consistent)
    const navMenu = document.querySelector('.nav-dropdown');
    if (navMenu) {
        navMenu.innerHTML = Object.entries(CATEGORY_MAP).map(([k, v]) => {
            // If you want text only: const text = v.split(' ')[1] || v;
            // But maintaining icon for consistency:
            const text = v.split(' ')[1] || v;
            return `<a href="list.html?cat=${k}">${text}</a>`;
        }).join('');
    }
}


// --- 3. PAGE RENDERER ---
function renderPage(pageId) {
    switch (pageId) {
        case 'home-page': initHome(); break;
        case 'list-page': initList(); break;
        case 'detail-page': initDetail(); break;
        case 'cart-page': initCart(); break;
        case 'about-page': initAbout(); break;
        case 'contact-page': initContact(); break;
        case 'admin-page': initAdmin(); break; // Admin Panel Logic
    }
}

// --- 4. CORE FUNCTIONS ---

// Path Resolver
function resolvePath(url) {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    if (url.startsWith('http')) return url;
    if (isInHtmlDir && !url.startsWith('../')) {
        return '../' + url;
    }
    return url;
}

// Helper to generate the fallback code for images
function getImgFallback(text, cat='elec', w=400, h=400) {
    const safeText = (text || '商品').replace(/'/g, "");
    return `this.onerror=null;this.src=drawProductImage('${safeText}','${cat}',${w},${h});`;
}

// Global Music Player Logic
function initGlobalMusic() {
    if (!siteConfig.bgMusic) return;

    // Create Widget DOM
    const div = document.createElement('div');
    div.className = 'music-widget';
    div.innerHTML = `
        <div class="music-icon paused" id="music-icon" title="点击播放/暂停">🎵</div>
        <div class="music-controls">
            <span class="music-title">背景音乐</span>
            <button class="music-btn" id="music-toggle" title="播放/暂停">▶</button>
        </div>
        <audio id="global-audio" src="${resolvePath(siteConfig.bgMusic)}" loop></audio>
    `;
    document.body.appendChild(div);

    const audio = document.getElementById('global-audio');
    const btn = document.getElementById('music-toggle');
    const icon = document.getElementById('music-icon');

    // Restore State from SessionStorage (simulating continuous playback)
    const savedTime = parseFloat(sessionStorage.getItem('music_time')) || 0;
    const shouldPlay = sessionStorage.getItem('music_playing') === 'true';

    // Set time immediately
    if (isFinite(savedTime)) audio.currentTime = savedTime;

    // State Updater
    const updateUI = (playing) => {
        if(playing) {
            btn.innerHTML = '⏸'; // Pause symbol
            icon.classList.remove('paused');
            sessionStorage.setItem('music_playing', 'true');
        } else {
            btn.innerHTML = '▶'; // Play symbol
            icon.classList.add('paused');
            sessionStorage.setItem('music_playing', 'false');
        }
    };

    // Attempt Playback
    if(shouldPlay) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                updateUI(true);
            }).catch(error => {
                console.warn("Autoplay prevented:", error);
                updateUI(false); // Revert UI if blocked
            });
        }
    } else {
        updateUI(false);
    }

    // Toggle Handler
    const toggleMusic = () => {
        if(audio.paused) {
            audio.play();
            updateUI(true);
        } else {
            audio.pause();
            updateUI(false);
        }
    };

    btn.onclick = toggleMusic;
    icon.onclick = toggleMusic;

    // Persist Playback Time periodically
    setInterval(() => {
        if(!audio.paused) {
            sessionStorage.setItem('music_time', audio.currentTime);
        }
    }, 1000);
}

// Home Page Logic
function initHome() {
    // 1. Carousel
    const wrapper = document.querySelector('.carousel-wrapper');
    const slideContainer = document.querySelector('.carousel-slides');

    if (wrapper && slideContainer) {
        const slides = siteConfig.slides || [];
        const total = slides.length;
        
        // Render Slides
        slideContainer.innerHTML = slides.map((src, idx) => 
            `<div class="slide">
                <img src="${resolvePath(src)}" 
                     onerror="${getImgFallback('Banner '+(idx+1), 'home', 800, 400)}"
                     style="width:100%; height:100%; object-fit:cover;">
             </div>`
        ).join('');
        
        // Render Controls if multiple slides
        if (total > 1) {
            const controlsHTML = `
                <div class="carousel-control carousel-prev">‹</div>
                <div class="carousel-control carousel-next">›</div>
                <div class="carousel-dots">
                    ${slides.map((_, i) => `<div class="carousel-dot ${i===0?'active':''}" data-index="${i}"></div>`).join('')}
                </div>
            `;
            wrapper.insertAdjacentHTML('beforeend', controlsHTML);

            // Logic
            let cur = 0;
            let timer = null;

            const updateCarousel = () => {
                slideContainer.style.transform = `translateX(-${cur * 100}%)`;
                const dots = wrapper.querySelectorAll('.carousel-dot');
                dots.forEach((d, i) => {
                    d.classList.toggle('active', i === cur);
                });
            };

            const next = () => {
                cur = (cur + 1) % total;
                updateCarousel();
            };

            const prev = () => {
                cur = (cur - 1 + total) % total;
                updateCarousel();
            };

            // Events
            wrapper.querySelector('.carousel-next').onclick = next;
            wrapper.querySelector('.carousel-prev').onclick = prev;
            wrapper.querySelectorAll('.carousel-dot').forEach(dot => {
                dot.onclick = () => {
                    cur = parseInt(dot.getAttribute('data-index'));
                    updateCarousel();
                };
            });

            // Auto Play
            const startTimer = () => {
                if(timer) clearInterval(timer);
                timer = setInterval(next, 5000);
            };
            const stopTimer = () => {
                if(timer) clearInterval(timer);
            };

            wrapper.addEventListener('mouseenter', stopTimer);
            wrapper.addEventListener('mouseleave', startTimer);
            startTimer();
        }
    }

    // 2. Floors
    ['elec','fashion','food'].forEach(cat => {
        const el = document.getElementById(`floor-${cat}-list`);
        if (el) {
            const items = products.filter(p=>p.category===cat).slice(0,4);
            el.innerHTML = items.map(p => createProductCard(p)).join('');
        }
    });

    // 3. GIF Showcase (Converted to Canvas Animation)
    const gifCanvas = document.getElementById('dynamic-gif-canvas');
    if (gifCanvas) {
        startGifAnimation(gifCanvas);
    }

    // 4. Video Section
    const videoContainer = document.getElementById('home-video-section');
    if (videoContainer && siteConfig.promoVideo) {
        videoContainer.innerHTML = `
            <div class="video-header">📺 品牌视频</div>
            <div class="video-wrapper">
                <video controls>
                    <source src="${resolvePath(siteConfig.promoVideo)}" type="video/mp4">
                    您的浏览器不支持 HTML5 视频。
                </video>
            </div>
        `;
    }
}

function initList() {
    const list = document.getElementById('product-list');
    if (!list) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('cat');
    const search = urlParams.get('search');
    
    let res = products;
    if (cat) res = products.filter(p => p.category === cat);
    if (search) res = products.filter(p => p.name.includes(search));
    
    // Update Title
    const titleEl = document.getElementById('list-title');
    if(titleEl) {
        if(cat) titleEl.innerText = CATEGORY_MAP[cat] ? CATEGORY_MAP[cat].split(' ')[1] : '分类商品';
        if(search) titleEl.innerText = `搜索结果: "${search}"`;
    }

    list.innerHTML = res.length ? res.map(p => createProductCard(p)).join('') : '<div style="padding:100px;width:100%;text-align:center;color:#999;font-size:16px;">🔍 暂无相关商品</div>';
}

function initDetail() {
    const id = parseInt(new URLSearchParams(window.location.search).get('id'));
    const p = products.find(x => x.id === id);
    if (!p) return;

    document.getElementById('d-name').innerText = p.name;
    document.getElementById('d-price').innerText = p.price;
    document.getElementById('d-desc').innerText = "✅ 084自营 ✅ 卡戎快运包邮 ✅ 7天无理由退换";
    
    const imgEl = document.getElementById('d-img');
    imgEl.src = resolvePath(p.image);
    imgEl.onerror = function() {
        this.src = drawProductImage(p.name, p.category, 600, 600);
    };
    
    document.getElementById('add-to-cart').onclick = () => {
        const qty = parseInt(document.getElementById('qty').value) || 1;
        addToCart(p.id, qty);
    };

    document.getElementById('btn-plus').onclick = () => {
        const q = document.getElementById('qty');
        q.value = parseInt(q.value) + 1;
    };
    document.getElementById('btn-minus').onclick = () => {
        const q = document.getElementById('qty');
        if(parseInt(q.value) > 1) q.value = parseInt(q.value) - 1;
    };

    // --- REVIEWS LOGIC START ---
    
    // 1. Initial Render
    renderReviews(p.reviews);

    // 2. Form Submission Handler
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.onsubmit = function(e) {
            e.preventDefault();
            
            const userVal = document.getElementById('review-user').value.trim();
            const ratingVal = parseInt(document.getElementById('review-rating').value);
            const contentVal = document.getElementById('review-content').value.trim();
            
            if (!contentVal) {
                alert("请填写评价内容！");
                return;
            }

            const newReview = {
                user: userVal || "匿名用户",
                rating: ratingVal,
                content: contentVal,
                date: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
            };

            // Initialize reviews array if needed
            if (!p.reviews) p.reviews = [];
            
            // Add new review to the beginning
            p.reviews.unshift(newReview); 

            // Re-render the list
            renderReviews(p.reviews);

            // Reset Form
            reviewForm.reset();
            alert("🎉 评论发表成功！");
        };
    }
}

// Helper: Render Reviews with Stars
function renderReviews(reviews) {
    const rList = document.getElementById('review-list');
    if (!rList) return;
    
    reviews = reviews || [];
    
    if (reviews.length === 0) {
        rList.innerHTML = '<div style="color:#999; padding:20px 0; text-align:center;">暂无评价，快来发表第一条评论吧！</div>';
        return;
    }

    const getStars = (n) => {
        n = Math.max(1, Math.min(5, n || 5)); 
        return '★'.repeat(n) + '☆'.repeat(5 - n);
    };

    rList.innerHTML = reviews.map(r => `
        <div class="review-item">
            <div class="user-line">
                👤 ${r.user} 
                <span class="stars" style="color:#ffb800; margin-left:10px;">${getStars(r.rating)}</span>
            </div>
            <p style="margin:5px 0;">${r.content}</p>
            <div class="date">${r.date || '近期评价'}</div>
        </div>
    `).join('');
}

function initCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const body = document.getElementById('cart-body');
    const totalEl = document.getElementById('cart-total');
    if (!body) return;

    let total = 0;
    body.innerHTML = cart.map((item, idx) => {
        const p = products.find(x => x.id === item.id);
        if (!p) return '';
        total += p.price * item.qty;
        return `
            <tr>
                <td style="padding:15px; text-align:center;">
                    <img src="${resolvePath(p.image)}" 
                         onerror="${getImgFallback(p.name, p.category, 100, 100)}"
                         class="cart-thumb">
                </td>
                <td style="text-align:left;">
                    <a href="detail.html?id=${p.id}" class="cart-p-name">${p.name}</a>
                </td>
                <td style="text-align:center;">¥${p.price}</td>
                <td style="text-align:center;">
                    <div class="cart-qty-box">
                        <button onclick="updateCartQty(${idx}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateCartQty(${idx}, 1)">+</button>
                    </div>
                </td>
                <td style="color:#e4393c; font-weight:bold; text-align:center;">¥${p.price * item.qty}</td>
                <td style="text-align:center;"><a href="javascript:;" onclick="removeCartItem(${idx})" class="cart-del">删除</a></td>
            </tr>
        `;
    }).join('');

    if (cart.length === 0) body.innerHTML = '<tr><td colspan="6" class="empty-cart">🛒 购物车还是空的，快去逛逛吧~ <br><a href="index.html">去首页</a></td></tr>';
    
    // Ensure we only update the number content, not appending symbols
    if (totalEl) totalEl.innerText = total;
    
    // Also update any other final price displays safely
    const finalEls = document.querySelectorAll('.final-price span');
    finalEls.forEach(el => el.innerText = total);
    
    const countEl = document.getElementById('cart-count-summary');
    if(countEl) countEl.innerText = cart.reduce((a, b) => a + b.qty, 0) + ' 件';
}

// --- CART ACTIONS ---
function addToCart(id, qty) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exist = cart.find(x => x.id === id);
    if (exist) exist.qty += qty;
    else cart.push({id, qty});
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert("✅ 商品已成功加入购物车！");
}

function updateCartQty(idx, delta) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart[idx]) {
        cart[idx].qty += delta;
        if (cart[idx].qty < 1) cart[idx].qty = 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        initCart();
        updateCartCount();
    }
}

function removeCartItem(idx) {
    if(confirm("确定要删除这个商品吗？")) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        initCart();
        updateCartCount();
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const els = document.querySelectorAll('#cart-count');
    els.forEach(el => el.innerText = cart.reduce((a, b) => a + b.qty, 0));
}

// --- ADMIN SYSTEM START ---

function initAdmin() {
    console.log("Starting Admin Init...");
    // 1. POPULATE FORM FIELDS (回填数据)
    const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val || ''; };
    
    // System Config
    setVal('cfg-marquee', siteConfig.marquee);
    
    // Check if captions exist before accessing
    if(siteConfig.slideCaptions && Array.isArray(siteConfig.slideCaptions)) {
        setVal('slide-title-1', siteConfig.slideCaptions[0]?.title);
        setVal('slide-title-2', siteConfig.slideCaptions[1]?.title);
        setVal('slide-title-3', siteConfig.slideCaptions[2]?.title);
    }

    // About Page
    if(window.MALL_DATA.about) {
        setVal('abt-title', window.MALL_DATA.about.title);
        setVal('abt-content', window.MALL_DATA.about.content);
    }

    // Contact Page
    if(window.MALL_DATA.contact) {
        setVal('ct-intro', window.MALL_DATA.contact.intro);
        setVal('ct-addr', window.MALL_DATA.contact.address);
        setVal('ct-phone', window.MALL_DATA.contact.phone);
        setVal('ct-email', window.MALL_DATA.contact.email);
        setVal('ct-time', window.MALL_DATA.contact.time);
    }

    // 2. RENDER TABLE
    renderAdminTable();

    // 3. BIND FILE INPUTS
    bindFile('file-slide-1', siteConfig.slides, 0);
    bindFile('file-slide-2', siteConfig.slides, 1);
    bindFile('file-slide-3', siteConfig.slides, 2);
    bindFile('file-gif', siteConfig, 'adGif');
    bindFile('file-music', siteConfig, 'bgMusic');
    bindFile('file-video', siteConfig, 'promoVideo');
    if(window.MALL_DATA.about) {
        bindFile('abt-file-img', window.MALL_DATA.about, 'image');
        bindFile('abt-file-video', window.MALL_DATA.about, 'video');
    }
    bindFile('edit-file', null, null, 'modal'); // Special handler

    // 4. BIND EXPORT BUTTON
    const btnExport = document.getElementById('btn-export');
    if(btnExport) btnExport.onclick = saveAndExport;
}

function renderAdminTable() {
    const list = document.getElementById('admin-list');
    if (list) {
        list.innerHTML = products.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>
                    <div class="admin-img-wrapper" style="position:relative; width:50px; height:50px;">
                        <img src="${resolvePath(p.image)}" 
                             class="admin-img-preview"
                             onerror="${getImgFallback(p.name, p.category, 100, 100)}">
                    </div>
                </td>
                <td>${p.name}</td>
                <td>¥${p.price}</td>
                <td>${p.category}</td>
                <td>
                    <button class="admin-btn admin-btn-edit" onclick="openEditModal(${p.id})">编辑</button>
                    <button class="admin-btn admin-btn-dark" style="background:#dc3545;margin-left:5px;" onclick="deleteProduct(${p.id})">删除</button>
                </td>
            </tr>
        `).join('');
    }
}

// --- ADMIN: EDIT MODAL LOGIC ---
let currentEditId = null;

window.openEditModal = function(id) {
    const p = products.find(x => x.id === id);
    if(!p) return;
    
    currentEditId = id;
    document.getElementById('edit-id').value = p.id;
    document.getElementById('edit-name').value = p.name;
    document.getElementById('edit-price').value = p.price;
    document.getElementById('edit-cat').value = p.category;
    document.getElementById('edit-img-url').value = p.image;
    document.getElementById('edit-img-preview').src = resolvePath(p.image);
    
    document.getElementById('edit-modal').style.display = 'flex';
};

window.closeEditModal = function() {
    document.getElementById('edit-modal').style.display = 'none';
    currentEditId = null;
};

window.saveEditedProduct = function() {
    if(currentEditId === null) return;
    
    const p = products.find(x => x.id === currentEditId);
    if(p) {
        p.name = document.getElementById('edit-name').value;
        p.price = parseFloat(document.getElementById('edit-price').value) || 0;
        p.category = document.getElementById('edit-cat').value;
        p.image = document.getElementById('edit-img-url').value; // Image might be set by file upload too
    }
    
    renderAdminTable();
    closeEditModal();
    alert("商品信息已更新 (记得点击右下角保存导出)");
};

window.deleteProduct = function(id) {
    if(confirm("确定要删除 ID: " + id + " 的商品吗？")) {
        const idx = products.findIndex(x => x.id === id);
        if(idx > -1) {
            products.splice(idx, 1);
            renderAdminTable();
        }
    }
};

window.addProduct = function() {
    const newId = products.length > 0 ? Math.max(...products.map(p=>p.id)) + 1 : 1;
    products.unshift({
        id: newId,
        name: "新商品 " + newId,
        price: 99,
        category: "elec",
        image: "images/1.png",
        reviews: []
    });
    renderAdminTable();
    openEditModal(newId); // Open modal immediately for editing
};

window.batchSetImagePaths = function() {
    if(confirm("这将把所有商品的图片路径重置为 'images/ID.png' (如 id=1 -> images/1.png)。确定吗？")) {
        products.forEach(p => {
            p.image = `images/${p.id}.png`;
        });
        renderAdminTable();
        alert("批量重置完成！");
    }
};

// --- ADMIN: DATA SAVING ---
function saveAndExport() {
    // 1. Collect Data from Text Inputs
    siteConfig.marquee = document.getElementById('cfg-marquee').value;
    
    // Update Captions
    if(!siteConfig.slideCaptions) siteConfig.slideCaptions = [{},{},{}];
    const t1 = document.getElementById('slide-title-1');
    const t2 = document.getElementById('slide-title-2');
    const t3 = document.getElementById('slide-title-3');
    
    if(t1) siteConfig.slideCaptions[0] = { title: t1.value, desc: "" };
    if(t2) siteConfig.slideCaptions[1] = { title: t2.value, desc: "" };
    if(t3) siteConfig.slideCaptions[2] = { title: t3.value, desc: "" };

    // About
    window.MALL_DATA.about.title = document.getElementById('abt-title').value;
    window.MALL_DATA.about.content = document.getElementById('abt-content').value;

    // Contact
    window.MALL_DATA.contact.intro = document.getElementById('ct-intro').value;
    window.MALL_DATA.contact.address = document.getElementById('ct-addr').value;
    window.MALL_DATA.contact.phone = document.getElementById('ct-phone').value;
    window.MALL_DATA.contact.email = document.getElementById('ct-email').value;
    window.MALL_DATA.contact.time = document.getElementById('ct-time').value;

    // 2. Generate File Content
    const dataStr = "window.MALL_DATA = " + JSON.stringify(window.MALL_DATA, null, 4) + ";";
    
    // 3. Download
    const blob = new Blob([dataStr], {type: "text/javascript"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.js";
    a.click();
    URL.revokeObjectURL(url);
    alert("✅ 配置文件已生成！\n请将下载的 data.js 文件覆盖项目中的 js/data.js 文件以永久生效。");
}

// --- HELPER: FILE HANDLING ---
function bindFile(id, obj, key, mode) {
    const el = document.getElementById(id);
    if (!el) return;
    el.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (evt) => {
            const result = evt.target.result;
            if(mode === 'modal') {
                // Special case for modal edit
                document.getElementById('edit-img-url').value = result; // Update text input for saving
                document.getElementById('edit-img-preview').src = result; // Update preview
            } else {
                if (typeof key === 'number') obj[key] = result; 
                else obj[key] = result;
                alert("🖼️ 图片/文件已读取 (请点击右下角按钮保存导出)");
            }
        };
        reader.readAsDataURL(file);
    };
}

// --- ABOUT PAGE ---
function initAbout() {
    const imgEl = document.getElementById('about-img');
    if(imgEl) {
        if(window.MALL_DATA.about.image) {
             imgEl.src = resolvePath(window.MALL_DATA.about.image);
             imgEl.onerror = function() { this.src = drawProductImage('Office Environment', 'home', 800, 600); };
        } else {
             imgEl.src = drawProductImage('Office Environment', 'home', 800, 600);
        }
    }
    
    const contentEl = document.getElementById('about-content');
    if(contentEl) contentEl.innerText = window.MALL_DATA.about.content;

    const vidEl = document.getElementById('about-video');
    if(vidEl) {
        const src = document.getElementById('about-video-src');
        if(src && window.MALL_DATA.about.video) {
            src.src = resolvePath(window.MALL_DATA.about.video);
            vidEl.load();
        }
    }
}

// --- CONTACT PAGE ---
function initContact() {
    const c = window.MALL_DATA.contact;
    setText('contact-intro', c.intro);
    setText('contact-address', c.address);
    setText('contact-phone', c.phone);
    setText('contact-email', c.email);
    setText('contact-time', c.time);
}

function setText(id, txt) {
    const el = document.getElementById(id);
    if(el) el.innerText = txt || '';
}

// --- HELPER: UI ELEMENTS ---
function createProductCard(p) {
    const fallback = getImgFallback(p.name, p.category);
    return `
        <div class="product-card">
            <div class="card-inner">
                <a href="detail.html?id=${p.id}" class="zoom-effect">
                    <img src="${resolvePath(p.image)}" 
                         onerror="${fallback}" 
                         loading="lazy" 
                         alt="${p.name}">
                </a>
                <div class="p-name"><a href="detail.html?id=${p.id}">${p.name}</a></div>
                <div class="p-price">¥${p.price}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${p.id}, 1)" title="加入购物车">🛒</button>
            </div>
        </div>
    `;
}

// Global Canvas Generator
window.drawProductImage = function(text, cat, w, h) {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    
    // Gradients
    let color1 = '#f5f7fa', color2 = '#c3cfe2';
    if(cat === 'elec') { color1='#2c3e50'; color2='#4ca1af'; } 
    if(cat === 'fashion') { color1='#ff9a9e'; color2='#fecfef'; } 
    if(cat === 'food') { color1='#43cea2'; color2='#185a9d'; }
    if(cat === 'home') { color1='#cc2b5e'; color2='#753a88'; }
    
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,w,h);
    
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for(let i=0; i<w; i+=20) { ctx.fillRect(i, 0, 10, h); }
    
    ctx.fillStyle = '#fff';
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.font = 'bold ' + (w/10) + 'px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.substring(0, 10), w/2, h/2);
    
    return canvas.toDataURL('image/jpeg', 0.9);
};

window.handleSearch = function() {
    const val = document.querySelector('.search-box input').value;
    if(val) window.location.href = `list.html?search=${encodeURIComponent(val)}`;
};

document.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && e.target.closest('.zoom-effect')) {
        const lb = document.getElementById('lightbox');
        if(lb) {
            const lbImg = lb.querySelector('img');
            lbImg.src = e.target.src;
            lb.style.display = 'flex';
        }
    }
});

/**
 * AUTO GENERATED GIF ANIMATION
 * Creates a scrolling background with bouncing text
 */
function startGifAnimation(canvas) {
    if(!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize
    const resize = () => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles
    const particles = [];
    for(let i=0; i<50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 5 + 2, // radius
            dy: Math.random() * 2 + 1, // speed
            c: ['#fff', '#ffd700', '#87ceeb'][Math.floor(Math.random()*3)] // White, Gold, SkyBlue
        });
    }

    let frame = 0;

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        frame++;

        // 1. Lively Background (Warm Gradient)
        // Animate gradient slightly
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#ff9a9e');
        gradient.addColorStop(0.5 + Math.sin(frame/100)*0.1, '#fecfef');
        gradient.addColorStop(1, '#ff9a9e');

        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,w,h);

        // 2. Confetti Animation
        particles.forEach(p => {
            p.y += p.dy;
            if(p.y > h) p.y = -10; // Loop
            ctx.beginPath();
            ctx.fillStyle = p.c;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fill();
        });

        // 3. Cheerful Text
        ctx.save();
        ctx.translate(w/2, h/2);

        // Bouncing Effect
        const scale = 1 + Math.sin(frame / 15) * 0.05;
        const rotate = Math.sin(frame / 30) * 0.05;
        ctx.scale(scale, scale);
        ctx.rotate(rotate);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Main Title
        ctx.fillStyle = '#e4393c'; // Brand Red
        ctx.font = '900 42px "Microsoft YaHei", sans-serif';
        // Text Stroke/Shadow for pop
        ctx.shadowColor = "rgba(255,255,255,1)";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText("🎉 狂欢嗨购节 🎉", 0, -10);

        // Subtitle
        ctx.font = 'bold 20px "Microsoft YaHei", sans-serif';
        ctx.fillStyle = '#ff6f00'; // Deep Orange
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillText("爆款直降 · 全场包邮", 0, 35);

        ctx.restore();

        requestAnimationFrame(draw);
    }
    draw();
}
