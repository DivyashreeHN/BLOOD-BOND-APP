export default function userReducer(state,action){
switch(action.type){
    case 'REGISTER_USER':{
        return {...state,registerData:action.payload}
    }
    case 'LOGIN_USER':{
        return {...state,loginData:action.payload}
    }
    case 'SET_SERVER_ERRORS':{
        return {...state,serverErrors:action.payload}
    }
   
    case 'SET_USERS' :{
        return {...state,userDetails:action.payload}
    }
    default:{
        return state
    }
}
}