export default function userHistoryReducer(state,action){
    switch(action.type)
    {
    case 'SET_SERVER_ERRORS':
                return { ...state, serverErrors: action.payload }
    case 'USER_RESPONSE_HISTORY':{
        
                  return {...state,userResponsesHistory:action.payload}
              }
    case 'BLOODBANK_RESPONSES':{
        return {...state,bloodBankResponsesHistory:action.payload}
    } 
    case 'DELETE_RESPONSE':{
        return {...state,bloodBankResponsesHistory:state.bloodBankResponsesHistory.filter((data)=>{
            return data._id!==action.payload._id
        })}
    }      
              
      default:
        return state
    }
    
    }
    