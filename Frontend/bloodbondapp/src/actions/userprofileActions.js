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
            console.log('response',response.data)
            dispatch(AddProfile(response.data))
            dispatch(setServerError([]))
            clearForm()
            console.log('cleared form',form)
        }catch(err){
            
            if (err.response && err.response.data && err.response.data.errors) {
                console.log(err)
                dispatch(setServerError(err.response.data.errors))         
            }
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
            console.log("profiles",response.data)
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
            if (err.response && err.response.data && err.response.data.errors) {
                console.log(err)
                dispatch(setServerError(err.response.data.errors))         
            }
                
    } 
            }
    }
    


const AddProfile = (data) => {
    return {
        type: 'ADD_PROFILE',
        payload: data
    };
};

//DISPLAY IT TO ADMIN

const displayProfile=(data)=>{
    return {
        type:'DISPLAY_PROFILE',
        payload:data
    }
}

const displayUserProfile=(data)=>
    {
        return{
            type:'DISPLAY_USER_PROFILE',
            payload:data
        }
    }

const setServerError = (errors) => {
    return {
        type: 'SET_SERVER_ERRORS',
        payload: errors
    }
}