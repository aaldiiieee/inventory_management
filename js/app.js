/**
 * DOM Elements
 * Cache all the important DOM elements we'll interact with for easy access.
 * This keeps our code organized and avoids repeated document.getElementById calls.
 */
const elements = {
  // Stats
  totalProducts: document.getElementById("totalProducts"),
  totalStock: document.getElementById("totalStock"),
  lastUpdated: document.getElementById("lastUpdated"),

  // Table
  productTableBody: document.getElementById("productTableBody"),
  productCount: document.getElementById("productCount"),
  tableWrapper: document.getElementById("tableWrapper"),

  // States
  loadingState: document.getElementById("loadingState"),
  errorState: document.getElementById("errorState"),
  errorMessage: document.getElementById("errorMessage"),

  // Header
  connectionStatus: document.getElementById("connectionStatus"),
  refreshBtn: document.getElementById("refreshBtn"),
  retryBtn: document.getElementById("retryBtn"),
  menuToggle: document.getElementById("menuToggle"),

  // Layout
  sidebar: document.querySelector(".sidebar"),
};

// Initialize Supabase client variable
let supabaseClient = null;

/**
 * Initialize the Supabase client with the given URL and key.
 */
function initSupabase(url, key) {
  supabaseClient = window.supabase.createClient(url, key);
}

/**
 * Check if Supabase credentials are available.
 * Returns { url, key } or null if not configured.
 */
function getCredentials() {
  if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.key) {
    return { url: SUPABASE_CONFIG.url, key: SUPABASE_CONFIG.key };
  }

  return null;
}

/**
 * Fetch all products from the Supabase "products" table.
 * Returns the array of product rows sorted by id ascending.
 */
async function fetchProducts() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Show a specific UI state: "loading", "error", or "data".
 */
function showState(state) {
  elements.loadingState.style.display = state === "loading" ? "flex" : "none";
  elements.errorState.style.display = state === "error" ? "flex" : "none";
  elements.tableWrapper.style.display = state === "data" ? "block" : "none";
}

/**
 * Update the connection status indicator in the header.
 * @param {"connected"|"error"|"checking"} status
 */
function setConnectionStatus(status) {
  const el = elements.connectionStatus;
  el.className = "header__status";

  switch (status) {
    case "connected":
      el.classList.add("header__status--connected");
      el.querySelector("span:last-child") ||
        (el.innerHTML =
          '<span class="header__status-dot"></span>Connected');
      el.lastChild.textContent = "Connected";
      break;
    case "error":
      el.classList.add("header__status--error");
      el.lastChild.textContent = "Disconnected";
      break;
    default:
      el.lastChild.textContent = "Checking...";
  }
}

/**
 * Render the stats cards with the product data.
 */
function renderStats(products) {
  elements.totalProducts.textContent = products.length;

  const totalStock = products.reduce((sum, p) => sum + p.stock_count, 0);
  elements.totalStock.textContent = totalStock.toLocaleString();

  // Find the most recent "last_updated"
  const timestamps = products
    .map((p) => new Date(p.last_updated))
    .filter((d) => !isNaN(d));

  if (timestamps.length > 0) {
    const latest = new Date(Math.max(...timestamps));
    elements.lastUpdated.textContent = formatTimestamp(latest);
  } else {
    elements.lastUpdated.textContent = "—";
  }
}

/**
 * Render the product table rows.
 */
function renderTable(products) {
  elements.productTableBody.innerHTML = "";

  products.forEach((product, index) => {
    const tr = document.createElement("tr");

    const status = getStockStatus(product.stock_count);
    const timestamp = product.last_updated
      ? formatTimestamp(new Date(product.last_updated))
      : "—";

    tr.innerHTML = `
      <td class="table__td">
        <span class="table__row-number">${index + 1}</span>
      </td>
      <td class="table__td">
        <span class="table__product-name">${escapeHTML(product.name)}</span>
      </td>
      <td class="table__td table__td--right">
        <span class="table__stock">${product.stock_count.toLocaleString()}</span>
      </td>
      <td class="table__td">
        <span class="table__timestamp">${timestamp}</span>
      </td>
      <td class="table__td">
        <span class="status-badge status-badge--${status.class}">
          <span class="status-badge__dot"></span>
          ${status.label}
        </span>
      </td>
    `;

    elements.productTableBody.appendChild(tr);
  });

  // Update badge
  const count = products.length;
  elements.productCount.textContent = `${count} item${count !== 1 ? "s" : ""}`;
}

/**
 * Load data from Supabase and render the UI.
 */
async function loadData() {
  showState("loading");
  setConnectionStatus("checking");

  try {
    const products = await fetchProducts();
    renderStats(products);
    renderTable(products);
    showState("data");
    setConnectionStatus("connected");
  } catch (err) {
    console.error("Failed to fetch products:", err);
    elements.errorMessage.textContent =
      err.message || "Could not connect to the database. Please check your configuration.";
    showState("error");
    setConnectionStatus("error");
  }
}

/**
 * Refresh data with a spinning animation on the button.
 */
async function handleRefresh() {
  elements.refreshBtn.classList.add("spinning");
  elements.refreshBtn.disabled = true;

  await loadData();

  setTimeout(() => {
    elements.refreshBtn.classList.remove("spinning");
    elements.refreshBtn.disabled = false;
  }, 500);
}

/**
 * Subscribe to realtime changes on the "products" table.
 * Whenever an INSERT, UPDATE, or DELETE occurs, re-fetch all data.
 */
function subscribeRealtime() {
  supabaseClient
    .channel("products-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      (payload) => {
        console.log("Realtime update received:", payload.eventType);
        loadData();
      }
    )
    .subscribe((status) => {
      console.log("Realtime subscription status:", status);
    });
}

/**
 * App entry point.
 * Checks credentials -> initializes Supabase -> loads data -> subscribes to realtime.
 * Shows config modal if no credentials found.
 */
function init() {
  const credentials = getCredentials();

  if (credentials) {
    initSupabase(credentials.url, credentials.key);
    loadData();
    subscribeRealtime();
  } else {
    // Show config modal
    elements.configModal.style.display = "flex";
    showState("loading");
    elements.loadingState.style.display = "none";
  }
}

// Refresh button
elements.refreshBtn.addEventListener("click", handleRefresh);

// Retry button (in error state)
elements.retryBtn.addEventListener("click", loadData);

// Mobile sidebar toggle
elements.menuToggle.addEventListener("click", () => {
  elements.sidebar.classList.toggle("sidebar--open");
});

// Close sidebar when clicking outside (mobile)
document.addEventListener("click", (e) => {
  if (
    elements.sidebar.classList.contains("sidebar--open") &&
    !elements.sidebar.contains(e.target) &&
    e.target !== elements.menuToggle &&
    !elements.menuToggle.contains(e.target)
  ) {
    elements.sidebar.classList.remove("sidebar--open");
  }
});

init();