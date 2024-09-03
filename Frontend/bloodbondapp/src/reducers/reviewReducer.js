export default function ReviewReducer(state, action){
    switch(action.type){
        case 'ADD_REVIEW':{
            return {...state,reviewsData:[...state.reviewsData,action.payload]}
        }
        case 'LIST_REVIEWS':{
            return {...state,reviewsData:action.payload}
        }
        case 'SET_SERVER_ERRORS':{
            return {...state,serverErrors:action.payload}
        }
        default:{
            return state
        }
    }
}