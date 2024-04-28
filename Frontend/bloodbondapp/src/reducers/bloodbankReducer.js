const initialState={
    bloodbankData:[],
    serverErrors:[]
}
const bloodbankReducer=(state=initialState,action)=>{
    switch(action.type){
        case 'ADD_BLOODBANK':{
            return {...state,bloodbankData:action.payload}
        }
        case 'SET_SERVER_ERRORS':{
            return {...state,serverErrors:action.payload}
        }
        default:{
            return {...state}
        }
    }
}
export default bloodbankReducer