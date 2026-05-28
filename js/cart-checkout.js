/* SUHANI FASHION - Cart and Checkout Controllers */

let activeStep = 1;
let deliveryFee = 0;
let promoDiscountPercentage = 0; // e.g., 0.1 for 10%

document.addEventListener("DOMContentLoaded", () => {
  // Load promo code from sessionStorage if already applied
  const storedDiscount = sessionStorage.getItem("suhani_discount");
  if (storedDiscount) {
    promoDiscountPercentage = parseFloat(storedDiscount);
  }

  // 1. Initialize Cart Page
  if (document.getElementById("cart-page-items-container")) {
    renderCartPage();
  }

  // 2. Initialize Checkout Page
  if (document.getElementById("checkout-items-summary-container")) {
    renderCheckoutPage();
    // Watch for cart changes to update checkout summary
    window.addEventListener("cartUpdated", renderCheckoutPage);
  }
});

/* ================= CART PAGE LOGIC ================= */

function renderCartPage() {
  const container = document.getElementById("cart-page-items-container");
  const summaryBox = document.getElementById("cart-page-summary-box");
  if (!container) return;

  const items = window.SuhaniStore.cart.get();

  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 60px var(--spacing-sm);">
        <p style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 20px;">Your shopping bag is empty.</p>
        <a href="collection.html" class="btn btn-primary" style="max-width:200px; margin: 0 auto;">Browse Collections</a>
      </div>
    `;
    if (summaryBox) summaryBox.style.display = "none";
    return;
  }

  if (summaryBox) summaryBox.style.display = "flex";

  container.innerHTML = items.map(item => `
    <div class="cart-page-item">
      <div class="cart-page-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-page-item-details">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h3 class="cart-page-item-title">${item.name}</h3>
            <div class="cart-item-meta">
              <span>Size: ${item.size}</span>
              ${item.color ? `<span>Color: ${item.color}</span>` : ''}
            </div>
          </div>
          <span class="cart-page-item-price">${window.SuhaniStore.formatPrice(item.price * item.quantity)}</span>
        </div>
        <div class="cart-item-actions" style="margin-top:20px;">
          <div class="quantity-selector-mini">
            <button class="qty-btn" onclick="adjustPageQty('${item.id}', '${item.size}', '${item.color}', -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="adjustPageQty('${item.id}', '${item.size}', '${item.color}', 1)">+</button>
          </div>
          <button class="cart-item-remove-btn" onclick="removePageItem('${item.id}', '${item.size}', '${item.color}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  updateCartSummaryTotals();
}

window.adjustPageQty = (id, size, color, delta) => {
  const items = window.SuhaniStore.cart.get();
  const item = items.find(i => i.id === id && i.size === size && i.color === color);
  if (item) {
    window.SuhaniStore.cart.updateQuantity(id, size, item.quantity + delta, color);
    renderCartPage();
  }
};

window.removePageItem = (id, size, color) => {
  window.SuhaniStore.cart.remove(id, size, color);
  renderCartPage();
};

function updateCartSummaryTotals() {
  const subtotal = window.SuhaniStore.cart.getTotal();
  const discount = subtotal * promoDiscountPercentage;
  const total = subtotal - discount;

  document.getElementById("cart-summary-subtotal").textContent = window.SuhaniStore.formatPrice(subtotal);
  
  const discountRow = document.getElementById("summary-discount-row");
  if (promoDiscountPercentage > 0) {
    discountRow.style.display = "flex";
    document.getElementById("cart-summary-discount").textContent = `-${window.SuhaniStore.formatPrice(discount)}`;
  } else {
    discountRow.style.display = "none";
  }

  document.getElementById("cart-summary-total").textContent = window.SuhaniStore.formatPrice(total);
}

function applyPromoDiscount() {
  const input = document.getElementById("cart-promo-code");
  const msg = document.getElementById("promo-status-msg");
  if (!input || !msg) return;

  const code = input.value.trim().toUpperCase();

  if (code === "SUHANI10" || code === "WELCOME") {
    promoDiscountPercentage = 0.1; // 10% discount
    sessionStorage.setItem("suhani_discount", "0.1");
    msg.style.display = "block";
    msg.style.color = "var(--accent-luxury)";
    msg.textContent = "Promo code applied successfully. Enjoy 10% off your purchase.";
    updateCartSummaryTotals();
  } else {
    msg.style.display = "block";
    msg.style.color = "var(--accent-premium)";
    msg.textContent = "Invalid promo code. Please check spelling.";
  }
}


/* ================= CHECKOUT PAGE LOGIC ================= */

