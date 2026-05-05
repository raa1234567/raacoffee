// ---------- BrewHaven Coffee Shop JavaScript ----------

// ---------- COFFEE PRODUCT DATABASE ----------
const productsData = [
  // HOT COFFEE
  { id: 1, name: "Caramel Macchiato", price: 4.95, category: "Hot coffee", imageIcon: "☕️🔥", imageLabel: "caramel macchiato" },
  { id: 2, name: "Vanilla Latte", price: 4.75, category: "Hot coffee", imageIcon: "☕️✨", imageLabel: "vanilla latte" },
  { id: 3, name: "Espresso Roast", price: 3.25, category: "Hot coffee", imageIcon: "⚡☕", imageLabel: "espresso" },
  { id: 4, name: "Mocha Indulgence", price: 5.25, category: "Hot coffee", imageIcon: "🍫☕", imageLabel: "mocha" },
  // COLD COFFEE
  { id: 5, name: "Iced Americano", price: 4.25, category: "Cold coffee", imageIcon: "🧊🥤", imageLabel: "iced americano" },
  { id: 6, name: "Cold Brew Silk", price: 4.95, category: "Cold coffee", imageIcon: "❄️🥤", imageLabel: "cold brew" },
  { id: 7, name: "Iced Hazelnut Latte", price: 5.45, category: "Cold coffee", imageIcon: "🌰🧊", imageLabel: "hazelnut iced latte" },
  { id: 8, name: "Nitro Cold Brew", price: 5.75, category: "Cold coffee", imageIcon: "💨🥤", imageLabel: "nitro brew" },
  // FRAPPE COFFEE
  { id: 9, name: "Caramel Frappe", price: 6.25, category: "Frappe coffee", imageIcon: "🍦🥤", imageLabel: "caramel frappe" },
  { id: 10, name: "Mocha Cookie Frappe", price: 6.75, category: "Frappe coffee", imageIcon: "🍪🥤", imageLabel: "mocha cookie frappe" },
  { id: 11, name: "Vanilla Bean Frappe", price: 6.25, category: "Frappe coffee", imageIcon: "🌿🥤", imageLabel: "vanilla frappe" },
  { id: 12, name: "Strawberry Cream Frappe", price: 6.45, category: "Frappe coffee", imageIcon: "🍓🥤", imageLabel: "strawberry frappe" }
];

// ---------- MENU DATA ----------
const menuCategories = [
  { id: 1, name: "Hot Coffee", icon: "🔥", description: "Warm and comforting hot beverages" },
  { id: 2, name: "Cold Coffee", icon: "🧊", description: "Refreshing iced coffee drinks" },
  { id: 3, name: "Frappe", icon: "🥤", description: "Blended frozen coffee treats" },
  { id: 4, name: "Pastries", icon: "🥐", description: "Freshly baked accompaniments" },
  { id: 5, name: "Snacks", icon: "🍪", description: "Perfect coffee pairings" }
];

// ---------- ORDER HISTORY ----------
let orderHistory = [];
let currentOrderId = 1;

// ---------- CART STATE (quantity control) ----------
let cart = []; // each element: { id, name, price, quantity }

// Helper: find cart item index by product id
function findCartItemIndex(productId) {
  return cart.findIndex(item => item.id === productId);
}

// add product (increases quantity if exists)
function addToCart(product) {
  const idx = findCartItemIndex(product.id);
  if (idx !== -1) {
    cart[idx].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  renderCart();
}

// remove entire product row from cart (delete product)
function removeProductFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

// increase quantity by 1
function increaseQuantity(productId) {
  const idx = findCartItemIndex(productId);
  if (idx !== -1) {
    cart[idx].quantity += 1;
    renderCart();
  }
}

// decrease quantity by 1, if quantity becomes 0 -> remove product
function decreaseQuantity(productId) {
  const idx = findCartItemIndex(productId);
  if (idx !== -1) {
    if (cart[idx].quantity > 1) {
      cart[idx].quantity -= 1;
    } else {
      cart.splice(idx, 1);
    }
    renderCart();
  }
}

// compute total price
function getTotalPrice() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// RENDER CART SIDEBAR with dynamic controls (quantity & remove)
function renderCart() {
  const cartContainer = document.getElementById('cartItemsContainer');
  const totalSpan = document.getElementById('cartTotalPrice');
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-coffee"></i> Cart is empty ☕️</div>`;
    totalSpan.innerText = `$0.00`;
    return;
  }

  let html = '';
  cart.forEach(item => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    html += `
      <div class="cart-item-row" data-id="${item.id}">
        <div class="cart-item-name">${escapeHtml(item.name)} <span style="font-size:0.7rem;">x${item.quantity}</span></div>
        <div class="cart-item-controls">
          <span style="font-weight:600;">$${itemTotal}</span>
          <button class="cart-qty-down" data-id="${item.id}" title="Decrease quantity">−</button>
          <span style="min-width: 18px; text-align:center;">${item.quantity}</span>
          <button class="cart-qty-up" data-id="${item.id}" title="Increase quantity">+</button>
          <button class="cart-remove-btn" data-id="${item.id}" title="Remove item"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `;
  });
  cartContainer.innerHTML = html;
  totalSpan.innerText = `$${getTotalPrice().toFixed(2)}`;

  // attach event listeners to dynamic cart buttons
  document.querySelectorAll('.cart-qty-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'));
      decreaseQuantity(id);
    });
  });
  document.querySelectorAll('.cart-qty-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'));
      increaseQuantity(id);
    });
  });
  document.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'));
      removeProductFromCart(id);
    });
  });
}

