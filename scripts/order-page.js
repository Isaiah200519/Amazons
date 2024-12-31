import { getProduct, loadProductFetch } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { orders } from '../data/order.js';
import { formatCurrency } from './utils/money.js';
import { cart } from '../data/cart-class.js';

async function loadPage() {
  await loadProductFetch();

  let ordersHTML = '';

  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderTime).format('MMMM D');

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents / 100)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${productsListHTML(order)}
        </div>
      </div>
    `;
  });

  function productsListHTML(order) {
    let productsListHTML = '';

    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);

      // Handle case where product is missing
      if (!product) {
        console.error(`Product with ID ${productDetails.productId} not found`);
        return;
      }

      productsListHTML += `
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-details">
          <div class="product-name">${product.name}</div>
          <div class="product-delivery-date">
            Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')}
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${product.id}">
            <img class="buy-again-icon" src="icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return productsListHTML;
  }

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

  document.querySelectorAll('.js-buy-again-button').forEach((button) => {
    button.addEventListener('click', () => {
      cart.addToCart(button.dataset.productId);
      console.log('Product added to cart');

      // Change the button to show "Added"
      const originalHTML = button.innerHTML;
      button.innerHTML = 'Added';

      setTimeout(() => {
        button.innerHTML = originalHTML;  // Restore original HTML after 1 second
      }, 1000);
    });
  });

  updateCartQuantity();

  function updateCartQuantity() {
    let cartQuantity = 0;
    cart.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }
}

loadPage();
