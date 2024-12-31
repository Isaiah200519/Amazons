import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { getOrder } from '../data/order.js';
import { getProduct, loadProductFetch } from '../data/products.js';
import { cart } from '../data/cart-class.js';

async function loadPage() {
  await loadProductFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId);
  const product = getProduct(productId);

  if (!order || !product) {
    document.querySelector('.js-order-tracking').innerHTML = `
      <div class="error-message">Order or product not found. Please check your input.</div>
    `;
    return;
  }

  // Get product details
  let productDetails = order.products.find(
    (details) => details.productId === product.id
  );

  if (!productDetails) {
    document.querySelector('.js-order-tracking').innerHTML = `
      <div class="error-message">Product details not found in the order.</div>
    `;
    return;
  }

  // Calculate progress
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);

  let percentProgress = Math.min(
    Math.max(((today.diff(orderTime) / deliveryTime.diff(orderTime)) * 100), 0),
    100
  ); // Clamp between 0 and 100

  // Generate tracking HTML
  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div class="delivery-date">
      Arriving on ${deliveryTime.format('dddd, MMMM D')}
    </div>
    <div class="product-info">
      ${product.name}
    </div>
    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>
    <img class="product-image" src="${product.image}">
    <div class="progress-labels-container">
      <div class="progress-label ${percentProgress > 0 ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${
        percentProgress >= 50 && percentProgress < 100 ? 'current-status' : ''
      }">
        Shipped
      </div>
      <div class="progress-label ${
        percentProgress >= 100 ? 'current-status' : ''
      }">
        Delivered
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width:${percentProgress}%;"></div>
    </div>
  `;

  // Update the DOM
  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;

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
