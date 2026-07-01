// ===== DATA =====
const products = [
    { id: 1, name: 'Eternal Rose', category: 'Rose', price: 45, rating: 5, image: 'images/rose.png', badge: 'Best Seller', popular: true, seasonal: false },
    { id: 2, name: 'White Lily', category: 'Lily', price: 55, rating: 4.5, image: 'images/lily.png', badge: null, popular: false, seasonal: true },
    { id: 3, name: 'Sunflower Dream', category: 'Sunflower', price: 40, rating: 4.8, image: 'images/sunflower.png', badge: 'Seasonal', popular: false, seasonal: true },
    { id: 4, name: 'Tulip Romance', category: 'Tulip', price: 50, rating: 4.3, image: 'images/tulip.png', badge: null, popular: false, seasonal: false },
    { id: 5, name: 'Orchid Elegance', category: 'Orchid', price: 65, rating: 4.9, image: 'images/orchid.png', badge: 'Best Seller', popular: true, seasonal: false },
    { id: 6, name: 'Peony Bliss', category: 'Mixed', price: 60, rating: 4.6, image: 'images/peony.png', badge: null, popular: false, seasonal: false },
    { id: 7, name: 'Garden Rose', category: 'Rose', price: 48, rating: 4.7, image: 'images/gardenrose.png', badge: 'New', popular: false, seasonal: false },
    { id: 8, name: 'Stargazer Lily', category: 'Lily', price: 58, rating: 4.4, image: 'images/stargazerlily.png', badge: null, popular: false, seasonal: true },
    { id: 9, name: 'Happy Sunflower', category: 'Sunflower', price: 38, rating: 4.2, image: 'images/happysunflower.png', badge: null, popular: false, seasonal: false },
    { id: 10, name: 'Pink Tulip', category: 'Tulip', price: 52, rating: 4.5, image: 'images/pinktulip.png', badge: 'Best Seller', popular: true, seasonal: false },
    { id: 11, name: 'Purple Orchid', category: 'Orchid', price: 70, rating: 4.8, image: 'images/purpleorchid.png', badge: null, popular: false, seasonal: false },
    { id: 12, name: 'Mixed Bouquet', category: 'Mixed', price: 75, rating: 4.9, image: 'images/mixedbouquet.png', badge: 'Seasonal', popular: false, seasonal: true }
];

const testimonials = [
    { name: 'Sarah Johnson', role: 'Happy Customer', text: 'Absolutely beautiful bouquet! The flowers were so fresh and the packaging was gorgeous. Will definitely order again!', rating: 5, image: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'Michael Chen', role: 'Regular Customer', text: "Best flower shop in town! I've been ordering for years and they never disappoint. The same-day delivery is a lifesaver.", rating: 5, image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Emily Rodriguez', role: 'First-time Buyer', text: 'The bouquet arrived exactly as pictured and lasted for over two weeks! The quality is exceptional.', rating: 4.5, image: 'https://randomuser.me/api/portraits/women/2.jpg' }
];

const flowerStories = [
    { emoji: '🌹', name: 'Rose', meaning: 'Love, gratitude, admiration' },
    { emoji: '🌻', name: 'Sunflower', meaning: 'Hope, warmth, happiness' },
    { emoji: '🌷', name: 'Tulip', meaning: 'New beginnings, perfect love' },
    { emoji: '🌸', name: 'Cherry Blossom', meaning: 'Beauty, renewal, life' },
    { emoji: '🌺', name: 'Hibiscus', meaning: 'Delicate beauty, femininity' },
    { emoji: '🌿', name: 'Lavender', meaning: 'Calm, peace, serenity' }
];

const igImages = [
    'images/rose.png',
    'images/lily.png',
    'images/mixedbouquet.png',
    'images/stargazerlily.png',
    'images/sunflower.png',
    'images/orchid.png'
];

// ===== STATE =====
let cart = [];
let wishlist = [];
let currentFilter = 'all';
let currentSort = 'default';
let filteredProducts = [...products];

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 800);
});

// ===== AOS INIT =====
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
    
    renderProducts();
    renderTestimonials();
    renderStories();
    renderIGGallery();
    updateCounts();
});

