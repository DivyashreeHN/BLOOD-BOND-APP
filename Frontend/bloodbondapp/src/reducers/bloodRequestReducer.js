const bloodRequestReducer = (state, action) => {
    switch (action.type) {
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
            
        case 'SET_SERVER_ERRORS':
            return { ...state, serverErrors: action.payload };

        default:
            return state;
    }
}

export default bloodRequestReducer;
