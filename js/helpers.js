/**
 * Determine stock status based on quantity.
 */
function getStockStatus(count) {
  if (count <= 0) return { label: "Out of Stock", class: "out-of-stock" };
  if (count <= 15) return { label: "Low Stock", class: "low-stock" };
  return { label: "In Stock", class: "in-stock" };
}

/**
 * Format a Date object to a readable string.
 * e.g., "05 Dec 2025, 14:30"
 */
function formatTimestamp(date) {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return date.toLocaleDateString("en-GB", options).replace(",", " —");
}

/**
 * Escape HTML characters to prevent XSS.
 */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}