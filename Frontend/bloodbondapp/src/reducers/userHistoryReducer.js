export default function userHistoryReducer(state,action){
    switch(action.type)
    {
    case 'SET_SERVER_ERRORS':
                return { ...state, serverErrors: action.payload }
    case 'USER_RESPONSE_HISTORY':{
        
                  return {...state,userResponsesHistory:action.payload}
              }
        
            
              
      default:
        return state
    }
    
    }
    