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
    const setServerError=(errors)=>{
        return {
            type:'SET_SERVER_ERRORS',
            payload:errors
        }
    }