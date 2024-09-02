import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router for routing
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import mailsend from './Verification-success.png'
import { Link } from 'react-router-dom';

const EmailVerification = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState({
        success: false,
        message: ''
    });

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`/api/v1/verify-email/${token}`);
                setVerificationStatus({
                    success: response.data.success,
                    message: response.data.message
                });
            } catch (error) {
                toast.error('Something went wrong while verifying email.');
            }
            setLoading(false);
        };

        verifyEmail();
    }, [token]);

    useEffect(() => {
        if (!loading) {
            if (verificationStatus.success) {
                toast.success(verificationStatus.message);
            } 
        }
    }, [loading, verificationStatus]);

    return (
        <div className='success-page'>
      <img src={mailsend} height={200} width={200}/>
      <h1>Welcome</h1>
      <h2>Your Account is verified Successfully</h2>
      <Link to='/login'>
        <button
          id="cart_btn"
          className="btn btn-primary d-inline mt-5"
          disabled={loading}
        >
          Login
        </button>
      </Link>
    </div>
    );
};

export default EmailVerification;
