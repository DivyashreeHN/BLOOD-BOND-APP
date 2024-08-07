import axios from 'axios';
import * as Yup from 'yup';
import Swal from 'sweetalert2';





const bloodbankValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  address: Yup.object().shape({
    building: Yup.string().required('Building is required'),
    locality: Yup.string().required('Locality is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string().required('Pincode is required'),
    country: Yup.string().required('Country is required'),
  }),
  geoLocation: Yup.object().shape({
    type: Yup.string().required('Geo location type is required'),
    coordinates: Yup.array().of(Yup.number()).required('Coordinates are required'),
  }),
  availableBlood: Yup.array().of(Yup.string()),
  openingHours: Yup.object().shape({
    opensAt: Yup.object().shape({
      hour: Yup.string().required('Opening hour is required'),
      minutes: Yup.string().required('Opening minutes is required'),
      period: Yup.string().required('Opening period is required'),
    }),
    closesAt: Yup.object().shape({
      chour: Yup.string().required('Closing hour is required'),
      cminutes: Yup.string().required('Closing minutes is required'),
      cperiod: Yup.string().required('Closing period is required'),
    }),
  }),
  services: Yup.array().of(Yup.string()),
  license: Yup.array().of(Yup.string()),
  photos: Yup.array().of(Yup.string()),
  isApproved: Yup.boolean(),
});



export const startAddBloodBank = (formData, clearForm) => {
  return async (dispatch) => {
    try {
      await bloodbankValidationSchema.validate(formData, { abortEarly: false });
      
      const response = await axios.post('http://localhost:3080/api/bloodbanks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
        },
      });
      dispatch(addBloodBank(response.data));
      dispatch(setServerError([]));
      dispatch(setFormError({}));
     
      clearForm();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach((e) => {
          const path = e.path.split('.');
          if (path.length === 2) {
            if (!errors[path[0]]) {
              errors[path[0]] = {};
            }
            errors[path[0]][path[1]] = e.message;
          } else {
            errors[e.path] = e.message;
          }
        });
        dispatch(setFormError(errors));
      } else {
        console.error(err);
        dispatch(setServerError(err.response?.data?.errors || 'An unexpected error occurred'));
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.errors || 'An unexpected error occurred',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };
};

    export const startFetchingBloodBank=()=>{
        return async(dispatch)=>{
            try{
                const response=await axios.get(`http://localhost:3080/api/bloodbanks/display`,{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                })
                dispatch(displayBloodBank(response.data))
            }catch(err){
                console.log(err)
                dispatch(setServerError(err.response.data.errors))
            }
        }
    } 

    export const startFetchingPendingBloodBank=()=>
        {
            return async(dispatch)=>{
                try{
                    const response=await axios.get(`http://localhost:3080/api/bloodbanks/pending`,{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                })
                dispatch(displayPendingBloodBank(response.data))

                }
                catch(err)
                    {
                        console.log(err)
                        dispatch(setServerError(err.response.data.errors))
                    }

            }
        }

        export const startFetchingUpdatedBloodBank=(bloodbankId,value)=>
            {
                return async(dispatch)=>{
                    try{
                        const response=await axios.put(`http://localhost:3080/api/bloodbanks/pending/${bloodbankId}`,{isApproved:value},{
                        headers:{
                            Authorization:localStorage.getItem('token')
                        }
                    })
                    dispatch(displayUpdtedBloodBank(response.data))
                    console.log('updated bloodbank by admin',response.data)
                    }
                    catch(err)
                        {
                            console.log(err)
                            dispatch(setServerError(err.response.data.errors))
                        }
    
                }
            }
            export const startFetchingBloodBanksForUsers=()=>{
                return async(dispatch)=>{
                    try{
                        const response=await axios.get('http://localhost:3080/api/bloodbanks/list',{
                            headers:{
                                Authorization:localStorage.getItem('token')
                            }
                        })
                        dispatch(displayBloodBankForUsers(response.data))
                        console.log('bloodbanks',response.data)
                    }catch(err){
                        console.log(err)
                            dispatch(setServerError(err.response.data.errors))
                    }
                }
            }
    const addBloodBank=(data)=>{
        return {
            type:'ADD_BLOODBANK',
            payload:data
        }
    }
    const displayBloodBank=(data)=>{
        return {
            type:'DISPLAY_BLOODBANK',
            payload:data
        }
    }
    const displayPendingBloodBank=(data)=>{
        return{
            type:'DISPLAY_PENDING_BLOODBANK',
            payload:data
        }
    }

    const displayUpdtedBloodBank=(data)=>
        {
            return{
                type:'DISPLAY_UPDATED_RESPONSE_BY_ADMIN',
                payload:data
            }
        }
    const displayBloodBankForUsers=(data)=>{
        return{
            type:'DISPLAY_BLOODBANK_FOR_USERS',
            payload:data
        }
    }
    const setServerError=(errors)=>{
        return {
            type:'SET_SERVER_ERRORS',
            payload:errors
        }
    }
    const setFormError = (errors) => {
        return {
          type: 'SET_FORM_ERRORS',
          payload: errors,
        };
      };