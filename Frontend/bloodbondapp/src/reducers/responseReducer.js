const bloodResponseReducer=(state,action)=>{
switch(action.type)
{
    case 'ADD_RESPONSE_BY_ADMIN':
        return{...state,responseByAdmin:action.payload}

    case 'SET_SERVER_ERRORS':
            return { ...state, serverErrors: action.payload }
            
    case 'RESPONSE_ADDED_BY_USER':
                // Find the updated response in the state and update it
                const updatedResponses = state.responseByUser.map(response => 
                  response._id === action.payload._id ? action.payload : response
                );
                return { ...state, responseByUser: updatedResponses }
        
          
  default:
    return state
}

}
export default bloodResponseReducer