export default function InvoiceReducer (state,action){
    switch(action.type){
        case 'ADD_INVOICES':{
            return {...state,invoices:action.payload}
        }
        case 'SET_SERVER_ERRORS':{
            return {...state,serverErrors:action.payload}
        }
        default:{
            return state
        }
    }

}