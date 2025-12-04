// ---------- Product database ----------
const products = [
  {
    id: "kdmv-hoodie",
    name: "KDMV Hoodie",
    brand: "KDMV",
    price: 32.9,
    tag: "Hoodie",
    image: "assets/photo_2025-12-04_11-40-08.jpg",
    rating: "⭐ 4.9 (86 reviews)",
    shipping: "Free Shipping • 2–4 days"
  },
  {
    id: "kdmv-tee",
    name: "KDMV Graphic Tee",
    brand: "KDMV",
    price: 19.9,
    tag: "T-Shirt",
    image: "assets/photo_2025-12-04_11-40-20.jpg",
    rating: "⭐ 4.7 (54 reviews)",
    shipping: "Free Shipping • 2–3 days"
  },
  {
    id: "ten11-outfit",
    name: "Ten11 Street Outfit",
    brand: "Ten11",
    price: 28.0,
    tag: "Top & Pants",
    image: "assets/photo_2025-12-04_11-40-26.jpg",
    rating: "⭐ 4.8 (63 reviews)",
    shipping: "Standard Shipping • 3–5 days"
  },
  {
    id: "zando-lifestyle",
    name: "Zando Lifestyle Set",
    brand: "Zando",
    price: 34.5,
    tag: "Lifestyle",
    image: "assets/photo_2025-12-04_11-40-36.jpg",
    rating: "⭐ 4.9 (102 reviews)",
    shipping: "Express Shipping • 1–3 days"
  }
];

// ---------- Global state ----------
let currentStep = 1;
let currentProduct = null;

// ---------- DOM references ----------
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const chips = document.querySelectorAll(".chip");

// Detail screen elements
const productHeroImg   = document.getElementById("productHeroImg");
const productTitle     = document.getElementById("productTitle");
const productRating    = document.getElementById("productRating");
const productPriceMain = document.getElementById("productPriceMain");
const productShipping  = document.getElementById("productShipping");
const productStore     = document.getElementById("productStore");

// Tracking screen elements
const trackingSummary      = document.getElementById("trackingSummary");
const trackingProductName  = document.getElementById("trackingProductName");
const trackingPrice        = document.getElementById("trackingPrice");

// ---------- Step navigation ----------
function internalGoToStep(step) {
  currentStep = step;
  document.querySelectorAll("[data-step]").forEach(el => {
    el.style.display = Number(el.dataset.step) === step ? "block" : "none";
  });
}

// Expose for inline HTML onclick
window.goToStep = internalGoToStep;

// ---------- Render products ----------
function renderProducts(list = products) {
  productGrid.innerHTML = "";

  if (list.length === 0) {
    productGrid.innerHTML =
      '<p style="font-size:12px;color:#9ca3af;text-align:center;">No products match your search.</p>';
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.id = p.id;

    card.innerHTML = `
      <div class="thumb" style="background-image:url('${p.image}')"></div>
      <h4>${p.name}</h4>
      <div class="price-row">
        <span class="product-tag">${p.brand}</span>
        <span class="product-price">$${p.price.toFixed(2)}</span>
      </div>
    `;

    card.addEventListener("click", () => openProduct(p.id));
    productGrid.appendChild(card);
  });
}

// ---------- Open product detail ----------
function openProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  currentProduct = p;

  productHeroImg.style.backgroundImage = `url('${p.image}')`;
  productTitle.textContent = p.name;
  productRating.textContent = p.rating;
  productPriceMain.textContent = `$${p.price.toFixed(2)}`;
  productShipping.textContent = p.shipping;
  productStore.textContent = p.brand;

  internalGoToStep(4);
}

// ---------- Search & filter ----------
function applySearchAndFilter() {
  const q = (searchInput.value || "").trim().toLowerCase();
  const activeChip = document.querySelector(".chip-active");
  const brandFilter = activeChip ? activeChip.dataset.brand : "all";

  let list = products.slice();

  if (brandFilter !== "all") {
    list = list.filter(p => p.brand.toLowerCase() === brandFilter.toLowerCase());
  }

  if (q) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q)
    );
  }

  renderProducts(list);
}

if (searchButton && searchInput) {
  searchButton.addEventListener("click", applySearchAndFilter);
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") applySearchAndFilter();
  });
}

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("chip-active"));
    chip.classList.add("chip-active");
    applySearchAndFilter();
  });
});

// ---------- Tracking ----------
function internalGoToTracking(action) {
  if (currentProduct) {
    const verb = action === "buy" ? "You are buying" : "Added to cart:";
    trackingSummary.textContent = `${verb} ${currentProduct.name}.`;
    trackingProductName.textContent = `${currentProduct.brand} • ${currentProduct.name}`;
    trackingPrice.textContent = `$${currentProduct.price.toFixed(2)}`;
  } else {
    trackingSummary.textContent = "Your order is on the way.";
    trackingProductName.textContent = "1 item • est. 18 min";
    trackingPrice.textContent = "$0.00";
  }

  internalGoToStep(5);
}

window.goToTracking = internalGoToTracking;

// ---------- Initial render ----------
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  internalGoToStep(1);
});
