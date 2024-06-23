export default function responseReducer(state,action){
switch(action.type)
{
case 'SET_SERVER_ERRORS':
            return { ...state, serverErrors: action.payload }
case 'ADD_BLOODBANK_RESPONSES':{
              return {...state,responses:action.payload}
          }
    case 'RESPONSE_ADDED_BY_USER':
                // Find the updated response in the state and update it
                const updatedResponses = state.responses.map(response => 
                  response._id === action.payload._id ? action.payload : response
                );
                return { ...state, responses: updatedResponses }
        
          
  default:
    return state
}

}
