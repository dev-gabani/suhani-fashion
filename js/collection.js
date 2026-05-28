/* SUHANI FASHION - Collection Listing Controller */

let selectedColors = [];

document.addEventListener("DOMContentLoaded", () => {
  // Parse URL query params and pre-select filters
  parseUrlParams();
  
  // Set up mobile filters triggers
  initMobileFilters();
  
  // Initial filtering run
  applyFilters();
});

// Parse query params (e.g., ?category=Sarees or ?collection=Festive%20Wear)
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  
  // Category param
  const catParam = params.get("category");
  if (catParam) {
    const checkboxes = document.querySelectorAll('input[name="category"]');
    checkboxes.forEach(cb => {
      if (cb.value.toLowerCase() === catParam.toLowerCase()) {
        cb.checked = true;
      }
    });
    // Update main header texts
    document.getElementById("collection-page-main-title").textContent = catParam;
    if (catParam === "Sarees") {
      document.getElementById("collection-page-main-desc").textContent = "Generations of weavers, reimagined. Discover our pure Varanasi silks, light cotton Chanderis, and luxury zari details.";
    } else if (catParam === "Kurtis") {
      document.getElementById("collection-page-main-desc").textContent = "Mindful silhouettes in flax linen and breathable cotton washes, designed for effortless elegance and summer breezes.";
    } else if (catParam === "Co-ord Sets") {
      document.getElementById("collection-page-main-desc").textContent = "Asymmetric lines, soft peach-finish knits, and relaxed trousers designed for global citizens and quiet luxury.";
    }
  }

  // Collection param
  const colParam = params.get("collection");
  if (colParam) {
    const checkboxes = document.querySelectorAll('input[name="collection"]');
    checkboxes.forEach(cb => {
      if (cb.value.toLowerCase() === colParam.toLowerCase()) {
        cb.checked = true;
      }
    });
    document.getElementById("collection-page-main-title").textContent = colParam;
    if (colParam === "Festive Wear") {
      document.getElementById("collection-page-main-desc").textContent = "Woven in celebration. Explore raw silk anarkalis, handloom silk sarees, and gold tilla highlights made to make you feel beautiful.";
    } else if (colParam === "Everyday Wear") {
      document.getElementById("collection-page-main-desc").textContent = "Quiet luxury, soft drapes, and premium flax linen co-ords for everyday ease and slow luxury living.";
    }
  }
}

// Collapsible filters accordion toggle (for mobile/desktop sidebar)
function toggleFilterGroup(element) {
  const group = element.closest('.filter-group');
  if (group) {
    group.classList.toggle('active');
  }
}

// Color Swatch Selection toggle
function toggleColorFilter(element) {
  const color = element.getAttribute("data-color");
  
  element.classList.toggle("active");
  
  if (element.classList.contains("active")) {
    selectedColors.push(color);
  } else {
    selectedColors = selectedColors.filter(c => c !== color);
  }
  
  applyFilters();
}

// Mobile Filter Drawer Toggle
function initMobileFilters() {
  const openBtn = document.getElementById("mobile-filter-open-btn");
  const closeBtn = document.getElementById("mobile-filter-close-btn");
  const sidebar = document.getElementById("sidebar-filter-element");
  const overlay = document.getElementById("filter-overlay-element");
  const mobileHeader = document.getElementById("mobile-filter-header");
  const mobileFooter = document.getElementById("mobile-filter-footer");

  if (!openBtn || !sidebar) return;

  const openMobileFilters = () => {
    sidebar.classList.add("mobile-active");
    overlay.classList.add("active");
    if (mobileHeader) mobileHeader.style.display = "flex";
    if (mobileFooter) mobileFooter.style.display = "block";
    document.body.style.overflow = "hidden";
  };

  const closeMobileFilters = () => {
    sidebar.classList.remove("mobile-active");
    overlay.classList.remove("active");
    if (mobileHeader) mobileHeader.style.display = "none";
    if (mobileFooter) mobileFooter.style.display = "none";
    document.body.style.overflow = "";
  };

  openBtn.addEventListener("click", openMobileFilters);
  if (closeBtn) closeBtn.addEventListener("click", closeMobileFilters);
  if (overlay) overlay.addEventListener("click", closeMobileFilters);
  
  window.closeMobileFilters = closeMobileFilters; // expose globally
  
  // Sync mobile sort and desktop sort select values
  const mSort = document.getElementById("sort-select-mobile");
  const dSort = document.getElementById("sort-select-desktop");
  
  if (mSort && dSort) {
    mSort.addEventListener("change", (e) => {
      dSort.value = e.target.value;
      applyFilters();
    });
    dSort.addEventListener("change", (e) => {
      mSort.value = e.target.value;
    });
  }
}

