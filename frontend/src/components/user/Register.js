import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError, sendVerificationEmail } from '../../actions/userActions';
import { toast } from 'react-toastify';
import MetaData from '../layouts/MetaData';
import 'react-toastify/dist/ReactToastify.css';
import { sendVerificationEmailFail } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import './user.css'
import reg from './Register-img.avif'
export default function Register() {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [passwordsMatch, setPasswordsMatch] = useState(true); // State to check if passwords match
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("images/default_avatar.png");
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.authState);
    const navigate = useNavigate();

    const onChange = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(e.target.files[0]);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUserData({ ...userData, [e.target.name]: e.target.value });
        }
    };

    // Check if passwords match
    useEffect(() => {
        if (userData.password && userData.confirmPassword) {
            setPasswordsMatch(userData.password === userData.confirmPassword);
        } else {
            setPasswordsMatch(true);
        }
    }, [userData.password, userData.confirmPassword]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!passwordsMatch) {
            toast.error("Passwords do not match");
            return;
        }
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('avatar', avatar);

        try {
            await dispatch(register(formData));
            try {
                await dispatch(sendVerificationEmail(userData.email));
                toast.success("Verification email has been sent to your email address. Please check your inbox.");
                setUserData({ name: "", email: "", password: "" });
                setAvatar("");
                setAvatarPreview("images/default_avatar.png");
                navigate('/success');
            } catch (verificationError) {
                toast.error("An error occurred while sending the verification email.");
            }
        } catch (error) {
            toast.error(error.response && error.response.status === 400 ? "Email already exists." : "An error occurred.");
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(sendVerificationEmailFail);
            dispatch(clearAuthError());
        }
    }, [error, dispatch]);

    return (
        <Fragment>
            <MetaData title={`Register`} />
            <div className="row wrapper-reg">
                <div className="col-10 col-lg-8 form-container-reg">
                    <div className="form-image-reg">
                        <img src={reg} height={400} width={400} alt="Register" />
                    </div>
                    <div className="form-content-reg">
                        <form onSubmit={submitHandler} className="shadow-lg form-in-reg" encType='multipart/form-data'>
                            <h1 className="mb-3 text-center">Register</h1>

                            <div className="form-grou">
                                <label htmlFor="name_field">Name</label>
                                <input name='name' onChange={onChange} type="text" id="name_field" className="form-control" value={userData.name} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    name='email'
                                    onChange={onChange}
                                    className="form-control"
                                    value={userData.email}
                                />
                            </div>

                            <div className="form-group position-relative">
                                <label htmlFor="password_field">Password</label>
                                <input
                                    name='password'
                                    onChange={onChange}
                                    type={showPassword ? "text" : "password"}
                                    id="password_field"
                                    className="form-control"
                                    value={userData.password}
                                />
                                <span
                                    className="password-toggle-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '10px', top: '35px', cursor: 'pointer' }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            <div className="form-group position-relative">
                                <label htmlFor="confirm_password_field">Confirm Password</label>
                                <input
                                    name='confirmPassword'
                                    onChange={onChange}
                                    type={showPassword ? "text" : "password"}
                                    id="confirm_password_field"
                                    className="form-control"
                                    value={userData.confirmPassword}
                                />
                                <span
                                    className="password-toggle-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '10px', top: '35px', cursor: 'pointer' }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match</p>}

                            <div className='form-group'>
                                <label htmlFor='avatar_upload'>Avatar</label>
                                <div className='d-flex align-items-center'>
                                    <div>
                                        <figure className='avatar mr-3 item-rtl'>
                                            <img
                                                src={avatarPreview}
                                                className='rounded-circle'
                                                alt='Avatar'
                                            />
                                        </figure>
                                    </div>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='avatar'
                                            onChange={onChange}
                                            className='custom-file-input'
                                            id='customFile'
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Choose Avatar
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <center>
                                <button
                                    id="cart_btn"
                                    type="submit"
                                    className="btn btn-primary d-inline"
                                    disabled={loading}
                                >
                                    REGISTER
                                </button>
                            </center>

                        </form>
                    </div>
                </div>
            </div>
        </Fragment>

    );
}
