import { cart } from "../../data/cart-class.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { getProduct, products } from "../../data/products.js";
import { formatCurrency } from "./../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);
    if (!matchingProduct) {
      console.error(`Product not found for productId: ${productId}`);
      return; // Skip rendering if product is not found
    }

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    if (!deliveryOption) {
      console.error(`Delivery option not found for deliveryOptionId: ${deliveryOptionId}`);
      return; // Skip rendering if delivery option is not found
    }

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">${matchingProduct.getPriceUrl()}</div>
            <div class="product-quantity">
              <span>Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span></span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">Update</span>
              <input class="input-quantity js-input-quantity-${matchingProduct.id}">
              <span class="save-quantity link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
              <span class="delete-quantity-link link-primary js-delete-link js-test-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">Delete</span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>`;
  });

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  // Event listener for deleting items from the cart
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      try {
        // Attempt to remove from the cart
        cart.removeFromCart(productId);

        // Attempt to remove the cart item element from the DOM
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        if (container) {
          container.remove();
        }

        // Update cart quantity and re-render summaries
        cartQuantity();
        renderOrderSummary();
        renderPaymentSummary();
      } catch (error) {
        console.error('Error removing item from cart:', error);
        alert('Failed to remove item. Please try again later.');
      }
    });
  });

  // Event listener for updating quantities
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (container) {
        container.classList.add('is-editing-quantity');
      }
    });
  });

  // Event listener for saving updated quantities
  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      try {
        // Attempt to update the quantity
        container.classList.remove('is-editing-quantity');
        cart.updateQuantity(productId);

        // Update cart and re-render
        cartQuantity();
        renderOrderSummary();
        renderPaymentSummary();
      } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity. Please try again later.');
      }
    });
  });

  cartQuantity();

  function cartQuantity() {
    let cartQuantity = 0;

    cart.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    document.querySelector('.js-link').innerHTML = `${cartQuantity} items`;
  }

  // Event listener for selecting a delivery option
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;

      try {
        // Attempt to select the delivery option
        cart.selectDeliveryOption(productId, deliveryOptionId);

        // Re-render summaries after selection
        renderOrderSummary();
        renderPaymentSummary();
      } catch (error) {
        console.error('Error selecting delivery option:', error);
        alert('Failed to select delivery option. Please try again later.');
      }
    });
  });
}

function deliveryOptionHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryOption.priceCents === 0 
      ? 'FREE'
      : `${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id == cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">$${priceString} Shipping</div>
        </div>
      </div>`;
  });

  return html;
}
