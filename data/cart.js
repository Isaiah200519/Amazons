export let  cart;

loadFromStorage();

export function loadFromStorage() {
cart = JSON.parse(localStorage.getItem('cart'));

if(!cart) {
cart =[{
productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
quantity:2,
deliveryOptionId:'2'
}, {
productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
quantity:1,
deliveryOptionId:'1'
}];
}
}

function saveToStorage() {
localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
let matchingItem;

cart.forEach((cartItem)=>{
if(productId === cartItem.productId) {
matchingItem = cartItem;
}
});
if(matchingItem) {
matchingItem.quantity++
} else{
cart.push({
productId:productId,
quantity:1,
deliveryOptionId:'1'
});
}

saveToStorage()
}

export function updateSelector(productId) {
const selector = document.querySelector(`.js-selector-${productId}`);

const select = Number(selector.value);

let matchingItem;

cart.forEach((cartItem)=>{
if(productId === cartItem.productId) {
matchingItem = cartItem;
}
});
if(matchingItem) {
matchingItem.quantity +=(select-1)
} 

saveToStorage()
}

export function removeFromCart(productId) {
const newCart = [];

cart.forEach((cartItem)=>{
if(cartItem.productId !== productId) {
newCart.push(cartItem);
}
});

cart = newCart;

saveToStorage();
}

export function updateInput(productId) {
const inputElement = document.querySelector(`.js-input-quantity-${productId}`);

const input = Number(inputElement.value);

let matchingItem;

cart.forEach((cartItem)=>{
if(productId === cartItem.productId) {
matchingItem = cartItem;
}
});
if(matchingItem) {
matchingItem.quantity =(input-1)
} 

document.querySelector(`.js-quantity-label-${productId}`).innerHTML = input;

saveToStorage()
}

export function updateDeliveryOption(productId, deliveryOptionId) {
let matchingItem;

cart.forEach((cartItem)=>{
if(productId === cartItem.productId) {
matchingItem = cartItem;
}
});

matchingItem.deliveryOptionId = deliveryOptionId;

saveToStorage();
}

export function updateQuantity(productId) {
const inputElement = document.querySelector(`.js-input-quantity-${productId}`);

const input = Number(inputElement.value);

let matchingItem;

cart.forEach((cartItem)=>{
if(productId === cartItem.productId) {
matchingItem = cartItem;
}
});
if(matchingItem) {
matchingItem.quantity = input
}

document.querySelector(`.js-quantity-label-${productId}`).innerHTML = input;

saveToStorage();
}

export function selectDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    cart.forEach((cartItem)=>{
    if(productId === cartItem.productId) {
    matchingItem = cartItem;
    }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;

    saveToStorage();
}