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