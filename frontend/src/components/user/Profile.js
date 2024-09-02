import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import './user.css'
export default function Profile() {
    const { user } = useSelector(state => state.authState);

    return (
        <Fragment>
            <MetaData title={`Profile`} />
            <div className="container mt-5">
                <div className="row ">
                    <div className=" col-lg-5 mb-4 ">
                        <center >
                            <figure className='avatar avatar-profile'>
                                <img className="rounded-circle img-fluid" src={user.avatar ?? './images/default_avatar.png'} alt='' />
                            </figure>
                            <div>
                                <Link to="/myprofile/update" id="edit_profile" className="btn btn-primary col-lg-6 btn-block my-3 ">
                                Edit Profile
                            </Link>
                            </div>
                            
                        </center>
                    </div>
                    <div className=" col-lg-7 mt-4">
                        <h4>Full Name</h4>
                        <p>{user.name}</p>
                        <h4>Email Address</h4>
                        <p>{user.email}</p>
                        <h4>Joined</h4>
                        <p>{String(user.createdAt).substring(0, 10)}</p>
                        <div className='row mt-4'>
                            <div className='use-link mt-3 '>
                                <Link to="/orders"  className="btn btn-danger col-lg-3  me-2 mb-3">
                                    My Orders
                                </Link>
                                <Link to="/myprofile/update/password" id="edit_profile" className="btn btn-primary col-lg-3   me-2 mb-3">
                                    Change Password
                                </Link>
                                <Link to="/myprofile/saved-address" id="edit_profile" className="btn col-lg-3  btn-primary mb-3">
                                    Saved Address
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>

    )
}