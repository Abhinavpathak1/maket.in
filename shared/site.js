(() => {
  const data = window.MarketDemoData;
  const root = document.getElementById("site-app");
  const prefix = document.body.dataset.root || "./";
  const page = root.dataset.page;
  const storeKeys = {
    products: "market-demo-products-v1",
    cart: "market-demo-cart-v1",
    orders: "market-demo-orders-v1",
    profile: "market-demo-profile-v1",
    language: "market-demo-language-v1",
    tickets: "market-demo-tickets-v1"
  };

  function readStore(key, fallback) {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Could not read saved Market.in data for ${key}.`, error);
      return fallback;
    }
  }

  function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  let products = readStore(storeKeys.products, null);
  if (!Array.isArray(products)) {
    products = data.products;
    writeStore(storeKeys.products, products);
  }
  let cart = readStore(storeKeys.cart, []);
  let orders = readStore(storeKeys.orders, data.orders);
  let profile = readStore(storeKeys.profile, null);

  const url = (path) => `${prefix}${path}`;
  const money = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  const productById = (id) => products.find((product) => product.id === id);
  const cartQuantity = () => cart.reduce((count, item) => count + item.quantity, 0);

  function setTitle(title) {
    document.title = `${title} | Market.in`;
  }

  function productCard(product, admin = false) {
    return `
      <article class="product-card">
        <a class="product-image" href="${url(`itemdetailes/itemdetailes.html?id=${encodeURIComponent(product.id)}`)}">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
          ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
        </a>
        <div class="product-info">
          <span class="product-category">${escapeHtml(product.category)}</span>
          <h3><a href="${url(`itemdetailes/itemdetailes.html?id=${encodeURIComponent(product.id)}`)}">${escapeHtml(product.name)}</a></h3>
          <div class="rating">★ ${escapeHtml(product.rating || "4.5")} <span class="muted">(${Number(product.reviews || 0).toLocaleString("en-IN")})</span></div>
          <div class="product-price">${money(product.price)}</div>
          <div class="inline-actions">
            <button class="button" data-add="${escapeHtml(product.id)}">Add to cart</button>
            ${admin ? `<button class="button button-secondary" data-delete="${escapeHtml(product.id)}" aria-label="Delete ${escapeHtml(product.name)}">Delete</button>` : ""}
          </div>
        </div>
      </article>`;
  }

  function productGrid(items, admin = false) {
    return items.length
      ? `<div class="product-grid">${items.map((product) => productCard(product, admin)).join("")}</div>`
      : `<div class="empty-state"><h2>No products found</h2><p>Try a different search or browse all products.</p><a class="button" href="${url("index.html")}">Browse the shop</a></div>`;
  }

  function renderHeader() {
    const name = profile?.name ? `Hi, ${escapeHtml(profile.name.split(" ")[0])}` : "Sign in";
    return `
      <header class="site-header">
        <div class="header-main">
          <a class="brand" href="${url("index.html")}">market<span>.in</span></a>
          <form class="search-form" id="site-search" role="search">
            <input name="q" type="search" aria-label="Search products" placeholder="Search 50 demo products..." value="${escapeHtml(new URLSearchParams(location.search).get("q") || "")}">
            <button aria-label="Search">⌕</button>
          </form>
          <div class="header-actions">
            <a class="header-action" href="${url("account/account.html")}">${name}</a>
            <a class="header-action" href="${url("order/orders.html")}">Orders</a>
            <a class="header-action cart-action" href="${url("itemcart/itemcart.html")}">Cart <span class="cart-count">${cartQuantity()}</span></a>
          </div>
        </div>
        <nav class="category-nav" aria-label="Main navigation">
          <div class="category-nav-inner">
            <a href="${url("index.html")}">Home</a>
            <a href="${url("bestseller/bestseller.html")}">Best sellers</a>
            ${[...new Set(data.products.map((product) => product.category))].map((category) => `<a href="${url(`searchresult/searchresult.html?category=${encodeURIComponent(category)}`)}">${escapeHtml(category)}</a>`).join("")}
            <a href="${url("addproduct/productlist.html")}">All products</a>
            <a href="${url("custoreserves/custoreserves.html")}">Help</a>
          </div>
        </nav>
      </header>`;
  }

  function renderFooter() {
    return `
      <footer class="site-footer">
        <div class="footer-inner">
          <div><strong>market.in</strong><p class="muted">Everyday finds. Thoughtfully selected.</p></div>
          <nav class="footer-links" aria-label="Footer">
            <a href="${url("account/account.html")}">Your account</a>
            <a href="${url("order/orders.html")}">Your orders</a>
            <a href="${url("lang/lang.html")}">Language</a>
            <a href="${url("custoreserves/custoreserves.html")}">Customer service</a>
          </nav>
          <small>Demo storefront · © 2026 Market.in</small>
        </div>
      </footer>`;
  }

  function renderHome() {
    setTitle("Shop");
    const query = new URLSearchParams(location.search).get("q")?.trim().toLowerCase();
    const visibleProducts = query
      ? products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query))
      : products;
    return `
      ${query ? `<div class="section-head"><div><h1>Search results for “${escapeHtml(query)}”</h1><p>${visibleProducts.length} items from our demo catalogue</p></div></div>` : `
        <section class="hero">
          <div class="hero-copy"><span class="eyebrow">Good things, found here</span><h1>Little upgrades. Big everyday energy.</h1><p>Explore 50 hand-picked demo products across the categories you love, all in one place.</p><a class="button" href="#catalogue">Explore the collection</a></div>
          <div class="hero-art" role="img" aria-label="A curated selection of lifestyle products"></div>
        </section>
        <div class="category-chips">${[...new Set(products.map((product) => product.category))].map((category) => `<a class="chip" href="${url(`searchresult/searchresult.html?category=${encodeURIComponent(category)}`)}">${escapeHtml(category)}</a>`).join("")}<a class="chip" href="${url("bestseller/bestseller.html")}">Best sellers</a></div>
        <div class="section-head" id="catalogue"><div><h2>Popular right now</h2><p>50 demo products ready to explore</p></div><a class="button button-secondary" href="${url("bestseller/bestseller.html")}">Browse best sellers</a></div>`}
      ${productGrid(visibleProducts)}`;
  }

  function renderSearchResults() {
    const params = new URLSearchParams(location.search);
    const query = (params.get("q") || "").trim().toLowerCase();
    const category = params.get("category") || "";
    const matching = products.filter((product) => {
      const matchesQuery = !query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
      return matchesQuery && (!category || product.category === category);
    });
    setTitle("Browse products");
    return `
      <div class="section-head"><div><span class="eyebrow">The collection</span><h1>${category ? escapeHtml(category) : "Browse products"}</h1><p>${matching.length} products ${query ? `matching “${escapeHtml(query)}”` : "in the demo catalogue"}</p></div></div>
      <div class="toolbar"><a class="chip ${!category ? "active" : ""}" href="${url("searchresult/searchresult.html")}">All products</a>${[...new Set(products.map((product) => product.category))].map((item) => `<a class="chip ${category === item ? "active" : ""}" href="${url(`searchresult/searchresult.html?category=${encodeURIComponent(item)}`)}">${escapeHtml(item)}</a>`).join("")}<label class="field" style="margin:0 0 0 auto">Sort by <select id="sort-products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select></label></div>
      <div id="product-results">${productGrid(matching)}</div>`;
  }

  function renderProductDetail() {
    const id = new URLSearchParams(location.search).get("id");
    const product = productById(id) || products[0];
    setTitle(product.name);
    const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
    return `
      <div class="section-head"><div><a class="muted" href="${url("index.html")}">Home</a><h1>${escapeHtml(product.name)}</h1></div></div>
      <div class="content-card detail-layout" style="max-width:100%">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" style="width:100%;max-height:430px;object-fit:cover;border-radius:12px">
        <div><span class="product-category">${escapeHtml(product.category)}</span><h2>${escapeHtml(product.name)}</h2><div class="rating">★ ${escapeHtml(product.rating || "4.5")} <span class="muted">(${Number(product.reviews || 0).toLocaleString("en-IN")} reviews)</span></div><p class="muted" style="line-height:1.7">${escapeHtml(product.description)}</p><div class="product-price">${money(product.price)}</div><p class="muted">Demo item · Easy returns · Secure checkout preview</p><button class="button" data-add="${escapeHtml(product.id)}">Add to cart</button></div>
      </div>
      <div class="section-head"><div><h2>More from ${escapeHtml(product.category)}</h2></div></div>${productGrid(related)}`;
  }

  function renderCart() {
    setTitle("Your cart");
    const lines = cart.map((item) => ({ ...item, product: productById(item.id) })).filter((item) => item.product);
    const subtotal = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const items = lines.map(({ product, quantity }) => `
      <div class="cart-line">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
        <div><h3><a href="${url(`itemdetailes/itemdetailes.html?id=${encodeURIComponent(product.id)}`)}">${escapeHtml(product.name)}</a></h3><span class="muted">${money(product.price)} each</span><div class="quantity-control"><button data-quantity="${escapeHtml(product.id)}" data-delta="-1" aria-label="Remove one">−</button><span>${quantity}</span><button data-quantity="${escapeHtml(product.id)}" data-delta="1" aria-label="Add one">+</button><button class="button-secondary" data-remove="${escapeHtml(product.id)}">Remove</button></div></div>
        <strong>${money(product.price * quantity)}</strong>
      </div>`).join("");
    return `
      <div class="section-head"><div><span class="eyebrow">Shopping bag</span><h1>Your cart</h1><p>${cartQuantity()} items</p></div></div>
      ${lines.length ? `<div class="cart-layout"><section class="content-card" style="max-width:none">${items}</section><aside class="summary-card"><h2>Order summary</h2><div class="summary-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="summary-line"><span>Delivery</span><span>Free</span></div><div class="summary-line total"><span>Total</span><span>${money(subtotal)}</span></div><button class="button" style="width:100%" data-checkout>Place demo order</button><p class="muted" style="font-size:12px">Demo checkout saves your order in this browser only.</p></aside></div>` : `<div class="empty-state"><h2>Your cart is waiting</h2><p>Add a few favourites and they will show up here.</p><a class="button" href="${url("index.html")}">Explore products</a></div>`}`;
  }

  function renderOrders(limit) {
    const shownOrders = limit ? orders.slice(0, limit) : orders;
    return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Order</th><th>Item</th><th>Date</th><th>Status</th><th>Total</th></tr></thead><tbody>${shownOrders.map((order) => `<tr><td>${escapeHtml(order.id)}</td><td>${escapeHtml(order.name)}</td><td>${escapeHtml(order.date)}</td><td><span class="status-pill">${escapeHtml(order.status)}</span></td><td>${money(order.price)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  function renderAccount() {
    setTitle("Your account");
    const displayName = profile?.name || "Demo shopper";
    return `<div class="section-head"><div><span class="eyebrow">Your space</span><h1>Welcome, ${escapeHtml(displayName)}</h1><p>Manage your demo account and keep track of your shopping.</p></div><a class="button button-secondary" href="${url("Login/login.html")}">${profile ? "Switch account" : "Sign in"}</a></div>
      <div class="account-links"><a class="account-link" href="${url("order/orders.html")}"><strong>Your orders</strong><span>Track, return or reorder items</span></a><a class="account-link" href="${url("itemcart/itemcart.html")}"><strong>Your cart</strong><span>${cartQuantity()} items saved for later</span></a><a class="account-link" href="${url("lang/lang.html")}"><strong>Language preferences</strong><span>Choose your preferred language</span></a></div>
      <div class="section-head"><div><h2>Recent demo orders</h2><p>Sample data for exploring the orders section</p></div><a href="${url("order/orders.html")}">View all 50 orders →</a></div>${renderOrders(5)}`;
  }

  function renderOrderPage() {
    setTitle("Your orders");
    return `<div class="section-head"><div><span class="eyebrow">Your purchases</span><h1>Your orders</h1><p>50 sample orders are included so you can explore a populated account.</p></div></div>${renderOrders()}`;
  }

  function renderProductList() {
    setTitle("All products");
    return `<div class="section-head"><div><span class="eyebrow">Store catalogue</span><h1>All products</h1><p>${products.length} demo products · Added items are saved in this browser</p></div><a class="button" href="${url("addproduct/addprouct.html")}">Add a product</a></div>${productGrid(products, true)}`;
  }

  function renderAddProduct() {
    setTitle("Add a product");
    return `<div class="section-head"><div><span class="eyebrow">Store tools</span><h1>Add a product</h1><p>New demo products are added to the shared catalogue in this browser.</p></div><a class="button button-secondary" href="${url("addproduct/productlist.html")}">View all products</a></div>
      <form class="form-card" id="add-product-form"><label class="field">Product name<input name="name" required maxlength="100" placeholder="e.g. Everyday travel mug"></label><div class="field-row"><label class="field">Category<select name="category" required>${[...new Set(products.map((product) => product.category))].map((category) => `<option>${escapeHtml(category)}</option>`).join("")}<option>Other</option></select></label><label class="field">Price (₹)<input name="price" type="number" min="1" step="1" required placeholder="999"></label></div><label class="field">Image URL<input name="image" type="url" placeholder="https://..."></label><label class="field">Description<textarea name="description" maxlength="400" placeholder="A short description"></textarea></label><button class="button">Save product</button></form>`;
  }

  function renderSupport() {
    setTitle("Customer service");
    return `<div class="section-head"><div><span class="eyebrow">We are here to help</span><h1>Customer service</h1><p>Browse 50 sample help topics or send a demo support request.</p></div></div>
      <div class="content-card" style="max-width:none;margin-bottom:24px"><h2>Frequently asked questions</h2><div class="faq-list">${data.faqs.map((faq) => `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`).join("")}</div></div>
      <form class="form-card" id="support-form"><h2>Contact support</h2><p class="muted">This demo form saves your request locally and does not send it to a support team.</p><label class="field">Email<input type="email" name="email" required placeholder="you@example.com"></label><label class="field">How can we help?<textarea name="message" required maxlength="1000" placeholder="Tell us what you need help with"></textarea></label><button class="button">Save demo request</button></form>`;
  }

  function renderLanguage() {
    setTitle("Language settings");
    const selected = readStore(storeKeys.language, "English");
    return `<div class="section-head"><div><span class="eyebrow">Preferences</span><h1>Language settings</h1><p>Choose the language used for this demo experience.</p></div></div><form class="form-card" id="language-form"><label class="field">Preferred language<select name="language">${["English", "Hindi", "Bengali", "Tamil", "Telugu"].map((language) => `<option ${selected === language ? "selected" : ""}>${language}</option>`).join("")}</select></label><button class="button">Save preference</button></form>`;
  }

  function renderAuth(signup) {
    setTitle(signup ? "Create account" : "Sign in");
    return `<div class="section-head"><div><span class="eyebrow">Market.in demo</span><h1>${signup ? "Create your account" : "Sign in"}</h1><p>Use this local demo account to personalise the storefront.</p></div></div><form class="form-card" id="auth-form" data-signup="${signup}">${signup ? `<label class="field">Name<input name="name" required maxlength="80" autocomplete="name" placeholder="Your name"></label>` : ""}<label class="field">Email<input name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label><label class="field">Password<input name="password" type="password" minlength="4" required autocomplete="${signup ? "new-password" : "current-password"}" placeholder="At least 4 characters"></label><button class="button">${signup ? "Create demo account" : "Sign in"}</button><p class="muted" style="font-size:12px">Demo only: passwords are not saved or sent anywhere.</p><p>${signup ? `Already have an account? <a href="${url("Login/login.html")}">Sign in</a>` : `New to Market.in? <a href="${url("signup/signup.html")}">Create an account</a>`}</p></form>`;
  }

  const routes = {
    home: renderHome,
    bestseller: () => {
      setTitle("Best sellers");
      return `<div class="section-head"><div><span class="eyebrow">Loved by shoppers</span><h1>Best sellers</h1><p>Browse all 50 demo products, sorted by customer rating.</p></div></div>${productGrid([...products].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews))}`;
    },
    search: renderSearchResults,
    product: renderProductDetail,
    cart: renderCart,
    account: renderAccount,
    orders: renderOrderPage,
    productlist: renderProductList,
    addproduct: renderAddProduct,
    support: renderSupport,
    language: renderLanguage,
    login: () => renderAuth(false),
    signup: () => renderAuth(true)
  };

  root.innerHTML = `${renderHeader()}<main class="page-wrap">${(routes[page] || renderHome)()}</main>${renderFooter()}`;

  function refresh() {
    const scrollY = window.scrollY;
    root.innerHTML = `${renderHeader()}<main class="page-wrap">${(routes[page] || renderHome)()}</main>${renderFooter()}`;
    window.scrollTo(0, scrollY);
  }

  function addToCart(id) {
    const product = productById(id);
    if (!product) return;
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ id, quantity: 1 });
    writeStore(storeKeys.cart, cart);
    refresh();
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-add], [data-quantity], [data-remove], [data-delete], [data-checkout]");
    if (!target) return;
    if (target.dataset.add) addToCart(target.dataset.add);
    if (target.dataset.quantity) {
      const item = cart.find((entry) => entry.id === target.dataset.quantity);
      if (item) item.quantity += Number(target.dataset.delta);
      cart = cart.filter((entry) => entry.quantity > 0);
      writeStore(storeKeys.cart, cart);
      refresh();
    }
    if (target.dataset.remove) {
      cart = cart.filter((entry) => entry.id !== target.dataset.remove);
      writeStore(storeKeys.cart, cart);
      refresh();
    }
    if (target.dataset.delete) {
      products = products.filter((product) => product.id !== target.dataset.delete);
      writeStore(storeKeys.products, products);
      refresh();
    }
    if (target.hasAttribute("data-checkout")) {
      const newOrders = cart.map((item, index) => {
        const product = productById(item.id);
        return {
          id: `MK-${Date.now()}-${index + 1}`,
          productId: product.id,
          name: `${product.name}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`,
          category: product.category,
          price: product.price * item.quantity,
          status: "Processing",
          date: new Date().toISOString().slice(0, 10)
        };
      });
      orders = [...newOrders, ...orders];
      writeStore(storeKeys.orders, orders);
      cart = [];
      writeStore(storeKeys.cart, cart);
      location.href = url("order/orders.html");
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (form.id === "site-search") {
      event.preventDefault();
      const query = new FormData(form).get("q").trim();
      location.href = url(`searchresult/searchresult.html?q=${encodeURIComponent(query)}`);
    }
    if (form.id === "add-product-form") {
      event.preventDefault();
      const fields = new FormData(form);
      const name = fields.get("name").trim();
      const price = Number(fields.get("price"));
      if (!name || !Number.isFinite(price) || price <= 0) return;
      products.unshift({
        id: `custom-${Date.now()}`,
        name,
        category: fields.get("category"),
        description: fields.get("description").trim() || "A new item in the Market.in demo catalogue.",
        price,
        rating: 4.5,
        reviews: 0,
        image: fields.get("image").trim() || data.products[0].image,
        badge: "New"
      });
      writeStore(storeKeys.products, products);
      location.href = url("addproduct/productlist.html");
    }
    if (form.id === "support-form") {
      event.preventDefault();
      const tickets = readStore(storeKeys.tickets, []);
      const fields = new FormData(form);
      tickets.unshift({ id: `T-${Date.now()}`, email: fields.get("email"), message: fields.get("message"), createdAt: new Date().toISOString() });
      writeStore(storeKeys.tickets, tickets);
      form.insertAdjacentHTML("afterbegin", '<div class="notice" role="status">Your demo request was saved in this browser.</div>');
      form.reset();
    }
    if (form.id === "language-form") {
      event.preventDefault();
      writeStore(storeKeys.language, new FormData(form).get("language"));
      form.insertAdjacentHTML("afterbegin", '<div class="notice" role="status">Your language preference was saved.</div>');
    }
    if (form.id === "auth-form") {
      event.preventDefault();
      const fields = new FormData(form);
      const signup = form.dataset.signup === "true";
      profile = {
        name: signup ? fields.get("name").trim() : (profile?.name || fields.get("email").split("@")[0]),
        email: fields.get("email").trim()
      };
      writeStore(storeKeys.profile, profile);
      location.href = url("account/account.html");
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.id !== "sort-products") return;
    const params = new URLSearchParams(location.search);
    let matching = products.filter((product) => !params.get("category") || product.category === params.get("category"));
    const query = (params.get("q") || "").toLowerCase();
    matching = matching.filter((product) => !query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query));
    const sorters = {
      "price-low": (a, b) => a.price - b.price,
      "price-high": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      featured: () => 0
    };
    matching.sort(sorters[event.target.value] || sorters.featured);
    document.getElementById("product-results").innerHTML = productGrid(matching);
  });
})();