// ===== NAVBAR =====
window.addEventListener('scroll', () => {
    const header = document.getElementById('navbar');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

function toggleMobileMenu() {
    const nav = document.getElementById('nav-links');
    nav.classList.toggle('open');
}

// ===== THEME =====
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const theme = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    
    const icon = document.querySelector('.theme-toggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    
    localStorage.setItem('theme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (savedTheme === 'dark') {
    document.querySelector('.theme-toggle i').className = 'fas fa-sun';
}

// ===== SEARCH =====
function toggleSearch() {
    const overlay = document.getElementById('search-overlay');
    overlay.classList.toggle('active');
    if (overlay.classList.contains('active')) {
        setTimeout(() => {
            document.getElementById('search-input').focus();
        }, 300);
    } else {
        document.getElementById('search-results').classList.remove('active');
        document.getElementById('search-input').value = '';
    }
}

function closeSearch() {
    document.getElementById('search-overlay').classList.remove('active');
    document.getElementById('search-results').classList.remove('active');
    document.getElementById('search-input').value = '';
}

function searchFlowers() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const results = document.getElementById('search-results');
    
    if (!query || query.length < 1) {
        results.classList.remove('active');
        return;
    }
    
    // Search in product names and categories
    const matched = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    
    if (matched.length === 0) {
        results.innerHTML = `
            <div style="padding:20px;text-align:center;color:#999;">
                <i class="fas fa-search" style="font-size:30px;display:block;margin-bottom:10px;"></i>
                No flowers found for "<strong>${query}</strong>" 🌸
            </div>
        `;
    } else {
        results.innerHTML = matched.map(p => `
            <div class="search-result-item" onclick="quickView(${p.id}); closeSearch();">
                <img src="${p.image}" alt="${p.name}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;">
                <div style="flex:1;">
                    <div style="font-weight:600;color:var(--dark-brown);">${p.name}</div>
                    <div style="font-size:13px;color:#999;">${p.category}</div>
                    <div style="font-size:14px;color:var(--dusty-pink);font-weight:600;">$${p.price}</div>
                </div>
                <i class="fas fa-chevron-right" style="color:#ccc;"></i>
            </div>
        `).join('');
    }
    
    results.classList.add('active');
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
    const grid = document.getElementById('product-grid');
    let productsToShow = [...filteredProducts];
    
    // Apply filter
    if (currentFilter === 'popular') {
        productsToShow = productsToShow.filter(p => p.popular);
    } else if (currentFilter === 'seasonal') {
        productsToShow = productsToShow.filter(p => p.seasonal);
    }
    
    // Apply sort
    if (currentSort === 'price-low') {
        productsToShow.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
        productsToShow.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'name') {
        productsToShow.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    if (productsToShow.length === 0) {
        grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#999;padding:40px;">No flowers found 🌸</p>';
        return;
    }
    
    grid.innerHTML = productsToShow.map(p => {
        const isWishlisted = wishlist.some(w => w.id === p.id);
        const stars = '⭐'.repeat(Math.floor(p.rating));
        const halfStar = p.rating % 1 >= 0.5 ? '⭐' : '';
        
        return `
            <div class="product-card" data-aos="fade-up">
                ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
                <img src="${p.image}" alt="${p.name}" class="product-image" onclick="quickView(${p.id})">
                <div class="product-actions">
                    <button onclick="toggleWishlist(${p.id})" title="Wishlist">
                        <i class="fas fa-heart ${isWishlisted ? 'wishlisted' : ''}"></i>
                    </button>
                    <button onclick="quickView(${p.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p class="product-category">${p.category}</p>
                    <div class="product-rating">
                        <span>${stars}${halfStar}</span>
                        <span style="color:#999;font-size:13px;">(${p.rating})</span>
                    </div>
                    <span class="product-price">$${p.price}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${p.id})">
                        <i class="fas fa-shopping-bag"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== FILTER & SORT =====
function filterProducts(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === 
            (filter === 'all' ? 'All' : filter === 'popular' ? '⭐ Best Sellers' : '🌿 Seasonal'));
    });
    renderProducts();
}

function filterByCategory(category) {
    // This filters products by category
    const categoryMap = {
        'Rose': 'Rose',
        'Tulip': 'Tulip',
        'Lily': 'Lily',
        'Orchid': 'Orchid',
        'Sunflower': 'Sunflower',
        'Mixed': 'Mixed',
        'Plant': 'Plant'
    };
    
    const filter = categoryMap[category];
    if (filter) {
        filteredProducts = products.filter(p => p.category === filter);
        currentFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent.trim() === 'All');
        });
        renderProducts();
        scrollToShop();
        showToast(`Showing ${category} flowers 🌸`);
    }
}

function scrollToCollections() {
    document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
}

function sortProducts() {
    const select = document.getElementById('sort-select');
    currentSort = select.value;
    renderProducts();
}

function scrollToShop() {
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}

// ===== CART =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCounts();
    renderCart();
    showToast(`🌸 ${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCounts();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    renderCart();
    updateCounts();
}

function openCart() {
    document.getElementById('cart-sidebar').classList.add('open');
    renderCart();
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:40px;">Your cart is empty 🌸</p>';
        totalContainer.innerHTML = '';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="sidebar-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <div class="item-actions">
                <button onclick="updateQuantity(${item.id}, -1)">−</button>
                <span style="font-weight:600;">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" style="color:#ff6b6b;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalContainer.innerHTML = `
        <div class="total-row">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
        <button class="checkout-btn" onclick="checkout()">
            <i class="fas fa-credit-card"></i> Proceed to Checkout
        </button>
    `;
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty! 🌸');
        return;
    }
    showToast('Order placed successfully! Thank you for shopping with us 🌷');
    cart = [];
    renderCart();
    updateCounts();
    closeCart();
}

// ===== WISHLIST =====
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const index = wishlist.findIndex(w => w.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast(`Removed ${product.name} from wishlist 💔`);
    } else {
        wishlist.push(product);
        showToast(`❤️ Added ${product.name} to wishlist!`);
    }
    
    updateCounts();
    renderWishlist();
    renderProducts();
}

function openWishlist() {
    document.getElementById('wishlist-sidebar').classList.add('open');
    renderWishlist();
}

function closeWishlist() {
    document.getElementById('wishlist-sidebar').classList.remove('open');
}

function renderWishlist() {
    const container = document.getElementById('wishlist-items');
    
    if (wishlist.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:40px;">Your wishlist is empty 💔</p>';
        return;
    }
    
    container.innerHTML = wishlist.map(item => `
        <div class="sidebar-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>$${item.price}</p>
            </div>
            <div class="item-actions">
                <button onclick="addToCart(${item.id})" style="color:var(--sage-green);">
                    <i class="fas fa-shopping-bag"></i>
                </button>
                <button onclick="toggleWishlist(${item.id})" style="color:#ff6b6b;">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== QUICK VIEW =====
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quick-view-modal');
    const body = document.getElementById('modal-body');
    const stars = '⭐'.repeat(Math.floor(product.rating));
    const halfStar = product.rating % 1 >= 0.5 ? '⭐' : '';
    
    body.innerHTML = `
        <div class="modal-product">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p style="color:#999;font-size:14px;">${product.category}</p>
            <div class="price">$${product.price}</div>
            <div style="margin:10px 0;">${stars}${halfStar} (${product.rating})</div>
            <p style="margin-bottom:20px;">A beautiful ${product.name.toLowerCase()} bouquet perfect for any occasion. Handcrafted with love and care.</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id}); closeModal();" style="width:100%;">
                <i class="fas fa-shopping-bag"></i> Add to Cart
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('quick-view-modal').classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on outside click
document.getElementById('quick-view-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeModal();
    }
});

// ===== TESTIMONIALS =====
function renderTestimonials() {
    const grid = document.getElementById('testimonial-grid');
    grid.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="stars">${'⭐'.repeat(Math.floor(t.rating))}</div>
            <p>"${t.text}"</p>
            <div class="testimonial-author">
                <img src="${t.image}" alt="${t.name}">
                <div>
                    <div class="author-name">${t.name}</div>
                    <div class="author-role">${t.role}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== FLOWER STORIES =====
function renderStories() {
    const grid = document.getElementById('story-grid');
    grid.innerHTML = flowerStories.map(s => `
        <div class="story-card" onclick="toggleStory(this)">
            <span class="story-emoji">${s.emoji}</span>
            <h4>${s.name}</h4>
            <div class="story-meaning">${s.meaning}</div>
        </div>
    `).join('');
}

function toggleStory(element) {
    element.classList.toggle('active');
}

// ===== INSTAGRAM GALLERY =====
function renderIGGallery() {
    const grid = document.getElementById('ig-grid');
    grid.innerHTML = igImages.map(img => `
        <div class="ig-item">
            <img src="${img}" alt="Instagram">
            <div class="ig-overlay">
                <i class="fab fa-instagram"></i>
            </div>
        </div>
    `).join('');
}

// ===== NEWSLETTER =====
function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value.trim();
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address 📧');
        return;
    }
    
    showToast(`🌸 Thank you for subscribing! Check your inbox: ${email}`);
    document.getElementById('newsletter-email').value = '';
}

// ===== CONTACT FORM =====
function submitContact(e) {
    e.preventDefault();
    showToast('📩 Your message has been sent! We\'ll get back to you soon.');
    e.target.reset();
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== UPDATE COUNTS =====
function updateCounts() {
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('wishlist-count').textContent = wishlist.length;
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSearch();
        closeCart();
        closeWishlist();
        closeModal();
    }
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
    }
});

// ===== CLOSE SIDEBARS ON OVERLAY =====
document.addEventListener('click', (e) => {
    if (e.target.closest('.sidebar') || e.target.closest('.nav-actions') || e.target.closest('header')) {
        return;
    }
    // Close sidebars when clicking outside
    const cart = document.getElementById('cart-sidebar');
    const wishlist = document.getElementById('wishlist-sidebar');
    if (cart.classList.contains('open')) {
        cart.classList.remove('open');
    }
    if (wishlist.classList.contains('open')) {
        wishlist.classList.remove('open');
    }
});

console.log('🌷 Bloom & Blossom - Made with love');
console.log('🌸 Every flower tells a story...');