const bloodRequestReducer = (state, action) => {
    switch (action.type) {
        case 'REQUESTS_BLOODBANK':{
            return {...state,bloodbankBloodRequests:action.payload}
        }
        case 'ADD_BLOOD_REQUEST':
            return { ...state, bloodRequests: [...state.bloodRequests, action.payload] }

        case 'DISPLAY_USER_BLOOD_REQUEST':
            return { ...state, userBloodRequests: action.payload }

        case 'DELETE_USER_BLOOD_REQUEST':
            return {
                ...state,
                userBloodRequests: state.userBloodRequests.filter(bloodRequest => bloodRequest._id !== action.payload)
            }

            case 'EDIT_USER_BLOOD_REQUEST':
                return {
                    ...state,
                    bloodRequests: state.bloodRequests.map(request =>
                        request._id === action.payload._id ? action.payload : request
                    ),
                    userBloodRequest: state.userBloodRequest && state.userBloodRequest._id === action.payload._id ? action.payload : state.userBloodRequest
                }
              
                //ADMIN
                case 'LIST_BLOODREQUEST_TO_ADMIN':
                    return{
                        ...state,bloodRequestToAdmin:action.payload
                    }

//to user
case 'DISPLAY_BLOODREQUEST_TO_USER':
    return{
        ...state,requestToUser:action.payload
    }
        case 'SET_SERVER_ERRORS':
            return { ...state, serverErrors: action.payload };
//
case 'DISPLAY_OTHER_BLOODREQUEST_TO_USER':
    return{
        ...state,otherRequestToUser:action.payload
    }
        default:
            return state;
    }
}

export default bloodRequestReducer;
