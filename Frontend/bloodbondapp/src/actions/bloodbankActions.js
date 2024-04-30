    import axios from 'axios'
    export const startAddBloodBank=(formData,clearForm)=>{
        return async(dispatch)=>{
            try{
                console.log(formData)
                const response=await axios.post('http://localhost:3080/api/bloodbanks',formData,{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                        Authorization:localStorage.getItem('token')
                    }
                })
                dispatch(addBloodBank(response.data))
                dispatch(setServerError([]))
                clearForm()
                console.log('cleared form',formData)
            }catch(err){
                console.log(err)
                dispatch(setServerError(err.response.data.errors))
            }
        }
    }
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
    const setServerError=(errors)=>{
        return {
            type:'SET_SERVER_ERRORS',
            payload:errors
        }
    }