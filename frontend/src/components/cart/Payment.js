import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios";
import { Fragment, useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify";
import {validateShipping} from '../cart/Shipping';
import { clearError as clearOrderError } from "../../slices/orderSlice";
import { orderCompleted } from "../../slices/cartSlice";
import { createOrder } from "../../actions/orderActions";
import MetaData from '../layouts/MetaData';
import { clearCart } from "../../actions/cartActions";


export default function Payment() {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))
    const { user } = useSelector(state => state.authState)
    const {items:cartItems, shippingInfo, billingInfo } = useSelector(state => state.cartState)
    const { error:orderError } = useSelector(state => state.orderState)

    const paymentData = {
        amount : orderInfo ? Math.round( orderInfo.totalPrice * 100) : 0,
        shipping :{
            name: user.name,
            address:{
                city: shippingInfo.city,
                postal_code : shippingInfo.postalCode,
                country: shippingInfo.country,
                state: shippingInfo.state,
                line1 : shippingInfo.address
            },
            phone: shippingInfo.phoneNo
        },
        billingAddress :{
            name: user.name,
            address:{
                city: billingInfo.city,
                postal_code : billingInfo.postalCode,
                country: billingInfo.country,
                state: billingInfo.state,
                line1 : billingInfo.address
            },
            phone: billingInfo.phoneNo
        }
    }

    const order = {
        orderItems: cartItems,
        shippingInfo,
        billingInfo
    }

    if(orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
        
    }

    useEffect(() => {
        validateShipping(shippingInfo,billingInfo, navigate)
        if(orderError) {
            toast(orderError, {                
                type: 'error',
                onOpen: ()=> { dispatch(clearOrderError()) }
            })
            return
        }
    },[])

    const submitHandler = async (e) => {
        e.preventDefault();
        document.querySelector('#pay_btn').disabled = true;
        try {
            const {data} = await axios.post('/api/v1/payment/process', paymentData)
            const clientSecret = data.client_secret
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            })

            if(result.error){
                toast(result.error.message, {
                    type: 'error',
                  
                })
                document.querySelector('#pay_btn').disabled = false;
            }else{
                if((await result).paymentIntent.status === 'succeeded') {
                    toast('Payment Success!', {
                        type: 'success',
                        
                    })
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }
                    dispatch(orderCompleted())
                    dispatch(clearCart())
                    dispatch(createOrder(order))
                    navigate('/order/success')
                }else{
                    toast('Please Try again!', {
                        type: 'warning',
                    })
                }
            }


        } catch (error) {
            
        }
    }


     return (
        <Fragment>
            <MetaData title={`Payment`} />
             <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-4">Card Info</h1>
                    <div className="form-group">
                    <label htmlFor="card_num_field">Card Number</label>
                    <CardNumberElement
                        type="text"
                        id="card_num_field"
                        className="form-control"
                       
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="card_exp_field">Card Expiry</label>
                    <CardExpiryElement
                        type="text"
                        id="card_exp_field"
                        className="form-control"

                       
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="card_cvc_field">Card CVC</label>
                    <CardCvcElement
                        type="text"
                        id="card_cvc_field"
                        className="form-control"
                        value=""
                       
                    />
                    </div>
        
                
                    <button
                    id="pay_btn"
                    type="submit"
                    className="btn btn-block py-3"
                    >
                    Pay - { ` ₹${orderInfo && orderInfo.totalPrice}` }
                    </button>
        
                </form>
            </div>
        </div>
        </Fragment>
       
    )
}











// import { useDispatch, useSelector } from "react-redux";
// import { Fragment, useState, useEffect } from "react";
// import {countries} from 'countries-list'
// import { saveShippingInfo } from "../../slices/cartSlice.js";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import CheckoutSteps from "./CheckoutSteps.js";
// import { createSavedAddress, getAllSavedAddresses } from "../../actions/userActions.js";

// export const validateShipping = (shippingInfo, navigate) => {
//     const { address, city, state, country, phoneNo, postalCode } = shippingInfo;
   
//     if (
//         !address ||
//         !city ||
//         !state ||
//         !country ||
//         !phoneNo ||
//         !postalCode ||
//         !isValidPhoneNumber(phoneNo) ||
//         !isValidPostalCode(postalCode)
//     ) {
//         toast.error('Please fill the shipping information correctly');
//         navigate('/shipping');
//     }
// };

// const isValidPhoneNumber = (phoneNo) => {
//     const phoneNumberRegex = /^\d{10,13}$/; // 10-13 digits allowed
//     return phoneNumberRegex.test(phoneNo);
// };

