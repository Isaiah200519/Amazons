import { cart } from "../data/cart-class.js";
import { products, loadProductFetch } from "../data/products.js";

loadProductFetch().then(() => {
  renderProductsGrid();
});

function renderProductsGrid() {
  let productHTML = '';

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

  // If a search exists in the URL parameters, filter the products that match the search.
  if (search) {
    filteredProducts = products.filter((product) => {
      let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeyword = true;
        }
      });

      return matchingKeyword || product.name.toLowerCase().includes(search.toLowerCase());
    });
  }

  // Handle the case when no products match the search
  if (filteredProducts.length === 0) {
    productHTML = `<div class="no-products-found">No matching products found for "${search}". <a href="index.html">Go back to home page</a></div>`;
  } else {
    filteredProducts.forEach((product) => {
      productHTML += `
        <div class="product-container js-product-container-${product.id}">
          <div class="product-image-container">
            <img class="product-image" src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars" src="${product.getStarUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPriceUrl()}
          </div>

          <div class="product-quantity-container">
            <select class="js-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.extraInfo()}
          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-button-${product.id}">
            <img src="icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`;
    });
  }

  document.querySelector('.js-products-grid').innerHTML = productHTML;

  // Delegate add-to-cart events to avoid multiple event listeners
  document.querySelector('.js-products-grid').addEventListener('click', (event) => {
    if (event.target && event.target.matches('.js-add-to-cart')) {
      const button = event.target;
      const productId = button.dataset.productId;

      // Add the product to the cart
      cart.addToCart(productId);
      cart.updateSelector(productId);
      updateCartQuantity();

      // Get the product container
      const container = document.querySelector(`.js-product-container-${productId}`);

      // Prevent animation flickering if the button is clicked multiple times
      if (!container.classList.contains('adding-img')) {
        container.classList.add('adding-img');

        // Remove the animation class after 2 seconds
        setTimeout(() => {
          container.classList.remove('adding-img');
        }, 2000);
      }
    }
  });

  updateCartQuantity();
}

function updateCartQuantity() {
  let cartQuantity = 0;
  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

document.querySelector('.js-search-button').addEventListener('click', () => {
  const search = document.querySelector('.js-search-bar').value;
  window.location.href = `index.html?search=${search}`;
});

document.querySelector('.js-search-bar').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const searchTerm = document.querySelector('.js-search-bar').value;
    window.location.href = `index.html?search=${searchTerm}`;
  }
});
