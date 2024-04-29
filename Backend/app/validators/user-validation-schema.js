const User=require('../models/user-model')
const userRegisterValidationSchema={
    username:{
        notEmpty:{
            errorMessage:'username should not be empty'
        },
        trim:true
    },
    email:{
        notEmpty:{
            errorMessage:'email should not be empty'
        },
        isEmail:{
            errorMessage:'email should be in a valid format'
        },
        trim:true,
        normalizeEmail:true,
        custom:{
            options:async function(value)
            {
                const user=await User.findOne({email:value})
                if(user)
                {
                    throw new Error("Email already exist")
                }
                else{
                    return true
                }

            }
        }
    },
    password:{
        notEmpty:{
            errorMessage:'password should not be empty'
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:'password length should be within 8-128 characters'
        },
        trim:true
    },
    role:{
        notEmpty:{
            errorMessage:'role should not be empty'
        },
        isIn:{
            options:[['user','admin','bloodbank']],
            errorMessage:'role should be either user/bloodbank nor admin'
        }
    }
}

const userLoginValidationSchema={
    email:{
        notEmpty:{
            errorMessage:"email should not be empty"
        },
        isEmail:{
            errorMessage:"email should be in a valid format"
        },
        trim:true,
        normalizeEmail:true
    },
    password:{
        notEmpty:{
            errorMessage:"password should not be empty"
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:'password length should be within 8 to 128 character'
        },
        trim:true
    }  
}
module.exports=
{
    userRegisterValidationSchema,
    userLoginValidationSchema
}