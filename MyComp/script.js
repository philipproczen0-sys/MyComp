// Update cart count on all pages
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Add to Cart buttons
  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);

      addToCart({ id, name, price });
    });
  });

  // Load cart items if on cart page
  if (document.getElementById('cart-items')) {
    loadCart();
  }
});

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  alert(`${product.name} added to cart!`);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElement = document.getElementById('cart-count');
  if (countElement) countElement.textContent = count;
}

function loadCart() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cart-total').textContent = '0';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${item.name}</span>
      <input type="number" min="1" value="${item.quantity}">
      <span>$${item.price * item.quantity}</span>
      <button class="remove-btn">Remove</button>
    `;

    // Quantity change
    div.querySelector('input').addEventListener('change', (e) => {
      item.quantity = parseInt(e.target.value);
      if (item.quantity <= 0) item.quantity = 1;
      saveCart(cart);
      loadCart();
    });

    // Remove button
    div.querySelector('.remove-btn').addEventListener('click', () => {
      const index = cart.indexOf(item);
      cart.splice(index, 1);
      saveCart(cart);
      loadCart();
    });

    container.appendChild(div);
  });

  document.getElementById('cart-total').textContent = total.toFixed(2);
}
