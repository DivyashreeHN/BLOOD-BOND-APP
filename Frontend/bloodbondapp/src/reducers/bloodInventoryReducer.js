export default function bloodInventoryReducer(state,action){
    switch(action.type){
        case 'ADD_BLOODINVENTORY':{
            return {...state,bloodInventoryDetails:[...state.bloodInventoryDetails,action.payload]}
        }
        case 'SET_SERVER_ERRORS':{
            return {...state,serverErrors:action.payload}
        }
        case 'LIST_BLOODINVENTORY':{

            return {...state,bloodInventoryDetails:action.payload}
        }
        case 'REMOVE_BLOOD':{
            return {...state,bloodInventoryDetails:state.bloodInventoryDetails.filter((blood)=>{
                return blood._id!=action.payload._id
            })}
        }
        case 'EDIT_BLOODINVENTORY':{
            return {...state,bloodInventoryDetails:state.bloodInventoryDetails.map((blood)=>{
                if(blood._id==action.payload._id){
                    return action.payload
                }
                else{
                    return blood
                }
            })}
        }
        default:{
            return state
        }
    }
}