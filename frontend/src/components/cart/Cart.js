import { Fragment, useEffect } from 'react';
import MetaData from '../layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeCartItemFromCart, updateCartItemQuantityInCart, getCartItemsFromCart } from '../../actions/cartActions';
import { removeCartItem, updateCartItemQuantity } from '../../slices/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import empty from './empty-cart.svg'
import './cart.css'
export default function Cart() {
    const { items } = useSelector(state => state.cartState);
    const { user } = useSelector(state => state.authState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const increaseQty = (item) => {
        const count = item.quantity;
        if (item.stock === 0 || count >= item.stock) return;

        if (user) {
            // Dispatch increaseCartItemQty action from actions file
            dispatch(updateCartItemQuantityInCart(item.product, item.quantity + 1));
        } else {
            // Dispatch increaseCartItemQty action from slice
            dispatch(updateCartItemQuantity({ productId: item.product, quantity: item.quantity + 1, stock: item.stock }));
        }
    };

    const decreaseQty = (item) => {
        const count = item.quantity;
        if (count === 1) return;

        if (user) {
            // Dispatch decreaseCartItemQty action from actions file
            dispatch(updateCartItemQuantityInCart(item.product, item.quantity - 1));
        } else {
            // Dispatch decreaseCartItemQty action from slice
            dispatch(updateCartItemQuantity({ productId: item.product, quantity: item.quantity - 1, stock: item.stock }));
        }
    };

    useEffect(() => {
        // Fetch cart items when the component mounts
        dispatch(getCartItemsFromCart());
    }, [dispatch]);

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping');
    };

    const removeItemHandler = (productId) => {
        if (user) {
            // Dispatch removeCartItem action from actions file
            dispatch(removeCartItemFromCart(productId));
        } else {
            // Dispatch removeCartItem action from slice
            dispatch(removeCartItem(productId));
        }
    };


    return (
        <Fragment>
            <MetaData title={'Cart'} />
            {items.length === 0 ? (
                <div>
                    <center>
                        <Link to='/'>
                            <img src={empty} height="250" width="250" style={{ margin: '20px' }} />
                        </Link>

                        <h2 className="mt-5">Your Cart is Empty</h2>
                        <Link to='/'>
                            <button className="add-to-cart-button">Continue Shopping</button>
                        </Link>
                    </center>

                </div>


            ) : (
                <Fragment>
                    <h2 className="m-5">
                        Your Cart: <b>{items.length} items</b>
                    </h2>
                    <div className="row d-flex justify-content-between cart-container">
                        <div className="col-12 col-lg-8">
                            {items.map(item => (
                                <Fragment key={item.product}>
                                    <hr />
                                    <div className="cart-item">
                                        <div className="row align-items-center">
                                            {/* Image */}
                                            <div className="col-4 col-lg-2 d-flex justify-content-center">
                                                <img src={item.image} alt={item.name} height="70" width="70" />
                                            </div>

                                            {/* Product Name */}
                                            <div className="col-8 col-lg-4 p-5 d-flex justify-content-center">
                                                <Link to={`/products/${item.product}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                    {item.name}
                                                </Link>
                                            </div>

                                            {/* Price */}
                                            <div className="col-4 col-lg-2 d-flex justify-content-center mt-5 mt-lg-0">
                                                <p id="card_item_price" className='cart-item-price'>₹{item.price}</p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="col-6 col-lg-2 d-flex justify-content-center mt-3 mt-lg-0">
                                                <div className="d-flex align-items-center">
                                                    <span className="btn minus" onClick={() => decreaseQty(item)}>-</span>
                                                    <input
                                                        type="number"
                                                        className="qty-input"
                                                        style={{ width: '40px', textAlign: 'center', border:'none'}}
                                                        value={item.quantity}
                                                        readOnly
                                                    />
                                                    <span className="btn plus" onClick={() => increaseQty(item)}>+</span>
                                                </div>
                                                
                                            </div>

                                            {/* Delete Button */}
                                            <div className="col-2 col-lg-2 d-flex justify-content-center mt-3 mt-lg-0">
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                    id="delete_cart_item"
                                                    onClick={() => removeItemHandler(item.product)}
                                                    className="fa fa-trash btn-red"
                                                    style={{color:'red'}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            ))}
                            <hr />
                        </div>



                        <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary">
                                <h4>Order Summary</h4>
                                <hr />
                                <p>Subtotal: <span className="order-summary-values">{items.reduce((acc, item) => (acc + item.quantity), 0)} (Units)</span></p>
                                <p>Est. total: <span className="order-summary-values">₹{items.reduce((acc, item) => (acc + item.quantity * item.price), 0).toFixed(2)}</span></p>
                                <hr />
                                <button id="checkout_btn" onClick={checkoutHandler} className="btn btn-primary btn-block">Check out</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
}
