const initialState = {
    profileData: [],
    profileDisplayData:[],
    singleProfile:[],
    serverErrors: []
  };
  
  const profileReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_PROFILE':{
        return { ...state, profileData: action.payload } //profiles
      }
      case 'DISPLAY_PROFILE':{
        return {...state,profileDisplayData:action.payload} //admin
      }
      

      case 'DISPLAY_USER_PROFILE':{
        return {...state,singleProfile:action.payload} //user
      }

      case 'DELETE_USER_PROFILE': {
        const updatedProfileDisplayData = state.profileDisplayData.filter((profile) => profile._id !== action.payload._id);
        return {
          ...state,
          profileDisplayData: updatedProfileDisplayData,
          singleProfile: state.singleProfile && state.singleProfile._id === action.payload._id ? null : state.singleProfile
        }//to delete his profile
      }
      

      case 'EDIT_USER_PROFILE': {
        return {
            ...state,
            profileData: state.profileData.map(profile =>
                profile._id === action.payload._id ? action.payload : profile
            ),
            singleProfile: state.singleProfile._id === action.payload._id ? action.payload : state.singleProfile
        }
    }
    

      case 'DISPLAY_USER_PROFILE':{ 
        return {...state,singleProfile:action.payload}
      }

        case 'SET_SERVER_ERRORS':{
          return {...state,serverErrors:action.payload}
        }
      default:{
          return state
      }
  }
}
  
  export default profileReducer
  

