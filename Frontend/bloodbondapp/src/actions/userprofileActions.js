import axios from 'axios'
import * as yup from 'yup';
import Swal from 'sweetalert2'

const userProfileValidationSchema = yup.object().shape({
    firstName: yup.string()
        .required('First Name is required'),
    lastName: yup.string()
        .required('Last Name is required'),
    dob: yup.date()
        .transform((value, originalValue) => {
            // Handle null, undefined, or non-string originalValue
            if (typeof originalValue !== 'string') return value;
            return originalValue.trim() === "" ? null : value;
        })
        .required('Date of Birth is required'),
    gender: yup.string()
        .required('Gender is required'),
    phNo: yup.string()
        .required('Phone Number is required'),
    blood: yup.object().shape({
        bloodGroup: yup.string()
            .required('Blood Group is required'),
    }),
    lastBloodDonationDate: yup.date()
        .transform((value, originalValue) => {
            // Handle null, undefined, or non-string originalValue
            if (typeof originalValue !== 'string') return value;
            return originalValue.trim() === "" ? null : value;
        })
        .required('Last Blood Donation Date is required'),
    weight: yup.number()
        .transform((value, originalValue) => {
            // Handle null, undefined, or non-string originalValue
            if (typeof originalValue !== 'string') return value;
            return originalValue.trim() === "" ? null : value;
        })
        .required('Weight is required')
        .positive('Weight must be a positive number'),
    testedPositiveForHiv: yup.string()
        .required('Please select an option for HIV testing'),
    tattoBodyPiercing: yup.string()
        .required('Please select an option for Tattoo/Body Piercing'),
    address: yup.object().shape({
        building: yup.string()
            .required('Building number is required'),
        locality: yup.string()
            .required('Locality is required'),
        city: yup.string()
            .required('City is required'),
        state: yup.string()
            .required('State is required'),
        pincode: yup.string()
            .required('Pincode is required'),
        country: yup.string()
            .required('Country is required'),
    })
});


export const startAddProfile=(form,clearForm)=>{
    return async(dispatch)=>{
        try{
            console.log(form)
            await userProfileValidationSchema.validate(form, { abortEarly: false });
            const response=await axios.post('http://localhost:3080/api/user/profile',form,{
                headers:{
                    'Content-Type': 'application/json',
                    Authorization:localStorage.getItem('token')
                }
               
            })
            dispatch(AddProfile(response.data))
            dispatch(setServerError([]))
            dispatch(setFormErrors({}))
            clearForm()
            console.log('cleared form',form)
        }catch (err) {
            if (err.name === 'ValidationError') {
                const errors = {};
                err.inner.forEach((e) => {
                    const keys = e.path.split('.');
                    if (keys.length === 2) {
                        if (!errors[keys[0]]) {
                            errors[keys[0]] = {};
                        }
                        errors[keys[0]][keys[1]] = e.message;
                    } else {
                        errors[e.path] = e.message;
                    }
                });
                dispatch(setFormErrors(errors));
            } else {
                console.error(err);
                dispatch({ type: 'SET_SERVER_ERRORS', payload: err.response.data.errors });
                Swal.fire({
                    title: 'Error!',
                    text: err.response?.data?.errors || 'An unexpected error occurred',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };
}
//DISPLAY PROFILES FOR ADMIN

export const startFetchingProfile=()=>{
    return async(dispatch)=>{
        try{
            const response=await axios.get('http://localhost:3080/api/user/profiles',{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            })
            dispatch(displayProfile(response.data))
            console.log("profilesss",response.data)
        }catch(err){
            console.log(err)
            dispatch(setServerError(err.response.data.errors))
        }
    }
} 

//DISPLAYING HIS PROFILE
 export const startFetchingUserProfile=()=>
    {
        return async(dispatch)=>{
            try{
                const response=await axios.get('http://localhost:3080/api/user/profile',{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                })
                dispatch(displayUserProfile(response.data))
                console.log(" user profile",response.data)
            }
        catch(err){
                console.log(err)
                dispatch(setServerError(err.response.data.errors))         
    } 
            }
        }
    
//DELETING HIS PROFILE

export const startDeletingUserProfile=(id)=>
    {
        return async(dispatch)=>{
            try{
                const response=await axios.delete(`http://localhost:3080/api/user/profile/${id}`,{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                })
                dispatch(deleteUserProfile(response.data))
                console.log(" deleted user profile",response.data)
            }
        catch(err){
                console.log(err)
                dispatch(setServerError(err.response.data.errors))         
    } 
            }
        }

//EDITING USER PROFILE

export const startEditingUserProfile = (id, form, clearForm) => {
    return async (dispatch) => {
        try {
            await userProfileValidationSchema.validate(form, { abortEarly: false });
            const response = await axios.put(`http://localhost:3080/api/user/profile/${id}`, form, {
                headers: {
                   
                    Authorization: localStorage.getItem('token')
                }
            });
            dispatch(editUserProfile(response.data));
            dispatch(setServerError([]));
            dispatch(setFormErrors({}))
            clearForm();
            console.log('edited user profile', form);
        } catch (err) {
            if (err.name === 'ValidationError') {
                const errors = {};
                err.inner.forEach((e) => {
                    const keys = e.path.split('.');
                    if (keys.length === 2) {
                        if (!errors[keys[0]]) {
                            errors[keys[0]] = {};
                        }
                        errors[keys[0]][keys[1]] = e.message;
                    } else {
                        errors[e.path] = e.message;
                    }
                });
                dispatch(setFormErrors(errors));
            } else {
                console.error(err);
                dispatch({ type: 'SET_SERVER_ERRORS', payload: err.response.data.errors });
                Swal.fire({
                    title: 'Error!',
                    text: err.response?.data?.errors || 'An unexpected error occurred',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
            console.log(err);
            dispatch(setServerError(err.response?.data?.errors));
        }
    };
}
    
//ADDING USER PROFILE 

export const AddProfile = (data) => {
    return {
        type: 'ADD_PROFILE',
        payload: data
    };
};

//DISPLAYING PROFILE TO ADMIN

const displayProfile=(data)=>{
    return {
        type:'DISPLAY_PROFILE',
        payload:data
    }
}

// DISPLAYING PROFILE TO USER
const displayUserProfile=(data)=>
    {
        return{
            type:'DISPLAY_USER_PROFILE',
            payload:data
        }
    }

// DELETING USER PROFILE

const deleteUserProfile=(data)=>
    {
        return{
            type:'DELETE_USER_PROFILE',
            payload:data
            
        }
    }

//EDITING USER PROFILE

export const editUserProfile = (data) => {
    return {
        type: 'EDIT_USER_PROFILE',
        payload: data
    };
};
//SERVER ERRORS

export const setServerError = (errors) => {
    return {
        type: 'SET_SERVER_ERRORS',
        payload: errors
    };
};
export const setFormErrors = (errors) => {
    return {
        type: 'SET_FORM_ERRORS',
        payload: errors
    };
};
