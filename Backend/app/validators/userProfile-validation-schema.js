const Profile=require('../models/userProfile-model')
//const User=require('../models/user-model')

const basicProfileValidationSchema={
    firstName:{
        notEmpty:{
            errorMessage:'firstname cannot be empty '
        },
        isString:{
            errorMessage:"firstname should be a string"
        },
        trim:true
    },
    lastName:{
        notEmpty:{
            errorMessage:'lastname cannot be empty '
        },
        isString:{
            errorMessage:"lastname should be a string"
        },
        trim:true
    },
    dob:{
        notEmpty:{
            errorMessage:'Date of birth cannot be empty'
        },
        isDate:{
            errorMessage:'Date of birth must be a valid Date'
        },
        custom:{
            options: async function(value)
            {
                const dob = new Date(value)
                const today = new Date()
                let age = today.getFullYear() - dob.getFullYear()
                const monthDifference=today.getMonth() - dob.getMonth(); 
                if(monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate()))
                {
                    age--
                    console.log('Age',age)  
                if(age<18 || age>=65)
                {
                    throw new Error('you are not eligible')
                } 
                
            }  
            }          
    }
},
    gender:{
        notEmpty:{
            errorMessage:'gender cannot be empty'
        },
        isIn:{
            options:[['male','female']],
            errorMessage:'gender should be either male/female'
        }

    },
    
    blood:{
        notEmpty:{
            errorMessage:'blood is required'
        },
        isObject:{
            errorMessage:'blood field should be an object'
        },
        custom: {
            options: function(value) {
                if (!value || !value.bloodType || !value.bloodGroup) {
                    throw new Error('bloodType and bloodGroup fields are required');
                }
                else{
                    return true
                }
            }
        }
    },
    lastBloodDonationDate:{
        notEmpty:{
            errorMessage:'Last blood donate date cannot be empty'
        },
        isDate:{
            errorMessage:'Blood donate date must be a valid Date'
        }
    },
    weight:{
        notEmpty:{
            errorMessage:'Last blood donate date cannot be empty'
        },
        isNumeric:{
            errorMessage:'weight must be a numeric value '
        },      
    },
    testedPositiveForHiv:{
        notEmpty:{
            errorMessage:'the value cannot be empty'
        },
        isIn:{
        options:[['yes','no']],
        errorMessage:'the value should be yes/no'
        }
    },
    tattoBodyPiercing:{
        notEmpty:{
            errorMessage:'the value cannot be empty'
        },
        isIn:{
        options:[['yes','no']],
        errorMessage:'the value should be yes/no'
        }
    },
    address: {
        custom: {
            options: function (value) {
                if (!value || typeof value !== 'object') {
                    throw new Error('Address field should be an object');
                }
                if (!value.building || !value.locality || !value.city || !value.state || !value.pincode || !value.country) {
                    throw new Error('Building, locality, city, state, pincode, and country fields are required');
                } else {
                    return true;
                }
            }
        }
}
}

//create 
const updateProfileValidationSchema={
    ...basicProfileValidationSchema,
    phNo:{
        notEmpty:{
            errorMessage:'phNo cannot be empty'
        },
        custom:{
            options:async function(value)
            { 
                if(value.length !==10 || isNaN(Number(value)))
                {
                    throw new Error('phNo is not valid')
                }
                else{
                    return true
                }
            }

        },
        trim:true,
       
    },        
}

const userProfileValidationSchema={
    ...basicProfileValidationSchema,
    phNo:{
        notEmpty:{
            errorMessage:'phNo cannot be empty'
        },
        custom:{
            options:async function(value)
            { 
                const phoneNumber=await Profile.findOne({phNo:value})
                if(phoneNumber)
                {
                    throw new Error('this phno is already is in use')
                }
                if(value.length !==10 || isNaN(Number(value)))
                {
                    throw new Error('phNo is not valid')
                }
                else{
                    return true
                }
            }

        },
        trim:true,    
    },
}
module.exports={
    updateProfileValidationSchema,
    userProfileValidationSchema
}