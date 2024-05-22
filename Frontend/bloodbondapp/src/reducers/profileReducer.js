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
      
      case 'DISPLAY_USER_PROFILE':{ 
        return {...state,singleProfile:action.payload}
      }
        case 'SET_SERVER_ERRORS':{
          return {...state,serverErrors:action.payload}
        }
      default:{
          return {...state}
      }
  }
}
  
  export default profileReducer