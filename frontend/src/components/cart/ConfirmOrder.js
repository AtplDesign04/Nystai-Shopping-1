import MetaData from '../layouts/MetaData';
import { Fragment, useEffect } from 'react';
import { validateShipping } from './Shipping';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from './CheckoutSteps.js';


export default function ConfirmOrder() {
    const { shippingInfo, billingInfo, items: cartItems } = useSelector(state => state.cartState);
    const { user } = useSelector(state => state.authState);
    const navigate = useNavigate();
    const itemsPrice = cartItems.reduce((acc, item) => (acc + item.price * item.quantity), 0);
    const shippingPrice = itemsPrice > 250 ? 0 : 250;
    let taxPrice = Number(0.18 * itemsPrice);
    const totalPrice = Number(itemsPrice + shippingPrice + taxPrice).toFixed(2);
    taxPrice = Number(taxPrice).toFixed(2)
    // saving infromations in session storage
    const processPayment = () => {
        const data = {
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        }
        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        navigate('/payment')
    }


    useEffect(() => {
        validateShipping(shippingInfo, navigate)
    }, [shippingInfo, navigate])

    return (
        <Fragment>
            <MetaData title={'Confirm Order'} />
            <CheckoutSteps shipping confirmOrder />
            <div className="row d-flex justify-content-between m-1">
                <div className="col-12 col-lg-8 mt-5 order-confirm">
                    <div>
                        <h4 className="mb-3">Shipping Info</h4>
                        <p><b>Name:</b> {user.name}</p>
                        <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                        <p className="mb-4"><b>Address:</b> {shippingInfo.address}, {shippingInfo.addressLine}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country} </p>
                    </div>
                    <div>
                        <h4 className="mb-3">Billing Info</h4>
                        <p><b>Name:</b> {user.name}</p>
                        <p><b>Phone:</b> {billingInfo.phoneNo}</p>
                        <p className="mb-4"><b>Address:</b> {billingInfo.address}, {billingInfo.addressLine}, {billingInfo.city}, {billingInfo.postalCode}, {billingInfo.state}, {billingInfo.country} </p>
                    </div>


                    <hr />
                    <h4 className="mt-4">Your Cart Items:</h4>

                    {cartItems.map(item => (
                        <Fragment key={item._id}>
                            <div className="cart-item my-1">
                                <div className="row align-items-center">
                                    {/* Image */}
                                    <div className="col-4 col-lg-2">
                                        <img src={item.image} alt={item.name} height="45" width="65" />
                                    </div>

                                    {/* Product Name */}
                                    <div className="col-5 col-lg-6">
                                        <Link to={`/products/${item.product}`} style={{ textDecoration: 'none', color: '#1b6763' }}>
                                            {item.name}
                                        </Link>
                                    </div>

                                    {/* Price */}
                                    <div className="col-4 col-lg-4 mt-4 mt-lg-0 text-nowrap">
                                        <p>{item.quantity} x ₹{item.price} = <b>₹{item.quantity * item.price}</b></p>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </Fragment>
                    ))}

                </div>

                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal:  <span className="order-summary-values">₹{(itemsPrice).toFixed(2)}</span></p>
                        <p>Shipping: <span className="order-summary-values">₹{shippingPrice}</span></p>
                        <p>GST 18% :  <span className="order-summary-values">₹{taxPrice}</span></p>

                        <hr />

                        <p>Total: <span className="order-summary-values">₹{totalPrice}</span></p>

                        <hr />
                        <button id="checkout_btn" onClick={processPayment} className="btn btn-primary btn-block">Proceed to Payment</button>
                    </div>
                </div>
            </div>
        </Fragment>

    )
}