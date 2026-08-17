const PRODUCTS = [
  {
    id: 1,
    name: "Rhone Holder",
    cat: "Accessories",
    price: 29.90,
    img: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Headset Pro",
    cat: "Audio",
    price: 82.00,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Aqua Cleaner",
    cat: "Smart Home",
    price: 29.90,
    img: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "CCTV Mini",
    cat: "Smart Home",
    price: 60.00,
    img: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Shuffle Plug",
    cat: "Accessories",
    price: 9.90,
    img: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Shuffla R75",
    cat: "Tech",
    price: 34.30,
    img: "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "TWS Buds",
    cat: "Audio",
    price: 29.90,
    img: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Headset White",
    cat: "Audio",
    price: 52.00,
    img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 9,
    name: "Studio Speaker",
    cat: "Audio",
    price: 129.00,
    img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=700&q=80"
  }
];

const state = {
  cart: JSON.parse(localStorage.getItem("shop-cart") || "[]"),
  favorites: JSON.parse(localStorage.getItem("shop-favs") || "[]")
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function money(number) {
  return "$" + number.toFixed(2);
}

function save() {
  localStorage.setItem("shop-cart", JSON.stringify(state.cart));
  localStorage.setItem("shop-favs", JSON.stringify(state.favorites));
  updateCount();
}

function updateCount() {
  const count = state.cart.reduce((total, item) => total + item.qty, 0);

  $$(".cart-count").forEach((element) => {
    element.textContent = count;
  });
}

function productCard(product) {
  const favorite = state.favorites.includes(product.id);

  return `
    <article class="card reveal" data-product="${product.id}">

      <button
        class="heart ${favorite ? "active" : ""}"
        onclick="toggleFav(event, ${product.id})">
        ${favorite ? "♥" : "♡"}
      </button>

      <div
        class="product-image"
        onclick="openProduct(${product.id})">
        <img src="${product.img}" alt="${product.name}">
      </div>

      <div class="card-body">

        <span class="tag">${product.cat}</span>

        <h3>${product.name}</h3>

        <div class="rating">
          ★★★★★ <span>(24)</span>
        </div>

        <div class="price-row">

          <span class="price">
            ${money(product.price)}
          </span>

          <button
            class="add"
            onclick="addToCart(event, ${product.id})">
            Add to cart
          </button>

        </div>

      </div>
    </article>
  `;
}

function renderProducts(products = PRODUCTS) {
  const grid = $("#productGrid");

  if (!grid) return;

  grid.innerHTML = products
    .map(productCard)
    .join("");

  observeReveal();
}

function addToCart(event, id) {
  if (event) {
    event.stopPropagation();
  }

  const product = PRODUCTS.find((item) => item.id === id);

  if (!product) return;

  const existing = state.cart.find((item) => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({
      id: id,
      qty: 1
    });
  }

  save();

  toast(`${product.name} added to cart`);
}

function toggleFav(event, id) {
  event.stopPropagation();

  if (state.favorites.includes(id)) {
    state.favorites = state.favorites.filter(
      (item) => item !== id
    );
  } else {
    state.favorites.push(id);
  }

  save();

  renderProducts(currentFiltered || PRODUCTS);
}

let currentFiltered = PRODUCTS;

function filterProducts() {
  const searchInput = $("#productSearch");

  const query = searchInput
    ? searchInput.value.toLowerCase()
    : "";

  const activeCategory = $(".filter-btn.active");

  const category = activeCategory
    ? activeCategory.dataset.cat
    : "All";

  currentFiltered = PRODUCTS.filter((product) => {

    const matchesCategory =
      category === "All" ||
      product.cat === category;

    const matchesSearch =
      `${product.name} ${product.cat}`
        .toLowerCase()
        .includes(query);

    return matchesCategory && matchesSearch;
  });

  renderProducts(currentFiltered);
}

function openProduct(id) {
  const product = PRODUCTS.find(
    (item) => item.id === id
  );

  if (!product) return;

  openModal(`
    <div
      class="product-image"
      style="
        height:260px;
        border-radius:15px;
        margin-bottom:18px;
      "
    >
      <img
        src="${product.img}"
        alt="${product.name}"
      >
    </div>

    <span class="tag">
      ${product.cat}
    </span>

    <h2>${product.name}</h2>

    <p>
      Designed for everyday use with a clean,
      modern feel. A customer favorite from
      our latest collection.
    </p>

    <div class="price-row">

      <span class="price">
        ${money(product.price)}
      </span>

      <button
        class="btn"
        onclick="
          addToCart(null, ${product.id});
          closeModal();
        "
      >
        Add to Cart
      </button>

    </div>
  `);
}

function openModal(content) {
  const modal = $("#modal");
  const backdrop = $("#modalBackdrop");

  if (!modal || !backdrop) return;

  modal.innerHTML = `
    <div class="modal">

      <button
        class="close"
        onclick="closeModal()">
        ×
      </button>

      ${content}

    </div>
  `;

  backdrop.classList.add("show");
}

function closeModal() {
  const backdrop = $("#modalBackdrop");

  if (backdrop) {
    backdrop.classList.remove("show");
  }
}

function renderCart() {
  let total = 0;

  const items = state.cart
    .map((cartItem) => {

      const product = PRODUCTS.find(
        (item) => item.id === cartItem.id
      );

      if (!product) return "";

      total += product.price * cartItem.qty;

      return `
        <div class="cart-item">

          <img
            src="${product.img}"
            alt="${product.name}"
          >

          <div>

            <strong>
              ${product.name}
            </strong>

            <div class="qty">

              <button
                onclick="changeQty(${product.id}, -1)">
                −
              </button>

              ${cartItem.qty}

              <button
                onclick="changeQty(${product.id}, 1)">
                +
              </button>

            </div>

          </div>

          <strong>
            ${money(product.price * cartItem.qty)}
          </strong>

        </div>
      `;
    })
    .join("");

  openModal(`
    <h2>Your Cart</h2>

    ${items ||
    "<p>Your cart is empty. Add something cute!</p>"
    }

    <div class="cart-total">
      <span>Total</span>
      <span>${money(total)}</span>
    </div>

    ${items
      ? `
          <button
            class="btn"
            onclick="
              toast('Order flow ready!');
              closeModal();
            "
          >
            Checkout
          </button>
        `
      : ""
    }
  `);
}

function changeQty(id, amount) {
  const item = state.cart.find(
    (cartItem) => cartItem.id === id
  );

  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    state.cart = state.cart.filter(
      (cartItem) => cartItem.id !== id
    );
  }

  save();

  renderCart();
}

