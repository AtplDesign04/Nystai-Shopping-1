import { Fragment, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countries } from 'countries-list';
import { saveShippingInfo, saveBillingInfo } from "../../slices/cartSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutSteps from "./CheckoutSteps.js";
import MetaData from '../layouts/MetaData';
import { createSavedAddress, getAllSavedAddresses } from "../../actions/userActions.js";
import 'bootstrap/dist/js/bootstrap.js';

const fetchPostalCodeDetails = async (postalCode) => {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${postalCode}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching pin code details:", error);
        throw error;
    }
};

const isValidPhoneNumber = (phoneNo) => {
        const phoneNumberRegex = /^\d{10,13}$/;
        return phoneNumberRegex.test(phoneNo);
};

const isValidPostalCode = (postalCode) => {
        const postalCodeRegex = /^\d{6}$/;
        return postalCodeRegex.test(postalCode);
};

export const validateShipping = (shippingInfo, navigate) => {
    const { address, addressLine, city, state, country, phoneNo, postalCode } = shippingInfo;

    if (
        !address || !addressLine || !city || !state || !country || !phoneNo || !postalCode ||
        !isValidPhoneNumber(phoneNo) || !isValidPostalCode(postalCode)
    ) {
        toast.error('Please fill the shipping information correctly');
        navigate('/shipping');
    }
};