// simple escape helper to avoid XSS
function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if(m === '&') return '&amp;';
    if(m === '<') return '&lt;';
    if(m === '>') return '&gt;';
    return m;
  }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
    return c;
  });
}

// ---------- FILTERING (Category + Search) ----------
let currentCategory = "all";     // "all" or exact category string
let currentSearchQuery = "";

function getFilteredProducts() {
  let filtered = [...productsData];
  // filter by category
  if (currentCategory !== "all") {
    filtered = filtered.filter(p => p.category === currentCategory);
  }
  // filter by search (name, case-insensitive)
  if (currentSearchQuery.trim() !== "") {
    const queryLower = currentSearchQuery.trim().toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(queryLower));
  }
  return filtered;
}

function getProductById(productId) {
  return productsData.find(product => product.id === productId);
}

function openProductDetails(productId) {
  const product = getProductById(productId);
  if (!product) return;
  const modal = document.getElementById('productDetailModal');
  if (!modal) return;

  modal.querySelector('.modal-title').innerText = product.name;
  modal.querySelector('.modal-price').innerText = `$${product.price.toFixed(2)}`;
  modal.querySelector('.modal-category').innerText = product.category;
  modal.querySelector('.modal-description').innerText = `Savor the ${product.name.toLowerCase()} with our signature roast, silky crema, and handcrafted balance. Perfect for anytime you need a coffee break.`;
  modal.querySelector('.modal-img').innerText = product.imageIcon || '☕';
  const addButton = modal.querySelector('.modal-add-btn');
  addButton.setAttribute('data-id', product.id);
  addButton.setAttribute('data-name', product.name);
  addButton.setAttribute('data-price', product.price);

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeProductDetails() {
  const modal = document.getElementById('productDetailModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function initDetailView() {
  const modal = document.getElementById('productDetailModal');
  if (!modal) return;

  modal.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeProductDetails();
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProductDetails();
    }
  });

  const addButton = modal.querySelector('.modal-add-btn');
  addButton.addEventListener('click', (e) => {
    e.preventDefault();
    const id = parseInt(addButton.getAttribute('data-id'));
    const name = addButton.getAttribute('data-name');
    const price = parseFloat(addButton.getAttribute('data-price'));
    addToCart({ id, name, price });
    closeProductDetails();
  });
}