// Master filter logic
function applyFilters() {
  const grid = document.getElementById("collection-products-grid");
  const countLabel = document.getElementById("products-count-label");
  if (!grid) return;

  // 1. Gather active criteria
  const activeCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
  const activeCollections = Array.from(document.querySelectorAll('input[name="collection"]:checked')).map(cb => cb.value);
  const activeFabrics = Array.from(document.querySelectorAll('input[name="fabric"]:checked')).map(cb => cb.value);
  
  // Sorting value
  const sortVal = document.getElementById("sort-select-desktop").value;

  // 2. Perform filtering
  let filtered = window.SuhaniStore.products;

  // Categories
  if (activeCategories.length > 0) {
    filtered = filtered.filter(p => activeCategories.includes(p.category));
  }

  // Collections
  if (activeCollections.length > 0) {
    filtered = filtered.filter(p => activeCollections.includes(p.collection));
  }

  // Fabrics
  if (activeFabrics.length > 0) {
    filtered = filtered.filter(p => {
      const fString = p.details.fabric.toLowerCase() + " " + p.description.toLowerCase();
      return activeFabrics.some(fab => fString.includes(fab.toLowerCase()));
    });
  }

  // Colors
  if (selectedColors.length > 0) {
    filtered = filtered.filter(p => 
      p.colors && p.colors.some(c => selectedColors.includes(c.name))
    );
  }

  // 3. Sorting
  if (sortVal === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortVal === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortVal === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // default (featured/id order)
    filtered.sort((a, b) => (a.featured ? -1 : 1) - (b.featured ? -1 : 1));
  }

  // 4. Update count label
  countLabel.textContent = `Showing ${filtered.length} product${filtered.length === 1 ? '' : 's'}`;

  // 5. Render
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-products-msg">
        <p>No products match the selected criteria.</p>
        <button class="btn btn-secondary" onclick="clearAllFilters()" style="margin-top:20px; max-width:180px;">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const mainImg = product.images[0];
    const secondImg = product.images[1] || mainImg;
    const priceStr = window.SuhaniStore.formatPrice(product.price);
    
    let badgeHtml = '';
    if (product.collection === "Festive Wear") {
      badgeHtml = `<span class="product-badge product-badge-gold">Festive</span>`;
    }

    return `
      <a href="product.html?id=${product.id}" class="product-card">
        <div class="product-image-container">
          ${badgeHtml}
          <img src="${mainImg}" alt="${product.name}" class="product-image-primary" loading="lazy">
          <img src="${secondImg}" alt="${product.name} alternate view" class="product-image-secondary" loading="lazy">
        </div>
        <div class="product-card-info">
          <span class="product-category-label">${product.category}</span>
          <h3 class="product-title-label">${product.name}</h3>
          <span class="product-price-label">${priceStr}</span>
        </div>
      </a>
    `;
  }).join('');
}

// Reset helper
function clearAllFilters() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
  
  const colorBtns = document.querySelectorAll(".color-swatch-btn");
  colorBtns.forEach(btn => btn.classList.remove("active"));
  selectedColors = [];

  document.getElementById("sort-select-desktop").value = "default";
  document.getElementById("sort-select-mobile").value = "default";

  applyFilters();
}

// Expose variables & triggers globally
window.toggleFilterGroup = toggleFilterGroup;
window.toggleColorFilter = toggleColorFilter;
window.applyFilters = applyFilters;
window.clearAllFilters = clearAllFilters;
