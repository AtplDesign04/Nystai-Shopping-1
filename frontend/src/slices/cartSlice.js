import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        loading: false,
        shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {},
        billingInfo: localStorage.getItem('billingInfo') ? JSON.parse(localStorage.getItem('billingInfo')) : {}
    },
    reducers: {
        clearCart(state) {
            state.items = [];
            localStorage.removeItem('cartItems');
        },
        getCartItemsRequest(state) {
            state.loading = true;
        },
        getCartItemsSuccess(state, action) {
            state.items = action.payload;
            state.loading = false;
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        getCartItemsFail(state) {
            state.loading = false;
        },
        addCartItem(state, action) {
            const newItem = action.payload;
            const existingItemIndex = state.items.findIndex(item => item.product === newItem.product);
            if (existingItemIndex !== -1) {
                const updatedQuantity = state.items[existingItemIndex].quantity + newItem.quantity;
                if (updatedQuantity > newItem.stock) {
                    state.items[existingItemIndex].quantity = newItem.stock;
                } else {
                    state.items[existingItemIndex].quantity = updatedQuantity;
                }
            } else {
                state.items.push(newItem);
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeCartItem(state, action) {
            const productId = action.payload;
            state.items = state.items.filter(item => item.product !== productId);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        updateCartItemQuantity(state, action) {
            const { productId, quantity, stock } = action.payload;
            const cartItemIndex = state.items.findIndex(item => item.product === productId);
            if (cartItemIndex !== -1) {
                const updatedCartItem = { ...state.items[cartItemIndex], quantity };
                if (typeof stock !== 'undefined') {
                    updatedCartItem.stock = stock;
                }
                state.items[cartItemIndex] = updatedCartItem;
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        saveShippingInfo(state, action) {
            localStorage.setItem('shippingInfo', JSON.stringify(action.payload));
            state.shippingInfo = action.payload;
        },
        saveBillingInfo(state, action) {
            localStorage.setItem('billingInfo', JSON.stringify(action.payload));
            state.billingInfo = action.payload;
        },
        orderCompleted(state) {
            localStorage.removeItem('shippingInfo');
            localStorage.removeItem('billingInfo');
            localStorage.removeItem('cartItems');
            sessionStorage.removeItem('orderInfo');
            state.items = [];
            state.shippingInfo = {};
            state.billingInfo = {};
        }
    }
});

export const { 
    addCartItem, 
    removeCartItem, 
    updateCartItemQuantity, 
    clearCart,
    getCartItemsRequest,
    getCartItemsSuccess,
    getCartItemsFail,
    saveShippingInfo,
    saveBillingInfo,
    orderCompleted
 } = cartSlice.actions;

export default cartSlice.reducer;