// render products grid with images, price, add-to-cart
function renderProducts() {
  const gridContainer = document.getElementById('productsGrid');
  if (!gridContainer) return;
  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    gridContainer.innerHTML = `<div class="no-results"><i class="fas fa-search-minus"></i> No coffee matches "${escapeHtml(currentSearchQuery)}"<br>Try a different name ☕</div>`;
    return;
  }

  let cardsHtml = '';
  filtered.forEach(product => {
    // Use product's imageIcon + a gentle emoji background
    const imageContent = product.imageIcon || "☕";
    cardsHtml += `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-img">
          <span style="font-size: 3.6rem;">${imageContent}</span>
        </div>
        <div class="product-info">
          <div class="product-name">${escapeHtml(product.name)}</div>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="view-btn-row">
            <button class="add-btn" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${product.price}" type="button">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  });
  gridContainer.innerHTML = cardsHtml;

  // Attach product card click event to open details
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.getAttribute('data-product-id'));
      openProductDetails(id);
    });
  });

  // Attach "Add to Cart" event listeners for each product button
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'));
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const product = { id, name, price };
      addToCart(product);
      // optional micro animation / feedback
      btn.style.transform = "scale(0.97)";
      setTimeout(() => { btn.style.transform = ""; }, 120);
    });
  });
}

// update UI after any filter/trigger
function refreshUI() {
  renderProducts();
}

// category tab active UI + filter
function initCategoryFilters() {
  const categoryBtns = document.querySelectorAll('.cat-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const catValue = btn.getAttribute('data-cat');
      if (catValue === "all") {
        currentCategory = "all";
      } else {
        currentCategory = catValue;
      }
      // update active class
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      refreshUI();
    });
  });
}

// search input handler
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value;
    refreshUI();
  });
}

// additional: ensure that product card has proper fallback interaction
// Also provide a couple of initial cart examples? No, start empty.
// potential: save cart in localStorage (optional extension, but not required)
// For better UX, we'll also call refreshUI on page load.

// ==================== MENU FEATURE ====================
function renderMenu() {
  const menuContainer = document.getElementById('menuContainer');
  if (!menuContainer) return;

  let html = '';
  menuCategories.forEach(category => {
    // Get products for this category
    const categoryProducts = productsData.filter(p => p.category === category.name);
    
    html += `
      <div class="menu-category" data-category="${category.name}">
        <div class="menu-category-header">
          <span class="menu-category-icon">${category.icon}</span>
          <h3 class="menu-category-title">${category.name}</h3>
          <p class="menu-category-desc">${category.description}</p>
        </div>
        <div class="menu-products">
          ${categoryProducts.map(product => `
            <div class="menu-product-item" data-id="${product.id}">
              <span class="menu-product-icon">${product.imageIcon}</span>
              <div class="menu-product-info">
                <span class="menu-product-name">${escapeHtml(product.name)}</span>
                <span class="menu-product-price">$${product.price.toFixed(2)}</span>
              </div>
              <button class="menu-add-btn" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${product.price}">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  menuContainer.innerHTML = html;
  
  // Attach event listeners
  document.querySelectorAll('.menu-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'));
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      addToCart({ id, name, price });
      showNotification(`Added ${name} to cart!`);
    });
  });
}

function initMenuView() {
  const menuSection = document.getElementById('menuSection');
  if (!menuSection) return;
  
  menuSection.addEventListener('click', () => {
    showSection('menu');
  });
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification-toast';
  notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// ==================== ORDER FEATURE ====================
function placeOrder() {
  if (cart.length === 0) {
    showNotification('Your cart is empty! Add items first.');
    return;
  }
  
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const order = {
    id: orderId,
    date: new Date().toISOString(),
    items: [...cart],
    total: getTotalPrice(),
    status: 'Pending'
  };
  
  orderHistory.push(order);
  currentOrderId++;
  
  // Clear cart
  cart = [];
  renderCart();
  
  showNotification(`Order #${orderId} placed successfully!`);
  renderOrderHistory();
}

function renderOrderHistory() {
  const orderContainer = document.getElementById('orderHistoryContainer');
  if (!orderContainer) return;
  
  if (orderHistory.length === 0) {
    orderContainer.innerHTML = `
      <div class="empty-orders-msg">
        <i class="fas fa-clipboard-list"></i>
        <p>No orders yet</p>
        <p class="order-hint">Place your first order to see it here!</p>
      </div>
    `;
    return;
  }
  
  let html = '';
  orderHistory.slice().reverse().forEach(order => {
    const orderDate = new Date(order.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    html += `
      <div class="order-card" data-order-id="${order.id}">
        <div class="order-header">
          <span class="order-id">#${order.id}</span>
          <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
        </div>
        <div class="order-date">${orderDate}</div>
        <div class="order-items">
          ${order.items.map(item => `
            <div class="order-item">
              <span>${item.name} x${item.quantity}</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-total">
          <span>Total</span>
          <span>$${order.total.toFixed(2)}</span>
        </div>
      </div>
    `;
  });
  
  orderContainer.innerHTML = html;
}

function initOrderView() {
  const orderBtn = document.getElementById('placeOrderBtn');
  if (orderBtn) {
    orderBtn.addEventListener('click', placeOrder);
  }
  
  const orderSection = document.getElementById('orderSection');
  if (orderSection) {
    orderSection.addEventListener('click', () => {
      showSection('orders');
    });
  }
}

function showSection(sectionName) {
  // Hide all sections
  document.getElementById('productsGrid').style.display = sectionName === 'products' ? '' : 'none';
  document.getElementById('menuContainer').style.display = sectionName === 'menu' ? 'block' : 'none';
  document.getElementById('ordersSection').style.display = sectionName === 'orders' ? 'block' : 'none';
  
  // Update nav active state
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav-btn[data-section="${sectionName}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  
  if (sectionName === 'menu') {
    renderMenu();
  } else if (sectionName === 'orders') {
    renderOrderHistory();
  }
}

function initNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-section');
      showSection(section);
    });
  });
}

// initialize all
function init() {
  initCategoryFilters();
  initSearch();
  initDetailView();
  initMenuView();
  initOrderView();
  initNavigation();
  renderProducts();      // initial grid with no filter
  renderCart();          // empty cart panel
  // keep sync: if any external modification to cart, UI fresh
  // store original add methods are already re-rendering cart.
}

// run on page load
document.addEventListener('DOMContentLoaded', init);