export default function InvoiceReducer(state,action){
    switch(action.type){
        case 'ADD_INVOICES':{
            return {...state,invoiceData:action.payload}
        }
        case 'SET_INVOICE':{
            return {...state,invoiceData:action.payload}
        }
        case 'SET_SERVER_ERRORS':{
            return {...state,serverErrors:action.payload}
        }
        case 'CLEAR_INVOICE':{
            return {...state,invoiceData:action.payload}
        }
        default:{
            return state
        }
    }

}