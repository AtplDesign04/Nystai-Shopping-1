import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllSavedAddresses, deleteSavedAddress } from "../../actions/userActions";
import { faTrashCan,faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import './user.css'
const SavedAddress = () => {
  const dispatch = useDispatch();
  const { savedAddresses = [], error } = useSelector(state => state.userState);
  useEffect(() => {
    dispatch(getAllSavedAddresses());
  }, [dispatch, error]);

  const handleDeleteAddress = (addressId) => {
    dispatch(deleteSavedAddress(addressId, error))
      .then(() => {
        // Show toast alert when address is deleted successfully
        //toast.success('Address deleted successfully');

      })
      .catch((error) => {
        // Show toast alert if there is an error while deleting the address
        //toast.error('Failed to delete address');
      });
  };

  return (
    <>
   <section className="container-fluid">

   </section>
      <h1 className="text-center pt-5 pb-4">SAVED ADDRESS</h1>

     <div className="row address-container">
      {/* List of saved addresses */}
      {savedAddresses.map((address) => (
        <div key={address._id} className="col-md-4 pb-4 ">
          <div className="bg-white p-3 address-details">
            <p>{address.address}</p>
            <p>{address.addressLine}</p>
            <p>{address.city},</p>
            <p>{address.country}</p>
            <p>{address.postalCode},</p>
            <p>{address.phoneNo}</p>

            <div className="use-link-rigth d-flex justify-content-end">
              <Link to={`/myprofile/update-saved-address/${address._id}`} style={{fontSize:'20px', cursor:'pointer'}}>
              <FontAwesomeIcon icon={faPenToSquare} />
              </Link>
              <FontAwesomeIcon icon={faTrashCan} id="delete_cart_item" onClick={() => handleDeleteAddress(address._id)} className="fa fa-trash  btn-danger ml-3" style={{fontSize:'19px', cursor:'pointer'}}/>
            </div>
          </div>

        </div>
      ))}
    </div>
    </>
   
  );
};

export default SavedAddress;
