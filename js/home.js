/* SUHANI FASHION - Homepage Controller (Visual Rebuild Edition) */

document.addEventListener("DOMContentLoaded", () => {
  // Render Curated Bestsellers Grid
  renderCuratedBestsellers();
});

// Render Curated list dynamically from store
function renderCuratedBestsellers() {
  const container = document.getElementById("curated-bestsellers-grid");
  if (!container) return;

  // Filter featured bestsellers
  const bestsellers = window.SuhaniStore.products.filter(p => p.featured);

  if (bestsellers.length === 0) {
    container.innerHTML = `<p class="no-products-msg">New campaign arrivals soon.</p>`;
    return;
  }

  // Display only 4 key bestsellers in a spacious grid
  const selectedBestsellers = bestsellers.slice(0, 4);

  container.innerHTML = selectedBestsellers.map(product => {
    const mainImg = product.images[0];
    const secondImg = product.images[1] || mainImg;
    const priceStr = window.SuhaniStore.formatPrice(product.price);
    
    let badgeHtml = '';
    if (product.collection === "Festive Wear") {
      badgeHtml = `<span class="product-badge product-badge-gold">Festive</span>`;
    } else if (product.id === "kurta-01") {
      badgeHtml = `<span class="product-badge">Bestseller</span>`;
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
