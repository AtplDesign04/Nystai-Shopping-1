import axios from 'axios';
import {
    addCartItem,
    removeCartItem,
    updateCartItemQuantity,
    getCartItemsRequest,
    getCartItemsSuccess,
    getCartItemsFail
} from '../slices/cartSlice';
import { toast } from 'react-toastify';

export const addCartItemToCart = (id, quantity) => async (dispatch, getState) => {
    try {
        const { data } = await axios.get(`/api/v1/product/${id}`);
        const cartItem = {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,  // Ensure this is using .url
            stock: data.product.stock,
            quantity
        };

        await axios.post('/api/v1/cart/add', cartItem);

        dispatch(addCartItem(cartItem));
        toast.success('Item added to cart successfully');
    } catch (error) {
        toast.error('Sorry, unable to add to cart');
    }
};


export const removeCartItemFromCart = (productId) => async (dispatch) => {
    try {
        await axios.delete(`/api/v1/cart/remove/${productId}`);
        dispatch(removeCartItem(productId));
    } catch (error) {
        // Handle error
    }
};

export const updateCartItemQuantityInCart = (productId, quantity, stock) => async (dispatch) => {
    try {
        await axios.put(`/api/v1/cart/update`, { productId, quantity });
        dispatch(updateCartItemQuantity({ productId, quantity, stock }));
    } catch (error) {
        // Handle error
    }
};

export const getCartItemsFromCart = () => async (dispatch) => {
    try {
        dispatch(getCartItemsRequest());
        const { data } = await axios.get('/api/v1/cart');
        dispatch(getCartItemsSuccess(data.cart));
    } catch (error) {
        dispatch(getCartItemsFail());
    }
};

export const clearCart  =  () => async (dispatch) => {

    try {  
        await axios.delete(`/api/v1/cart/clear`);
       
    } catch (error) {
        //handle error
      
    }
    
}