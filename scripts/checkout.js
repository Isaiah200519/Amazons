import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import {cart} from '../data/cart-class.js'
import { loadProductFetch} from "../data/products.js";

async function loadPage() {

try{
//throw 'error'
await loadProductFetch()

await new Promise((resolve, reject)=>{
//throw 'error2'
cart.loadCart(()=>{
//reject('error3');
resolve();
})
});

} 
catch (error) {
console.log('unexpected error, please try again later');
}
renderOrderSummary();
renderPaymentSummary();
}

loadPage();
/*
Promise.all([
new Promise((resolve)=>{

loadProductFetch().then(()=>{
resolve();
})

}),

new Promise((resolve)=>{
cart.loadCart(()=>{
resolve();

})
})
]).then(()=>{
renderOrderSummary()
renderPaymentSummary();
})*/

/*
new Promise((resolve)=>{

loadProducts(()=>{
resolve();
});

}).then(()=>{
return new Promise((resolve)=>{
cart.loadCart(()=>{
resolve();

})
});

}).then(()=>{
renderOrderSummary();
renderPaymentSummary();
})*/
/*
loadProducts(()=>{
cart.loadCart(()=>{
renderOrderSummary();
renderPaymentSummary();
})
});*/
