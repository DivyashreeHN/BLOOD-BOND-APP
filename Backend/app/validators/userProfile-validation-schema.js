const Profile=require('../models/userProfile-model')
const User=require('../models/user-model')
const userProfileValidationSchema={
    firstName:{
        notEmpty:{
            errorMessage:'firstname cannot be empty '
        },
        isString:{
            errorMessage:"firstname should be a string"
        },
        trim:true
    },
    LastName:{
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
            }

        },
        trim:true,
       
    },
    bloodGroup:{
        notEmpty:{
            errorMessage:'Blood group cannot be empty'
        },
        isIn:{
            options:[['A+','A-','B+','B-','AB+','AB-','O+','O-']],
            errorMessage:'Blood group should be within options'
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
    address:{
        notEmpty:{
            errorMessage:'address cannot be empty'
        },
        isString:{
            errorMessage:'Address must be a string'
        },
        trim:true
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
        options:[['Yes','No']],
        errorMessage:'the value should be yes/no'
        }
    },
    tattoBodyPiercing:{
        notEmpty:{
            errorMessage:'the value cannot be empty'
        },
        isIn:{
        options:[['Yes','No']],
        errorMessage:'the value should be yes/no'
        }
    }
}
module.exports=userProfileValidationSchema