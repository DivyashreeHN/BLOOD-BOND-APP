const Invoice=require('../models/invoiceModel')
const invoiceValidationSchema={
    lineItems:{
        custom:{
            options:async function(value){
                if(!Array.isArray(value)){
                    throw new Error('LineItems should be array')
                }
                if(value.length==0){
                    throw new Error('LineItems cannot be empty')
                }
                if(value.every(ele=> typeof ele!='object')){
                    throw new Error('Each LineItems should be in array')
                }
                
                for(const item of value){
                    if(!item.description || typeof item.description!='string'){
                        throw new Error('Each LineItem must have a valid description')
                    }
                    if (!item.units || isNaN(item.units)) {
                        throw new Error('Each LineItem must have a valid numeric units');
                    }
                    if (!item.price || isNaN(item.price)) {
                        throw new Error('Each LineItem must have a valid numeric price');
                    }
                }
                return true
            }
        }
    },
    date:{
        notEmpty:{
            errorMessage:'date is required'
        },
        isDate:{
            errorMessage:'date should be in valid date format'
        }
    }
}
module.exports=invoiceValidationSchema