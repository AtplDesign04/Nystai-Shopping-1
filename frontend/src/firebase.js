// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-NzRy_Wr6xWlM9mfnecYLNx7Sx-blB3I",
  authDomain: "sms-verify-4074d.firebaseapp.com",
  projectId: "sms-verify-4074d",
  storageBucket: "sms-verify-4074d.appspot.com",
  messagingSenderId: "281031837000",
  appId: "1:281031837000:web:d8a86fb9485c1e78a25f7d",
  measurementId: "G-ZCQDXQ1QL6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const setUpRecaptcha = (containerId) => {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }

  window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
    }
  }, auth);
};

const sendOTP = async (phoneNumber) => {
  try {
    setUpRecaptcha('recaptcha-container');
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return true;
  } catch (error) {
    console.error("Error during OTP sending:", error);
    throw error;
  }
};

const verifyOTP = async (otp) => {
  try {
    const result = await window.confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    console.error("Error during OTP verification:", error);
    throw error;
  }
};

export { sendOTP, verifyOTP };