// const isValidPostalCode = (postalCode) => {
//     const postalCodeRegex = /^\d{6}$/; // 6 digits allowed
//     return postalCodeRegex.test(postalCode);
// };
// export default function Shipping() {
//     const {shippingInfo={} } = useSelector(state => state.cartState)
//     const [selectedAddress, setSelectedAddress] = useState('');
//     const {savedAddresses = [] } = useSelector(state => state.userState);
//     const [address, setAddress] = useState(shippingInfo.address);
//     const [city, setCity] = useState(shippingInfo.city);
//     const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
//     const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
//     const [country, setCountry] = useState(shippingInfo.country);
//     const [state, setState] = useState(shippingInfo.state);
//     const countryList =  Object.values(countries);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     useEffect(() => {
//         // Fetch saved addresses when the component mounts
//         dispatch(getAllSavedAddresses());
//     }, [dispatch]);
//     const handleAddressSelect = (selectedAddress) => {
//         setSelectedAddress(selectedAddress);
//         // Fill the form with the selected address details
//         const selected = savedAddresses.find(addr => addr._id === selectedAddress);
//         if (selected) {
//             setAddress(selected.address);
//             setCity(selected.city);
//             setPhoneNo(selected.phoneNo);
//             setPostalCode(selected.postalCode);
//             setCountry(selected.country);
//             setState(selected.state);
//         }        
//     };
//     const submitHandler = async (e) => {
//         e.preventDefault();
//         // Dispatch the action to save shipping info
//         dispatch(saveShippingInfo({address, city, phoneNo, postalCode, country, state}));

//         // Dispatch the action to save address in user model
//         try {
//             await dispatch(createSavedAddress({address, city, phoneNo, postalCode, country, state}));
//             // Navigate to the confirmation page if both actions succeed
//             navigate('/order/confirm');
//         } catch (error) {
//             // Handle any errors that occur during saving address in user model
//             console.error("Error saving address in user model:", error);
//             // You can display an error message or handle the error in any way you want
//         }
//     }


//     return (
//     <Fragment>
//         <CheckoutSteps shipping />
//         <div className="row wrapper">
//             <div className="col-10 col-lg-5">
//             {savedAddresses && savedAddresses.length > 0 && (
//     <div>
//         <h2>Saved Addresses</h2>
//         <div>
//             {savedAddresses.map(address => (
//                 <div key={address._id}>
//                     <input
//                         type="radio"
//                         id={address._id}
//                         name="savedAddress"
//                         value={address._id}
//                         checked={selectedAddress === address._id}
//                         onChange={() => handleAddressSelect(address._id)}
//                     />
//                     <label htmlFor={address._id}>{`Adress:${address.address},`}</label> <br/>
//                     <label htmlFor={address._id}>{`${address.city},`}</label> <br/>
//                     <label htmlFor={address._id}>{`${address.country} - ${address.postalCode},`}</label> <br/>
//                     <label htmlFor={address._id}>{`${address.phoneNo}`}</label>
//                 </div>
//             ))}
//         </div>
//     </div>
// )}
//                 <form onSubmit={submitHandler} className="shadow-lg">
//                     <h1 className="mb-4">Shipping Address</h1>
                    
//                     <div className="form-group">
//                         <label htmlFor="address_field">Address</label>
//                         <input
//                             type="text"
//                             id="address_field"
//                             className="form-control"
//                             value={address}
//                             onChange={(e) => setAddress(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="city_field">City</label>
//                         <input
//                             type="text"
//                             id="city_field"
//                             className="form-control"
//                             value={city}
//                             onChange={(e) => setCity(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="phone_field">Phone No</label>
//                         <input
//                             type="phone"
//                             id="phone_field"
//                             className="form-control"
//                             value={phoneNo}
//                             onChange={(e) => setPhoneNo(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="postal_code_field">Postal Code</label>
//                         <input
//                             type="number"
//                             id="postal_code_field"
//                             className="form-control"
//                             value={postalCode}
//                             onChange={(e) => setPostalCode(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="country_field">Country</label>
//                         <select
//                             id="country_field"
//                             className="form-control"
//                             value={country}
//                             onChange={(e) => setCountry(e.target.value)}
//                             required
//                         >
//                             {countryList.map((country, i) => (
//                                 <option key={i} value={country.name}>
//                                     {country.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="state_field">State</label>
//                         <input
//                             type="text"
//                             id="state_field"
//                             className="form-control"
//                             value={state}
//                             onChange={(e) => setState(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <button
//                         id="shipping_btn"
//                         type="submit"
//                         className="btn btn-block py-3"
//                     >
//                         CONTINUE
//                     </button>
//                 </form>
                
//             </div>
//         </div>
//     </Fragment>
//     )
// }