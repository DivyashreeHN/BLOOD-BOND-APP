const initialState = {
    profileData: [],
    profileDisplayData:[],
    singleProfile:[],
    serverErrors: []
  };
  
  const profileReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_PROFILE':{
        return { ...state, profileData: action.payload }
      }
      case 'DISPLAY_PROFILE':{
        return {...state,profileDisplayData:action.payload}
      }
      
<<<<<<< HEAD
      case 'DISPLAY_USER_PROFILE':{
        return {...state,singleProfile:action.payload}
      }

      case 'DELETE_USER_PROFILE':{
        return {...state,singleProfile:[]}
      }

      case 'EDIT_USER_PROFILE': {
        const updatedProfiles = state.profileData.map(profile => 
            profile._id === action.payload._id ? action.payload : profile
        );
        return {
            ...state,
            profileData: updatedProfiles,
            singleProfile: state.singleProfile._id === action.payload._id ? action.payload : state.singleProfile
        };
    }
=======
      case 'DISPLAY_USER_PROFILE':{ 
        return {...state,singleProfile:action.payload}
      }
>>>>>>> 0c0108e00081d257199244c0c7f41c2cae8ea7e3
        case 'SET_SERVER_ERRORS':{
          return {...state,serverErrors:action.payload}
        }
      default:{
          return {...state}
      }
  }
}
  
<<<<<<< HEAD
  export default profileReducer
  
=======
  export default profileReducer
>>>>>>> 0c0108e00081d257199244c0c7f41c2cae8ea7e3
