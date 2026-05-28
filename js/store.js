/* SUHANI FASHION - Global State & Data Store (Visual Rebuild Edition) */

const PRODUCTS = [
  {
    id: "saree-01",
    name: "Varanasi Aura Silk Saree",
    category: "Sarees",
    collection: "Festive Wear",
    price: 8499,
    rating: 4.9,
    reviewsCount: 38,
    images: [
      "assets/images/product-saree-01.png",
      "assets/images/product-saree-01-alt.png"
    ],
    description: "Tailored in the loom houses of Varanasi, this pure mulberry silk saree combines traditional craftsmanship with structural elegance. Delicate gold zari threads tracing the border capture the golden sunbeams, designed to drape you in grace.",
    details: {
      fabric: "100% Handspun Katan Silk",
      craft: "Generational Varanasi Handloom Weave",
      care: "Dry Clean Only",
      fit: "Traditional Draped Fit (6.2 meters with blouse piece)"
    },
    sizes: ["One Size"],
    colors: [
      { name: "Sindoor Wine", hex: "#6E2C3A" },
      { name: "Antique Gold", hex: "#B89A5E" }
    ],
    featured: true
  },
  {
    id: "kurta-01",
    name: "Mridu Ivory Linen Kurta",
    category: "Kurtis",
    collection: "Everyday Wear",
    price: 3299,
    rating: 4.8,
    reviewsCount: 42,
    images: [
      "assets/images/product-kurta-01.png",
      "assets/images/product-kurta-01-alt.png"
    ],
    description: "An everyday luxury crafted from pre-washed organic flax linen. Features loose drops, minimal clean seams, and a soft, lived-in feel. Tailored with a drop shoulder and subtle slit detail for quiet moments and slow living.",
    details: {
      fabric: "100% Organic Belgian Flax Linen",
      craft: "Pre-shrunk, bio-enzyme washed",
      care: "Gentle wash cold, dry flat",
      fit: "Relaxed, editorial drape"
    },
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Warm Ivory", hex: "#F6F1E8" },
      { name: "Muted Rose", hex: "#C9A9A6" }
    ],
    featured: true
  },
  {
    id: "coord-01",
    name: "Sienna Drape Co-ord Set",
    category: "Co-ord Sets",
    collection: "Everyday Wear",
    price: 4999,
    rating: 4.7,
    reviewsCount: 29,
    images: [
      "assets/images/product-coord-01.png",
      "assets/images/product-coord-01-alt.png"
    ],
    description: "Minimalist two-piece set featuring pleated wide-leg trousers and an asymmetric draped tunic. Woven from premium soft peach-finish knit for maximum drape, travel convenience, and understated luxury.",
    details: {
      fabric: "Premium Lyocell Blend",
      craft: "Flatlock stitching, enzyme wash",
      care: "Machine wash cold, line dry",
      fit: "Loose asymmetric drape"
    },
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Espresso Brown", hex: "#2B1F1A" },
      { name: "Sandstone Beige", hex: "#DCCDB8" }
    ],
    featured: true
  },
  {
    id: "ethnic-01",
    name: "Zoya Georgette Festive Anarkali Set",
    category: "Ethnic Sets",
    collection: "Festive Wear",
    price: 7299,
    rating: 4.9,
    reviewsCount: 54,
    images: [
      "assets/images/product-ethnic-01.png",
      "assets/images/product-saree-01-alt.png"
    ],
    description: "A flowing canvas of elegance. Tailored from fine viscose georgette with an expansive flare, completed with sheer organza dupattas highlighted by hand-done tilla borders. Spells luxury in every stride.",
    details: {
      fabric: "Fine Georgette with Organza details",
      craft: "Hand-done gold Tilla embroidery",
      care: "Dry Clean Only",
      fit: "Fitted bodice, sweeping flare"
    },
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sindoor Wine", hex: "#6E2C3A" },
      { name: "Soft Muted Rose", hex: "#C9A9A6" }
    ],
    featured: true
  },
  {
    id: "dress-01",
    name: "Bahaar Editorial Maxi Dress",
    category: "Women's Fashion",
    collection: "Festive Wear",
    price: 5499,
    rating: 4.9,
    reviewsCount: 21,
    images: [
      "assets/images/product-dress-01.png",
      "assets/images/campaign-everyday.png"
    ],
    description: "Fluid grace in motion. Merges bohemian freedom with Indian textile prints. Woven from lightweight cotton-silk, it boasts a tiered shape, comfortable cotton linings, and natural sunlit hues.",
    details: {
      fabric: "Silk-Cotton Voile Blend",
      craft: "Teak block hand-painted motifs",
      care: "Dry clean or gentle hand wash",
      fit: "Tiered A-line editorial drape"
    },
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Muted Rose", hex: "#C9A9A6" },
      { name: "Warm Ivory", hex: "#F6F1E8" }
    ],
    featured: false
  },
  {
    id: "dupatta-01",
    name: "Aarya Handloom Chanderi Dupatta",
    category: "Dupattas",
    collection: "Festive Wear",
    price: 2499,
    rating: 4.8,
    reviewsCount: 15,
    images: [
      "assets/images/product-dupatta-01.png",
      "assets/images/fabric-closeup.png"
    ],
    description: "A lightweight, airy, and semi-sheer silk dupatta woven in Chanderi. Trimmed with gold zari stripes and custom hand-tied tassels. The perfect premium accent to drape over solid kurtas.",
    details: {
      fabric: "Chanderi Silk Cotton",
      craft: "Handloom jacquard borders",
      care: "Dry Clean Only",
      fit: "Standard length (2.5 meters)"
    },
    sizes: ["One Size"],
    colors: [
      { name: "Antique Gold", hex: "#B89A5E" },
      { name: "Warm Ivory", hex: "#F6F1E8" }
    ],
    featured: false
  }
];

/* Cart Management Layer */
const CartState = {
  get() {
    try {
      const cart = localStorage.getItem("suhani_cart");
      return cart ? JSON.parse(cart) : [];
    } catch (e) {
      console.error("Failed to load cart", e);
      return [];
    }
  },

  save(cart) {
    try {
      localStorage.setItem("suhani_cart", JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  },

  add(productId, size, quantity = 1, colorName = "") {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const cart = this.get();
    const existingIndex = cart.findIndex(item => item.id === productId && item.size === size && item.color === colorName);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: size,
        color: colorName || (product.colors && product.colors[0] ? product.colors[0].name : ""),
        quantity: quantity
      });
    }

    this.save(cart);
  },

  remove(productId, size, colorName = "") {
    let cart = this.get();
    cart = cart.filter(item => !(item.id === productId && item.size === size && item.color === colorName));
    this.save(cart);
  },

  updateQuantity(productId, size, quantity, colorName = "") {
    if (quantity <= 0) {
      this.remove(productId, size, colorName);
      return;
    }

    const cart = this.get();
    const item = cart.find(item => item.id === productId && item.size === size && item.color === colorName);
    if (item) {
      item.quantity = quantity;
      this.save(cart);
    }
  },

  clear() {
    this.save([]);
  },

  getTotal() {
    return this.get().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getCount() {
    return this.get().reduce((sum, item) => sum + item.quantity, 0);
  }
};

window.SuhaniStore = {
  products: PRODUCTS,
  cart: CartState,
  getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
  },
  getProductsByCategory(cat) {
    return PRODUCTS.filter(p => p.category.toLowerCase() === cat.toLowerCase());
  },
  getProductsByCollection(col) {
    return PRODUCTS.filter(p => p.collection.toLowerCase() === col.toLowerCase());
  },
  formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
};
