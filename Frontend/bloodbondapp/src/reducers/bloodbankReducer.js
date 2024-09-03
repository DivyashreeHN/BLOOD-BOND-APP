

const initialState={
    bloodbankData:[],
    bloodbank:[],
    usersBloodbanks:[],
    pendingBloodbanks:[],
    bloodbankRequestUpdatedByAdmin:[],
    serverErrors:[],
    formErrors:{}
}
const bloodbankReducer=(state=initialState,action)=>{
    switch(action.type){
        case 'ADD_BLOODBANK':{
            return {...state,bloodbankData:[...state.bloodbankData,action.payload]}
        }
        case 'DISPLAY_BLOODBANK':{
            return {...state,bloodbank:action.payload}
        }

        case 'DISPLAY_PENDING_BLOODBANK':{
            return {...state,pendingBloodbanks:action.payload}
        }
        case 'SET_SERVER_ERRORS':{
            return {...state,serverErrors:action.payload}
        }
        case 'SET_FORM_ERRORS':{
            return {...state,formErrors:action.payload}
        }


        case 'DISPLAY_UPDATED_RESPONSE_BY_ADMIN':{
            const updatedResponse = state.bloodbankRequestUpdatedByAdmin.map(response => 
                response._id === action.payload._id ? action.payload : response
              );
              return{...state,bloodbankRequestUpdatedByAdmin:updatedResponse}
        }
        case 'DISPLAY_BLOODBANK_FOR_USERS':{
            return {...state,usersBloodbank:action.payload}
        }
        default:{
            return {...state}
        }
    }
}
export default bloodbankReducer