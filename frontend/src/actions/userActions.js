import {
    loginFail,
    loginRequest, 
    loginSuccess,  
    registerFail,
    registerRequest,
    registerSuccess,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail,
    sendVerificationEmailSuccess,
    sendVerificationEmailRequest,
    sendVerificationEmailFail,
    verifyEmailRequest,
    verifyEmailSuccess,
    verifyEmailFail,
    clearError
} from '../slices/authSlice';

import {
    usersRequest,
    usersSuccess,
    usersFail,
    userRequest,
    userSuccess,
    userFail,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFail,
    updateUserRequest,
    updateUserSuccess,
    updateUserFail,
    createSavedAddressRequest,
    createSavedAddressSuccess,
    createSavedAddressFail,
    updateSavedAddressRequest,
    updateSavedAddressSuccess,
    updateSavedAddressFail,
    deleteSavedAddressRequest,
    deleteSavedAddressSuccess,
    deleteSavedAddressFail,
    getAllSavedAddressesRequest,
    getAllSavedAddressesSuccess,
    getAllSavedAddressesFail
} from '../slices/userSlice'
import axios from 'axios';

export const login = (email, password) => async (dispatch) => {

        try {
            dispatch(loginRequest())
            const { data }  = await axios.post(`/api/v1/login`,{email,password});
            dispatch(loginSuccess(data))
        } catch (error) {
            dispatch(loginFail(error.response.data.message))
        }

}
export const clearAuthError = () =>{
    return dispatch => {
        dispatch(clearError)
    }
}

export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest())
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        }

        const response = await axios.post(`/api/v1/register`, userData, config);
        dispatch(registerSuccess(response.data));

        // After successful registration, send the verification email
        //dispatch(sendVerificationEmail(userData.email));

        return response; // Return the entire response object
    } catch (error) {
        dispatch(registerFail(error.response.data.message))
        throw error; // Re-throw the error to handle it in the component
    }
}

// Action creator for sending verification email
export const sendVerificationEmail = (email, token) => async (dispatch) => {
    try {
        dispatch(sendVerificationEmailRequest());
       // await axios.post(`/api/v1/verify-email/${token}`); // Replace with your actual endpoint
        dispatch(sendVerificationEmailSuccess());
    } catch (error) {
        dispatch(sendVerificationEmailFail(error.response.data.message));
    }
}

export const loadUser =  async (dispatch) => {

    try {
        dispatch(loadUserRequest())
       

        const { data }  = await axios.get(`/api/v1/myprofile`);
        dispatch(loadUserSuccess(data))
    } catch (error) {
        dispatch(loadUserFail(error.response.data.message))
    }

}

export const logout =  async (dispatch) => {

    try {
        await axios.get(`/api/v1/logout`);
        dispatch(logoutSuccess())
    } catch (error) {
        dispatch(logoutFail)
    }

}

export const updateProfile = (userData) => async (dispatch) => {

    try {
        dispatch(updateProfileRequest())
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        }

        const { data }  = await axios.put(`/api/v1/update`,userData, config);
        dispatch(updateProfileSuccess(data))
    } catch (error) {
        dispatch(updateProfileFail(error.response.data.message))
    }

}

export const updatePassword = (formData) => async (dispatch) => {

    try {
        dispatch(updatePasswordRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        await axios.put(`/api/v1/password/change`, formData, config);
        dispatch(updatePasswordSuccess())
    } catch (error) {
        dispatch(updatePasswordFail(error.response.data.message))
    }

}

export const forgotPassword = (formData) => async (dispatch) => {

    try {
        dispatch(forgotPasswordRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const { data} =  await axios.post(`/api/v1/password/forgot`, formData, config);
        dispatch(forgotPasswordSuccess(data))
    } catch (error) {
        dispatch(forgotPasswordFail(error.response.data.message))
    }

}

export const resetPassword = (formData, token) => async (dispatch) => {

    try {
        dispatch(resetPasswordRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const { data} =  await axios.post(`/api/v1/password/reset/${token}`, formData, config);
        dispatch(resetPasswordSuccess(data))
    } catch (error) {
        dispatch(resetPasswordFail(error.response.data.message))
    }

}

export const getUsers =  async (dispatch) => {

    try {
        dispatch(usersRequest())
        const { data }  = await axios.get(`/api/v1/admin/users`);
        dispatch(usersSuccess(data))
    } catch (error) {
        dispatch(usersFail(error.response.data.message))
    }

}

export const getUser = id => async (dispatch) => {

    try {
        dispatch(userRequest())
        const { data }  = await axios.get(`/api/v1/admin/user/${id}`);
        dispatch(userSuccess(data))
    } catch (error) {
        dispatch(userFail(error.response.data.message))
    }

}

export const deleteUser = id => async (dispatch) => {

    try {
        dispatch(deleteUserRequest())
        await axios.delete(`/api/v1/admin/user/${id}`);
        dispatch(deleteUserSuccess())
    } catch (error) {
        dispatch(deleteUserFail(error.response.data.message))
    }

}

export const updateUser = (id, formData) => async (dispatch) => {

    try {
        dispatch(updateUserRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        await axios.put(`/api/v1/admin/user/${id}`, formData, config);
        dispatch(updateUserSuccess())
    } catch (error) {
        dispatch(updateUserFail(error.response.data.message))
    }

}
export const verifyEmail = (token) => async (dispatch) => {
    try {
        dispatch(verifyEmailRequest());
        await axios.post(`/api/v1/verify-email/${token}`);
        dispatch(verifyEmailSuccess());
    } catch (error) {
        dispatch(verifyEmailFail(error.response.data.message));
    }
};
// Action creator for creating a new saved address
export const createSavedAddress = (savedAddressData) => async (dispatch) => {
    try {
        dispatch(createSavedAddressRequest());
        const response = await axios.post('/api/v1/users/savedAddresses', savedAddressData);
        dispatch(createSavedAddressSuccess(response.data));
    } catch (error) {
        dispatch(createSavedAddressFail(error.response.data.message));
    }
};

// Action creator for updating an existing saved address
export const updateSavedAddress = (id, updatedData) => async (dispatch) => {
    try {
        dispatch(updateSavedAddressRequest());
        const response = await axios.put(`/api/v1/users/savedAddresses/${id}`, updatedData);
        dispatch(updateSavedAddressSuccess(response.data));
        return response.data; // Return response data for success case
    } catch (error) {
        dispatch(updateSavedAddressFail(error.response.data.message));
        throw error.response.data.message; // Throw error for failure case
    }
};


// Action creator for deleting a saved address
export const deleteSavedAddress = (id) => async (dispatch) => {
    try {
        dispatch(deleteSavedAddressRequest());

        await axios.delete(`/api/v1/users/savedAddresses/${id}`);
        dispatch(deleteSavedAddressSuccess(id)); // Pass the ID of the deleted address
    } catch (error) {
        dispatch(deleteSavedAddressFail(error.response.data.message));
    }
};

// Action creator for getting all saved addresses
export const getAllSavedAddresses = () => async (dispatch) => {
    try {
        dispatch(getAllSavedAddressesRequest());

        const response = await axios.get('/api/v1/users/allsavedAddresses');
        dispatch(getAllSavedAddressesSuccess(response.data));
    } catch (error) {
        dispatch(getAllSavedAddressesFail(error.response.data.message));
    }
};