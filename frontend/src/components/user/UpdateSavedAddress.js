import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { countries } from 'countries-list';
import { updateSavedAddress } from '../../actions/userActions';
import { toast } from 'react-toastify';
import Loader from '../layouts/Loader';
import { useNavigate } from 'react-router-dom';

// Define a function to fetch details from the Postal PIN Code API
const fetchPostalCodeDetails = async (pincode) => {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching pin code details:", error);
        throw error;
    }
};

const UpdateSavedAddress = () => {
    const { id: addressId } = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authState);
    const countryList = Object.values(countries);
    const [addressData, setAddressData] = useState({
        address: '',
        addressLine: '',
        city: '',
        phoneNo: '',
        postalCode: '',
        country: '',
        state: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const savedAddress = user && user.savedAddress && user.savedAddress.find((address) => address._id === addressId);
        if (savedAddress) {
            setAddressData(savedAddress);
            setIsLoading(false);
        }
    }, [user, addressId]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setAddressData({ ...addressData, [name]: value });
        if (name === 'postalCode'&& value.length === 6) {
            try {
                const data = await fetchPostalCodeDetails(value);
                if (data && data[0]?.PostOffice?.length > 0) {
                    const office = data[0].PostOffice[0];
                    setAddressData(prevState => ({
                        ...prevState,
                        city: office.Name,
                        postalCode: value,
                        state: office.State,
                        country: office.Country
                    }));
                } else {
                    toast.error("Invalid pin code");
                }
            } catch (error) {
                console.error("Error fetching pin code details:", error);
                toast.error("Error fetching pin code details");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(updateSavedAddress(addressId, addressData));
            toast.success('Address updated successfully');
            navigate('/myprofile/saved-address');
        } catch (error) {
            toast.error(error || 'Failed to update address');
        }
    };
    

    if (isLoading) {
        return <Loader/>;
    }
    return (
        <div className="row">
            <div className="col-12 col-md-2"></div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form onSubmit={handleSubmit} className="shadow-lg">
                            <h1 className="mb-4">Update Saved Address</h1>
                            <div className="form-group">
                                <label htmlFor="phone_field">Postal code</label>
                                <input
                                    type="phone"
                                    id="postalCode_field"
                                    name="postalCode"
                                    className="form-control"
                                    value={addressData.postalCode}
                                    onChange={handleChange}
                                    maxLength={6}
                                    required
                                />
                            </div> 
                            <div className="form-group">
                                <label htmlFor="address_field">Address</label>
                                <input
                                    type="text"
                                    id="address_field"
                                    name="address"
                                    className="form-control"
                                    value={addressData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address_field">Locality / Town</label>
                                <input
                                    type="text"
                                    id="address_field"
                                    name="address"
                                    className="form-control"
                                    value={addressData.addressLine}
                                    onChange={handleChange}
                                    required
                                />  
                            </div> 
                            
                            <div className="form-group">
                                <label htmlFor="phone_field">Phone No</label>
                                <input
                                    type="phone"
                                    id="phone_field"
                                    name="phoneNo"
                                    className="form-control"
                                    value={addressData.phoneNo}
                                    onChange={handleChange}
                                    maxLength={10}
                                    required
                                />
                            </div>                         
                           
                            <div className="form-group">
                                <label htmlFor="city_field">City</label>
                                <input
                                    type="text"
                                    id="city_field"
                                    name="city"
                                    className="form-control"
                                    value={addressData.city}
                                    //onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="state_field">State</label>
                                <input
                                    type="text"
                                    id="state_field"
                                    name="state"
                                    className="form-control"
                                    value={addressData.state}
                                    //onChange={handleChange}
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label htmlFor="country_field">Country</label>
                                <select
                                    type="text"
                                    id="country_field"
                                    name="country"
                                    className="form-control"
                                    value={addressData.country}
                                    //onChange={handleChange}
                                    required
                                >
                                     {countryList.map((country, i) => (
                                <option key={i} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                                </select>
                            </div>

                            
                            <button id="shipping_btn" type="submit" className="btn btn-block py-3">
                                Update
                            </button>
                        </form>
                    </div>
                </Fragment>
            </div>
        </div>
    );
};

export default UpdateSavedAddress;
