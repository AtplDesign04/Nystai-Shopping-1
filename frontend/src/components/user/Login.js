import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login } from '../../actions/userActions';
import MetaData from '../layouts/MetaData';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCartItemsFromCart } from '../../actions/cartActions';
import log from './Login.png';
import './user.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const { loading, error, isAuthenticated } = useSelector(state => state.authState);
    const redirect = location.search ? '/' + location.search.split('=')[1] : '/';

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getCartItemsFromCart());
            navigate(redirect);
        }

        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => { dispatch(clearAuthError); }
            });
            return;
        }
    }, [error, isAuthenticated, dispatch, navigate, redirect]);

    return (
        <Fragment>
            <MetaData title={`Login`} />
            <div className="row wrapper-reg">
                <div className="col-10 col-lg-8 form-container-reg">
                    <div className="form-image-reg">
                        <img src={log} height={400} width={400} alt="Login" />
                    </div>
                    <div className="form-content-reg">
                        <form onSubmit={submitHandler} className="shadow-lg form-in-reg" encType='multipart/form-data'>
                            <h1 className="mb-3 text-center">Login</h1>

                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password_field">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password_field"
                                    className="form-control"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <span
                                    className="password-toggle-icon1"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                <span>
                                    <Link to='/password/forgot'>Forgot password?</Link>
                                </span>
                            </div>
                            <center>
                                <button
                                    id="cart_btn"
                                    type="submit"
                                    className="btn btn-primary d-inline"
                                    disabled={loading}
                                >
                                    LOGIN
                                </button>
                            </center>
                        </form>
                    </div>

                </div>

                <center>
                    Don't have an Account? 
                    <Link to='/register' className='ml-2'>
                       Sign in 
                    </Link>
                    
                </center>
            </div>



        </Fragment>
    );
}