function toast(message) {
  const element = $("#toast");

  if (!element) return;

  element.textContent = message;

  element.classList.add("show");

  setTimeout(() => {
    element.classList.remove("show");
  }, 1800);
}

function observeReveal() {
  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.08
    }
  );

  $$(".reveal:not(.visible)").forEach(
    (element) => observer.observe(element)
  );
}

function openSearch() {

  openModal(`
    <h2>Search Shop</h2>

    <div
      class="searchbox"
      style="
        max-width:none;
        margin:15px 0;
      "
    >
      <input
        id="modalSearch"
        placeholder="Search products..."
        autofocus
      >
    </div>

    <div id="searchResults"></div>
  `);

  const input = $("#modalSearch");

  if (!input) return;

  const search = () => {

    const query =
      input.value.toLowerCase();

    const results = PRODUCTS.filter(
      (product) =>
        `${product.name} ${product.cat}`
          .toLowerCase()
          .includes(query)
    );

    $("#searchResults").innerHTML =
      results.map(productCard).join("");
  };

  input.addEventListener("input", search);

  search();
}

function blogFilter(category) {

  $$(".pill").forEach((button) => {

    button.classList.toggle(
      "active",
      button.dataset.cat === category
    );

  });

  $$(".article-card").forEach((article) => {

    article.style.display =
      category === "All" ||
        article.dataset.cat === category
        ? ""
        : "none";

  });
}

function readArticle(title, body) {

  openModal(`
    <span class="tag">
      FEATURED ARTICLE
    </span>

    <h2>${title}</h2>

    <p
      style="
        margin:16px 0;
        line-height:1.8;
      "
    >
      ${body}
    </p>

    <button
      class="btn"
      onclick="closeModal()"
    >
      Back to Blog
    </button>
  `);
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateCount();

    renderProducts();

    observeReveal();

    $$(".filter-btn").forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            $$(".filter-btn").forEach(
              (item) =>
                item.classList.remove("active")
            );

            button.classList.add("active");

            filterProducts();
          }
        );

      }
    );

    $("#productSearch")
      ?.addEventListener(
        "input",
        filterProducts
      );

    $("#cartBtn")
      ?.addEventListener(
        "click",
        renderCart
      );

    $("#searchBtn")
      ?.addEventListener(
        "click",
        openSearch
      );

    $("#modalBackdrop")
      ?.addEventListener(
        "click",
        (event) => {

          if (
            event.target.id ===
            "modalBackdrop"
          ) {
            closeModal();
          }

        }
      );

    $("#newsletter")
      ?.addEventListener(
        "submit",
        (event) => {

          event.preventDefault();

          toast("You're on the list ✨");

          event.target.reset();

        }
      );

  }
);
const themeBtn = document.getElementById('theme-btn');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      themeBtn.textContent = '☀️ Light Mode';
    } else {
      themeBtn.textContent = '🌙 Dark Mode';
    }
  });
}
// Dark Mode Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-btn');

  // Check saved preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeBtn) themeBtn.textContent = '☀️ Light Mode';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');

      if (document.body.classList.contains('dark-mode')) {
        themeBtn.textContent = '☀️ Light Mode';
        localStorage.setItem('theme', 'dark');
      } else {
        themeBtn.textContent = '🌙 Dark Mode';
        localStorage.setItem('theme', 'light');
      }
    });
  }
});