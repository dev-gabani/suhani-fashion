/* SUHANI FASHION - Product Detail Page Controller */

let currentProduct = null;
let selectedSize = "";
let selectedColor = "";
let purchaseQty = 1;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Get query ID
  const params = new URLSearchParams(window.location.search);
  let prodId = params.get("id");
  
  if (!prodId) {
    prodId = "saree-01"; // Fallback default
  }

  // 2. Fetch product details
  currentProduct = window.SuhaniStore.getProductById(prodId);

  if (!currentProduct) {
    document.querySelector(".product-detail-container").innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 100px 0;">
        <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 20px;">Silhouette Not Found</h2>
        <p style="margin-bottom: 30px;">The requested design might have been archived or moved.</p>
        <a href="collection.html" class="btn btn-primary" style="max-width:200px; margin: 0 auto;">Browse Collections</a>
      </div>
    `;
    return;
  }

  // 3. Render page
  renderProductDetails();
  renderRelatedProducts();
});

// Populate layouts with data
function renderProductDetails() {
  const p = currentProduct;

  // Breadcrumbs & category labels
  document.getElementById("breadcrumb-category").href = `collection.html?category=${encodeURIComponent(p.category)}`;
  document.getElementById("breadcrumb-category").textContent = p.category;
  document.getElementById("breadcrumb-title").textContent = p.name;
  document.getElementById("product-page-category").textContent = p.category;
  document.getElementById("product-page-title").textContent = p.name;
  
  // Price formatting
  document.getElementById("product-page-price").textContent = window.SuhaniStore.formatPrice(p.price);
  
  // Ratings
  const starsHtml = '&#9733;'.repeat(Math.round(p.rating)) + '&#9734;'.repeat(5 - Math.round(p.rating));
  document.getElementById("rating-stars").innerHTML = starsHtml;
  document.getElementById("rating-count").textContent = `(${p.reviewsCount} reviews)`;

  // Description
  document.getElementById("product-page-desc").textContent = p.description;

  // Images Stack (left column)
  const imgStack = document.getElementById("product-page-images");
  imgStack.innerHTML = p.images.map(imgSrc => `
    <div class="product-stack-img-wrapper">
      <img src="${imgSrc}" alt="${p.name} Campaign View" loading="lazy">
    </div>
  `).join('');

  // Colors
  const swatchesContainer = document.getElementById("product-page-swatches");
  if (p.colors && p.colors.length > 0) {
    selectedColor = p.colors[0].name;
    document.getElementById("selected-color-label").textContent = selectedColor;
    
    swatchesContainer.innerHTML = p.colors.map((c, idx) => `
      <button class="product-color-swatch ${idx === 0 ? 'active' : ''}" 
              style="background-color: ${c.hex};" 
              data-color="${c.name}"
              onclick="selectColor('${c.name}', this)"
              aria-label="${c.name} swatch"></button>
    `).join('');
  } else {
    // Hide color section if not applicable
    swatchesContainer.closest(".product-option-section").style.display = "none";
  }

  // Sizes grid
  const sizesContainer = document.getElementById("product-page-sizes");
  selectedSize = p.sizes[0]; // Select first size by default
  
  sizesContainer.innerHTML = p.sizes.map((sz, idx) => `
    <button class="product-size-btn ${idx === 0 ? 'active' : ''}" 
            onclick="selectSize('${sz}', this)">${sz}</button>
  `).join('');

  // Accordion details
  const fabricDetails = document.getElementById("accordion-fabric-details");
  fabricDetails.innerHTML = `
    <li><strong>Composition:</strong> ${p.details.fabric}</li>
    <li><strong>Detailing:</strong> ${p.details.craft}</li>
    <li><strong>Fit:</strong> ${p.details.fit}</li>
  `;
  document.getElementById("accordion-care-details").innerHTML = p.details.care;
}

// Color select handler
function selectColor(colorName, btn) {
  selectedColor = colorName;
  document.getElementById("selected-color-label").textContent = colorName;
  
  const swatches = document.querySelectorAll(".product-color-swatch");
  swatches.forEach(s => s.classList.remove("active"));
  btn.classList.add("active");
}

// Size select handler
function selectSize(sizeName, btn) {
  selectedSize = sizeName;
  
  const sizeBtns = document.querySelectorAll(".product-size-btn");
  sizeBtns.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// Qty selectors
function adjustProductQty(delta) {
  purchaseQty = Math.max(1, purchaseQty + delta);
  document.getElementById("product-page-qty").textContent = purchaseQty;
}

// Add item to Cart state layer
function addProductToCart() {
  if (!currentProduct) return;
  
  window.SuhaniStore.cart.add(currentProduct.id, selectedSize, purchaseQty, selectedColor);
  
  // Show side cart drawer overlay
  if (typeof window.openSuhaniCartDrawer === "function") {
    window.openSuhaniCartDrawer();
  }
}

// Render 4 related products
function renderRelatedProducts() {
  const container = document.getElementById("related-products-grid");
  if (!container) return;

  // Filter products in same category, exclude current
  let related = window.SuhaniStore.products.filter(p => 
    p.category === currentProduct.category && p.id !== currentProduct.id
  );

  // If not enough related in category, pull from same collection
  if (related.length < 4) {
    const colRelated = window.SuhaniStore.products.filter(p => 
      p.collection === currentProduct.collection && p.id !== currentProduct.id && !related.some(r => r.id === p.id)
    );
    related = [...related, ...colRelated];
  }

  // Slice to max 4 items
  related = related.slice(0, 4);

  if (related.length === 0) {
    container.closest(".related-products-section").style.display = "none";
    return;
  }

  container.innerHTML = related.map(product => {
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

// Collapsible accordions handler
function toggleAccordion(element) {
  const item = element.closest('.accordion-item');
  if (item) {
    item.classList.toggle('active');
  }
}

// Size guide modal controls
function openSizeGuideModal() {
  const modal = document.getElementById("size-guide-modal-panel");
  const overlay = document.getElementById("size-guide-overlay-element");
  if (modal) {
    modal.style.display = "block";
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeSizeGuideModal() {
  const modal = document.getElementById("size-guide-modal-panel");
  const overlay = document.getElementById("size-guide-overlay-element");
  if (modal) {
    modal.style.display = "none";
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Expose handlers globally
window.selectColor = selectColor;
window.selectSize = selectSize;
window.adjustProductQty = adjustProductQty;
window.addProductToCart = addProductToCart;
window.toggleAccordion = toggleAccordion;
window.openSizeGuideModal = openSizeGuideModal;
window.closeSizeGuideModal = closeSizeGuideModal;
