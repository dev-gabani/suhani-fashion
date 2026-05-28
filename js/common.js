/* SUHANI FASHION - Common Interactions */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize interactions
  initHeaderScroll();
  initMobileMenu();
  initSearchOverlay();
  initCartDrawer();
  initScrollAnimations();
  
  // Set initial cart count
  updateHeaderCartCount();

  // Listen to cart update events
  window.addEventListener("cartUpdated", () => {
    updateHeaderCartCount();
    renderCartDrawerItems();
  });
});

/* Header Scroll Behavior (Hide on scroll down, show on scroll up) */
function initHeaderScroll() {
  const header = document.querySelector("header.site-header");
  if (!header) return;

  let lastScrollTop = 0;
  const delta = 10; // Minimum scroll distance before trigger

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add border/shadow when scrolled
    if (scrollTop > 50) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }

    if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

    if (scrollTop > lastScrollTop && scrollTop > 150) {
      // Scroll Down - Hide Header
      header.classList.add("header-hidden");
    } else {
      // Scroll Up - Show Header
      header.classList.remove("header-hidden");
    }
    
    lastScrollTop = scrollTop;
  });
}

/* Mobile Side Menu */
function initMobileMenu() {
  const burger = document.querySelector(".mobile-menu-trigger");
  const mobileNav = document.querySelector(".mobile-nav-drawer");
  const closeBtn = document.querySelector(".mobile-nav-close");
  const overlay = document.querySelector(".mobile-nav-overlay");

  if (!burger || !mobileNav) return;

  const openNav = () => {
    mobileNav.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Disable scroll
  };

  const closeNav = () => {
    mobileNav.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = ""; // Enable scroll
  };

  burger.addEventListener("click", openNav);
  if (closeBtn) closeBtn.addEventListener("click", closeNav);
  if (overlay) overlay.addEventListener("click", closeNav);
}

/* Fullscreen Search Overlay */
function initSearchOverlay() {
  const searchTriggers = document.querySelectorAll(".search-trigger");
  const searchOverlay = document.querySelector(".search-overlay");
  const searchClose = document.querySelector(".search-close");
  const searchInput = document.querySelector(".search-input");
  const searchResults = document.querySelector(".search-results-grid");

  if (!searchOverlay) return;

  const openSearch = (e) => {
    if (e) e.preventDefault();
    searchOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => searchInput.focus(), 300);
  };

  const closeSearch = () => {
    searchOverlay.classList.remove("active");
    document.body.style.overflow = "";
    searchInput.value = "";
    if (searchResults) searchResults.innerHTML = "";
  };

  searchTriggers.forEach(btn => btn.addEventListener("click", openSearch));
  if (searchClose) searchClose.addEventListener("click", closeSearch);

  // Close on Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
      closeSearch();
    }
  });

  // Search logic
  if (searchInput && searchResults) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length < 2) {
        searchResults.innerHTML = '<p class="search-info">Type at least 2 characters to search...</p>';
        return;
      }

      const matches = window.SuhaniStore.products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = '<p class="search-info">No products found matching your search.</p>';
        return;
      }

      searchResults.innerHTML = matches.map(product => `
        <a href="product.html?id=${product.id}" class="search-result-card">
          <div class="result-image">
            <img src="${product.images[0]}" alt="${product.name}">
          </div>
          <div class="result-details">
            <span class="result-category">${product.category}</span>
            <h4 class="result-title">${product.name}</h4>
            <span class="result-price">${window.SuhaniStore.formatPrice(product.price)}</span>
          </div>
        </a>
      `).join('');
    });
  }
}

/* Side Cart Drawer Management */
function initCartDrawer() {
  const cartTriggers = document.querySelectorAll(".cart-trigger");
  const cartDrawer = document.querySelector(".cart-drawer");
  const cartClose = document.querySelector(".cart-close");
  const cartOverlay = document.querySelector(".cart-overlay");

  if (!cartDrawer) return;

  const openCart = (e) => {
    if (e) e.preventDefault();
    renderCartDrawerItems();
    cartDrawer.classList.add("active");
    if (cartOverlay) cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeCart = () => {
    cartDrawer.classList.remove("active");
    if (cartOverlay) cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  cartTriggers.forEach(btn => btn.addEventListener("click", openCart));
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // Global trigger to open cart drawer
  window.openSuhaniCartDrawer = openCart;
}

/* Render Cart Items inside Drawer */
function renderCartDrawerItems() {
  const container = document.querySelector(".cart-drawer-items");
  const footerAmount = document.querySelector(".cart-drawer-total-amount");
  const cartFooter = document.querySelector(".cart-drawer-footer");
  
  if (!container) return;

  const items = window.SuhaniStore.cart.get();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <p>Your shopping bag is empty.</p>
        <a href="collection.html" class="btn btn-primary cart-close-cta">Browse Collections</a>
      </div>
    `;
    if (cartFooter) cartFooter.style.display = "none";
    
    // Add close action to empty state CTA
    const closeCta = container.querySelector(".cart-close-cta");
    if (closeCta) {
      closeCta.addEventListener("click", () => {
        const cartDrawer = document.querySelector(".cart-drawer");
        const cartOverlay = document.querySelector(".cart-overlay");
        if (cartDrawer) cartDrawer.classList.remove("active");
        if (cartOverlay) cartOverlay.classList.remove("active");
        document.body.style.overflow = "";
      });
    }
    return;
  }

  if (cartFooter) cartFooter.style.display = "block";

  container.innerHTML = items.map(item => `
    <div class="cart-drawer-item" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-meta">
          <span>Size: ${item.size}</span>
          ${item.color ? `<span>Color: ${item.color}</span>` : ''}
        </div>
        <div class="cart-item-price">${window.SuhaniStore.formatPrice(item.price)}</div>
        <div class="cart-item-actions">
          <div class="quantity-selector-mini">
            <button class="qty-btn qty-minus" onclick="adjustDrawerQty('${item.id}', '${item.size}', '${item.color}', -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn qty-plus" onclick="adjustDrawerQty('${item.id}', '${item.size}', '${item.color}', 1)">+</button>
          </div>
          <button class="cart-item-remove-btn" onclick="removeDrawerItem('${item.id}', '${item.size}', '${item.color}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  if (footerAmount) {
    footerAmount.textContent = window.SuhaniStore.formatPrice(window.SuhaniStore.cart.getTotal());
  }
}

// Global functions for inline button click handlers inside dynamically rendered cart items
window.adjustDrawerQty = (id, size, color, delta) => {
  const items = window.SuhaniStore.cart.get();
  const item = items.find(i => i.id === id && i.size === size && i.color === color);
  if (item) {
    window.SuhaniStore.cart.updateQuantity(id, size, item.quantity + delta, color);
  }
};

window.removeDrawerItem = (id, size, color) => {
  window.SuhaniStore.cart.remove(id, size, color);
};

/* Update Header Cart Badge */
function updateHeaderCartCount() {
  const counts = document.querySelectorAll(".cart-count");
  const count = window.SuhaniStore.cart.getCount();
  counts.forEach(el => {
    el.textContent = count;
    if (count > 0) {
      el.style.display = "flex";
    } else {
      el.style.display = "none";
    }
  });
}

/* Editorial Reveal on Scroll */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => observer.observe(el));
}