function renderCheckoutPage() {
  const container = document.getElementById("checkout-items-summary-container");
  if (!container) return;

  const items = window.SuhaniStore.cart.get();

  if (items.length === 0) {
    // If cart is empty, redirect back to cart page unless success screen is showing
    if (!document.getElementById("checkout-success-screen").classList.contains("active")) {
      window.location.href = "cart.html";
      return;
    }
  }

  container.innerHTML = items.map(item => `
    <div class="checkout-summary-item">
      <div class="checkout-summary-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="checkout-summary-item-info">
        <h4 class="checkout-summary-item-title">${item.name}</h4>
        <div class="checkout-summary-item-meta">
          <span>Size: ${item.size}</span>
          ${item.color ? ` &bull; <span>Color: ${item.color}</span>` : ''}
          <span> &bull; Qty: ${item.quantity}</span>
        </div>
      </div>
      <span class="checkout-summary-item-price">${window.SuhaniStore.formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join('');

  updateCheckoutTotals();
}

function updateCheckoutTotals() {
  const subtotal = window.SuhaniStore.cart.getTotal();
  const discount = subtotal * promoDiscountPercentage;
  const total = subtotal - discount + deliveryFee;

  document.getElementById("checkout-summary-subtotal").textContent = window.SuhaniStore.formatPrice(subtotal);
  
  const discountRow = document.getElementById("checkout-discount-row");
  if (promoDiscountPercentage > 0) {
    discountRow.style.display = "flex";
    document.getElementById("checkout-summary-discount").textContent = `-${window.SuhaniStore.formatPrice(discount)}`;
  } else {
    discountRow.style.display = "none";
  }

  // Delivery
  const delLabel = document.getElementById("checkout-summary-delivery");
  if (deliveryFee === 0) {
    delLabel.textContent = "Complimentary";
    delLabel.style.color = "var(--accent-luxury)";
  } else {
    delLabel.textContent = window.SuhaniStore.formatPrice(deliveryFee);
    delLabel.style.color = "var(--text-primary)";
  }

  // Final Total
  document.getElementById("checkout-summary-total").textContent = window.SuhaniStore.formatPrice(total);
  
  // Pay button labels
  const payBtn = document.getElementById("pay-button-label");
  const payBtnUpi = document.getElementById("pay-button-label-upi");
  if (payBtn) payBtn.textContent = `Pay ${window.SuhaniStore.formatPrice(total)}`;
  if (payBtnUpi) payBtnUpi.textContent = `Pay ${window.SuhaniStore.formatPrice(total)}`;
}

// Stepped Checkout Navigation
function goToStep(stepNum) {
  // Hide all sections
  document.getElementById("checkout-step-1").style.display = "none";
  document.getElementById("checkout-step-2").style.display = "none";
  document.getElementById("checkout-step-3").style.display = "none";

  // Deactivate indicators
  document.getElementById("step-1-indicator").classList.remove("active", "completed");
  document.getElementById("step-2-indicator").classList.remove("active", "completed");
  document.getElementById("step-3-indicator").classList.remove("active", "completed");

  activeStep = stepNum;

  // Show selected step & configure indicators
  if (stepNum === 1) {
    document.getElementById("checkout-step-1").style.display = "block";
    document.getElementById("step-1-indicator").classList.add("active");
  } 
  else if (stepNum === 2) {
    document.getElementById("checkout-step-2").style.display = "block";
    document.getElementById("step-1-indicator").classList.add("completed");
    document.getElementById("step-2-indicator").classList.add("active");
  } 
  else if (stepNum === 3) {
    document.getElementById("checkout-step-3").style.display = "block";
    document.getElementById("step-1-indicator").classList.add("completed");
    document.getElementById("step-2-indicator").classList.add("completed");
    document.getElementById("step-3-indicator").classList.add("active");
    
    // Enable UPI input just in case switching forms later
    document.getElementById("upi-id").disabled = false;
  }
}

// Delivery Method toggle
function selectDeliveryMethod(method, cost, cardElement) {
  deliveryFee = cost;
  
  // Update UI selection
  const cards = cardElement.parentNode.querySelectorAll(".payment-method-card");
  cards.forEach(c => c.classList.remove("active"));
  cardElement.classList.add("active");
  
  // Set radio state
  cardElement.querySelector('input[type="radio"]').checked = true;

  updateCheckoutTotals();
}

// Payment method form switcher
function selectPaymentMethod(method, cardElement) {
  const cards = cardElement.parentNode.querySelectorAll(".payment-method-card");
  cards.forEach(c => c.classList.remove("active"));
  cardElement.classList.add("active");
  
  cardElement.querySelector('input[type="radio"]').checked = true;

  if (method === "card") {
    document.getElementById("payment-card-form").style.display = "block";
    document.getElementById("payment-upi-form").style.display = "none";
  } else {
    document.getElementById("payment-card-form").style.display = "none";
    document.getElementById("payment-upi-form").style.display = "block";
  }
}

// Submit Checkout Order
function submitCheckout() {
  // Generate random order number
  const orderNum = Math.floor(100000 + Math.random() * 900000);
  document.getElementById("success-order-num-label").textContent = `Order #SUH-${orderNum}`;

  // Slide success panel
  const successScreen = document.getElementById("checkout-success-screen");
  successScreen.style.display = "flex";
  
  setTimeout(() => {
    successScreen.classList.add("active");
  }, 100);
}

// Clear cart state once order finishes
function clearCartAfterSuccess() {
  window.SuhaniStore.cart.clear();
  sessionStorage.removeItem("suhani_discount");
}

// Expose handlers globally for HTML onClick hooks
window.applyPromoDiscount = applyPromoDiscount;
window.goToStep = goToStep;
window.selectDeliveryMethod = selectDeliveryMethod;
window.selectPaymentMethod = selectPaymentMethod;
window.submitCheckout = submitCheckout;
window.clearCartAfterSuccess = clearCartAfterSuccess;
