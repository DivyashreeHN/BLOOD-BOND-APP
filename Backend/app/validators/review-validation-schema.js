const { isString } = require("lodash")

const reviewValidationSchema={
    name:{
        notEmpty:{
            errorMessage:'name should not be empty'
        },
        isString:{
            errorMessage:'name should be in a string format'
        },
        trim:true,
        custom:{
            options: async function(value)
            { 
                if(/\d/.test(value))
                {
                    throw new Error('name should not contain numbers')
                }
            }
        }
    },
    ratings:{
        notEmpty:{
            errorMessage:'rating should not be empty'
        },
        isNumeric:{
            errorMessage:'ratings should be a number'
        },
        trim:true,
    },
    description:{
        notEmpty:{
            errorMessage:'description should not be empty'
        },
        isString:{
            errorMessage:'description should be a string'
        },
        trim:true,
    }
}
module.exports=reviewValidationSchema