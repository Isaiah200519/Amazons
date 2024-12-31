
class Cart {
cartItems = undefined;
localStorageKey;

constructor(localStorageKey) {
this.localStorageKey = localStorageKey;
this.loadFromStorage();
}

loadFromStorage() {
this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey));

if(!this.cartItems) {
this.cartItems =[];
}
};

saveToStorage() {
localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
};

addToCart(productId) {
let matchingItem;

this.cartItems.forEach((cartItem)=>{
if(productId === cartItem.productId) {
matchingItem = cartItem;
}
});
if(matchingItem) {
matchingItem.quantity++
} else{
this.cartItems.push({
productId:productId,
quantity:1,
deliveryOptionId:'1'
});
}

this.saveToStorage()
};

updateSelector(productId) {
const selector = document.querySelector(`.js-selector-${productId}`);

const select = Number(selector.value);

let matchingItem;

this.cartItems.forEach((cartItem)=>{
if(productId === cartItem.productId) {
matchingItem = cartItem;
}
});
if(matchingItem) {
matchingItem.quantity +=(select-1)
} 

this.saveToStorage()
};

removeFromCart(productId) {
const newCart = [];

this.cartItems.forEach((cartItem)=>{
if(cartItem.productId !== productId) {
newCart.push(cartItem);
}
});

this.cartItems = newCart;

this.saveToStorage();
};

updateInput(productId) {
const inputElement = document.querySelector(`.js-input-quantity-${productId}`);

const input = Number(inputElement.value);

let matchingItem;

this.cartItems.forEach((cartItem)=>{
if(productId === cartItem.productId) {
matchingItem = cartItem;
}
});
if(matchingItem) {
matchingItem.quantity =(input-1)
} 

document.querySelector(`.js-quantity-label-${productId}`).innerHTML = input;

this.saveToStorage()
};

updateDeliveryOption(productId, deliveryOptionId) {
let matchingItem;

this.cartItems.forEach((cartItem)=>{
if(productId === cartItem.productId) {
matchingItem = cartItem;
}
});

matchingItem.deliveryOptionId = deliveryOptionId;

this.saveToStorage();
};

updateQuantity(productId) {
const inputElement = document.querySelector(`.js-input-quantity-${productId}`);

const input = Number(inputElement.value);

let matchingItem;

this.cartItems.forEach((cartItem)=>{
if(productId === cartItem.productId) {
matchingItem = cartItem;
}
});
if(matchingItem) {
matchingItem.quantity = input
}

document.querySelector(`.js-quantity-label-${productId}`).innerHTML = input;

this.saveToStorage();
};

selectDeliveryOption(productId, deliveryOptionId) {
let matchingItem;

this.cartItems.forEach((cartItem)=>{
if(productId === cartItem.productId) {
matchingItem = cartItem;
}
});

matchingItem.deliveryOptionId = deliveryOptionId;

this.saveToStorage();
};

resetCart() {
  cart = [];
  this.saveToStorage();
}

loadCart(fun) {
const xhr = new XMLHttpRequest();

xhr.addEventListener('load', ()=>{
console.log(xhr.response)

  fun();
});

xhr.open('GET', 'https://supersimplebackend.dev/cart');

xhr.send();

}
}
export let cart = new Cart('cart-op');