export default function Shipping() {
    const { shippingInfo = {}, billingInfo = {} } = useSelector(state => state.cartState);
    const { savedAddresses = [] } = useSelector(state => state.userState);
    const [address, setAddress] = useState(shippingInfo.address || "");
    const [addressLine, setAddressLine] = useState(shippingInfo.addressLine || "");
    const [city, setCity] = useState(shippingInfo.city || "");
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
    const [country, setCountry] = useState(shippingInfo.country || "");
    const [state, setState] = useState(shippingInfo.state || "");
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode || "");
    const [localities, setLocalities] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [showSavedAddresses, setShowSavedAddresses] = useState(false);
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
    const [billingAddress, setBillingAddress] = useState(billingInfo.address || "");
    const [billingAddressLine, setBillingAddressLine] = useState(billingInfo.addressLine || "");
    const [billingCity, setBillingCity] = useState(billingInfo.city || "");
    const [billingPhoneNo, setBillingPhoneNo] = useState(billingInfo.phoneNo || "");
    const [billingCountry, setBillingCountry] = useState(billingInfo.country || "");
    const [billingState, setBillingState] = useState(billingInfo.state || "");
    const [billingPostalCode, setBillingPostalCode] = useState(billingInfo.postalCode || "");
    const [billingLocalities, setBillingLocalities] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const countryList = Object.values(countries);
    useEffect(() => {
        dispatch(getAllSavedAddresses());
    }, [dispatch]);

    const handlePincodeChange = useCallback(async (e, setPostalCode, setLocalities, setCity, setState, setCountry) => {
        const postalCode = e.target.value;
        setPostalCode(postalCode);
        if (postalCode.length === 6) {
            try {
                const data = await fetchPostalCodeDetails(postalCode);
                if (data && data[0]?.PostOffice?.length > 0) {
                    const offices = data[0].PostOffice;
                    setLocalities(offices.map(office => office.Name));
                    setCity(offices[0].Name);
                    setState(offices[0].State);
                    setCountry(offices[0].Country);
                } else {
                    toast.error("Invalid pin code");
                }
            } catch (error) {
                console.error("Error fetching pin code details:", error);
                toast.error("Error fetching pin code details");
            }
        }
    }, []);

    const handleAddressSelect = useCallback((selectedAddressId) => {
        setSelectedAddress(selectedAddressId);
        const selected = savedAddresses.find(addr => addr._id === selectedAddressId);
        if (selected) {
            setAddress(selected.address);
            setAddressLine(selected.addressLine);
            setCity(selected.city);
            setPhoneNo(selected.phoneNo);
            setPostalCode(selected.postalCode);
            setCountry(selected.country);
            setState(selected.state);
        }
    }, [savedAddresses]);

    const submitHandler = useCallback(async (e) => {
        e.preventDefault();
        if (!isValidPhoneNumber(phoneNo) || !isValidPostalCode(postalCode)) {
            toast.error('Please fill the shipping information correctly');
            return;
        }
        if (!billingSameAsShipping) {
            if (!isValidPhoneNumber(billingPhoneNo) || !isValidPostalCode(billingPostalCode)) {
                toast.error('Please fill the billing information correctly');
                return;
            }
        }

        dispatch(saveShippingInfo({ address, addressLine, city, phoneNo, postalCode, country, state }));

        if (billingSameAsShipping) {
            dispatch(saveBillingInfo({ address, addressLine, city, phoneNo, postalCode, country, state }));
        } else {
            dispatch(saveBillingInfo({ address: billingAddress, addressLine: billingAddressLine, city: billingCity, phoneNo: billingPhoneNo, postalCode: billingPostalCode, country: billingCountry, state: billingState }));
        }

        try {
            await dispatch(createSavedAddress({ address, addressLine, city, phoneNo, postalCode, country, state }));
            navigate('/order/confirm');
        } catch (error) {
            console.error("Error saving address in user model:", error);
        }
    }, [address, addressLine, billingAddress, billingAddressLine, billingCity, billingCountry, billingPhoneNo, billingPostalCode, billingState, billingSameAsShipping, city, country, dispatch, navigate, phoneNo, postalCode, state]);

    return (
        <Fragment>
            <MetaData title="Shipping" />
            <CheckoutSteps shipping />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                        {/* accoridan start */}
                        <div class="accordion accordion-flush" id="accordionFlushExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="flush-headingThree">
                                    <button class="accordion-button collapsed mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" >
                                        Saved Address 
                                    </button>
                                </h2>
                                <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                {savedAddresses && savedAddresses.length > 0 && (
                                <div>
                                    <div>
                                        {savedAddresses.map(address => (
                                            <div key={address._id} className="p-3 col-lg-12">
                                                <input
                                                    type="radio"
                                                    id={address._id}
                                                    name="savedAddress"
                                                    value={address._id}
                                                    checked={selectedAddress === address._id}
                                                    onChange={() => handleAddressSelect(address._id)}
                                                />
                                                <label htmlFor={address._id}>{`${address.address},`} {address.addressLine},</label> <br/>
                                                <label htmlFor={address._id}>{`${address.city},`}</label> <br/>
                                                <label htmlFor={address._id}>{`${address.country} - ${address.postalCode},`}</label> <br/>
                                                <label htmlFor={address._id}>{`${address.phoneNo}`}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                        )}
                            </div>
                    </div>
                        </div>
                        {/* accoridan end */}
                    <form onSubmit={submitHandler} className="shadow-lg" noValidate>
                            <h1 className="mb-4">Shipping Address</h1>
                            <div className="form-group">
                                <label htmlFor="phone_field">Phone No</label>
                                <input
                                    type="text"
                                    id="phone_field"
                                    className="form-control"
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                    required
                                    placeholder="ex:9874653210 "
                                    maxLength={10}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pincode_field">Pin Code</label>
                                <input
                                    type="text"
                                    id="pincode_field"
                                    name="postalCode"
                                    className="form-control"
                                    value={postalCode}
                                    onChange={(e) => handlePincodeChange(e, setPostalCode, setLocalities, setCity, setState, setCountry)}
                                    required
                                    maxLength={6}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address_field">Address</label>
                                <input
                                    type="text"
                                    id="address_field"
                                    className="form-control"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="addressLine_field">Locality / Town</label>
                                <select
                                    id="addressLine_field"
                                    className="form-control"
                                    value={addressLine}
                                    onChange={(e) => setAddressLine(e.target.value)}
                                    required
                                >
                                    <option value="">Select Locality</option>
                                    {localities.map((locality, index) => (
                                        <option key={index} value={locality}>{locality}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="city_field">City</label>
                                <input
                                    type="text"
                                    id="city_field"
                                    className="form-control"
                                    value={city}
                                    readOnly
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="state_field">State</label>
                                <input
                                    type="text"
                                    id="state_field"
                                    className="form-control"
                                    value={state}
                                    readOnly
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="country_field">Country</label>
                                <select
                                    id="country_field"
                                    className="form-control"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                >
                                    {countryList.map((country, i) => (
                                        <option key={i} value={country.name}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    id="billingSameAsShipping"
                                    className="form-check-input"
                                    checked={billingSameAsShipping}
                                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="billingSameAsShipping">
                                    Billing address same as shipping address
                                </label>
                            </div>
                            {!billingSameAsShipping && (
                                <Fragment>
                                    <h1 className="mb-4">Billing Address</h1>
                                    <div className="form-group">
                                        <label htmlFor="billing_phone_field">Phone No</label>
                                        <input
                                            type="text"
                                            id="billing_phone_field"
                                            className="form-control"
                                            value={billingPhoneNo}
                                            onChange={(e) => setBillingPhoneNo(e.target.value)}
                                            required
                                            maxLength={13}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="billing_pincode_field">Pin Code</label>
                                        <input
                                            type="text"
                                            id="billing_pincode_field"
                                            name="billingPostalCode"
                                            className="form-control"
                                            value={billingPostalCode}
                                            onChange={(e) => handlePincodeChange(e, setBillingPostalCode, setBillingLocalities, setBillingCity, setBillingState, setBillingCountry)}
                                            required
                                            maxLength={6}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="billing_address_field">Address</label>
                                        <input
                                            type="text"
                                            id="billing_address_field"
                                            className="form-control"
                                            value={billingAddress}
                                            onChange={(e) => setBillingAddress(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="billing_addressLine_field">Locality / Town</label>
                                        <select
                                            id="billing_addressLine_field"
                                            className="form-control"
                                            value={billingAddressLine}
                                            onChange={(e) => setBillingAddressLine(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Locality</option>
                                            {billingLocalities.map((locality, index) => (
                                                <option key={index} value={locality}>{locality}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="billing_city_field">City</label>
                                        <input
                                            type="text"
                                            id="billing_city_field"
                                            className="form-control"
                                            value={billingCity}
                                            readOnly
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="billing_state_field">State</label>
                                        <input
                                            type="text"
                                            id="billing_state_field"
                                            className="form-control"
                                            value={billingState}
                                            readOnly
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="billing_country_field">Country</label>
                                        <select
                                            id="billing_country_field"
                                            className="form-control"
                                            value={billingCountry}
                                            onChange={(e) => setBillingCountry(e.target.value)}
                                            required
                                        >
                                            {countryList.map((country, i) => (
                                                <option key={i} value={country.name}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Fragment>
                            )}
                            <button
                                id="shipping_btn"
                                type="submit"
                                className="btn btn-block py-3"
                            >
                                SAVE & CONTINUE
                            </button>
                        </form>
                    </div>
            </div>
            </Fragment>
        );
    }
