const loadingEl = document.getElementById('loading');
const container = document.getElementById('products');
const toast = document.getElementById('cart-toast');
const filterButtons = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); }, 2500);
}

function renderProduct(product, index) {
  const notes = product.notes.split(', ').map((n) => `<span class="note-tag">${n}</span>`).join('');
  const div = document.createElement('div');
  div.className = 'product';
  div.dataset.category = product.category;
  div.innerHTML = `
    <p class="product-number">N° ${String(index + 1).padStart(2, '0')}</p>
    <h3>${product.name}</h3>
    <p class="product-description">${product.description}</p>
    <div class="product-notes">${notes}</div>
    <div class="product-footer">
      <p class="product-price">${product.price}<span>/ 2ml</span></p>
      <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}">Add</button>
    </div>
  `;
  div.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
    const name = e.currentTarget.dataset.name;
    showToast(`${name} added to cart ✓`);
  });
  return div;
}

function displayProducts(filter = 'all') {
  container.innerHTML = '';
  let filteredProducts = PRODUCTS;
  if (filter !== 'all') { filteredProducts = PRODUCTS.filter(p => p.category === filter); }
  if (filteredProducts.length === 0) { container.innerHTML = '<div class="loading"><span>No products in this category</span></div>'; return; }
  loadingEl.style.display = 'none';
  filteredProducts.forEach((product, i) => { container.appendChild(renderProduct(product, i + 1)); });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    displayProducts(currentFilter);
  });
});

window.addEventListener('load', () => { displayProducts(); });