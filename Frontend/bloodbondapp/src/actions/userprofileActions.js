import axios from 'axios'
export const startAddProfile=(form,clearForm)=>{
    return async(dispatch)=>{
        try{
            console.log(form)
            const response=await axios.post('http://localhost:3080/api/user/profile',form,{
                headers:{
                    'Content-Type': 'application/json',
                    Authorization:localStorage.getItem('token')
                }
               
            })
            dispatch(AddProfile(response.data))
            dispatch(setServerError([]))
            clearForm()
            console.log('cleared form',form)
        }catch(err){
            console.log(err)
            dispatch(setServerError(err.response.data.errors))
        }
    }
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
            const response = await axios.put(`http://localhost:3080/api/user/profile/${id}`, form, {
                headers: {
                   
                    Authorization: localStorage.getItem('token')
                }
            });
            dispatch(editUserProfile(response.data));
            dispatch(setServerError([]));
            clearForm();
            console.log('edited user profile', form);
        } catch (err) {
            console.log(err);
            dispatch(setServerError(err.response.data.errors));
        }
    };
};
    
//ADDING USER PROFILE 

const AddProfile = (data) => {
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

const editUserProfile = (data) => {
    return {
        type: 'EDIT_USER_PROFILE',
        payload: data
    };
};
//SERVER ERRORS

const setServerError = (errors) => {
    return {
        type: 'SET_SERVER_ERRORS',
        payload: errors
    };
};
